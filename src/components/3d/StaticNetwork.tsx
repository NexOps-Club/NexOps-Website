"use client";

import { useId, useMemo } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";
import { DOMAINS } from "@/data/domains";
import { generateTopology, VIEW } from "./topology";

// Static SVG rendering of the hero topology for reduced motion, no-WebGL and small screens.
// Same layout and camera as the WebGL scene, frozen at a fixed angle.

const W = 800;
const H = 600;
const ROT_X = VIEW.tiltX;
const ROT_Y = VIEW.swingY * 0.6;
const TONE_HEX = { emerald: "#a5b4fc", cyan: "#ff8a5b", violet: "#5eead4" } as const;
const TRAIL_LAGS = [0, 0.14, 0.28];

const focal = H / 2 / Math.tan((VIEW.fov * Math.PI) / 360);
// Server (Node) and browser trig can differ in the last digit; round so hydration matches.
const round = (v: number) => Math.round(v * 100) / 100;

function project(ux: number, uy: number, uz: number, offsetX: number) {
  const x = ux * VIEW.worldScale;
  const y = uy * VIEW.worldScale;
  const z = uz * VIEW.worldScale;
  // rotate around Y then X, then offset like the WebGL group
  const x1 = x * Math.cos(ROT_Y) + z * Math.sin(ROT_Y);
  const z1 = -x * Math.sin(ROT_Y) + z * Math.cos(ROT_Y);
  const y2 = y * Math.cos(ROT_X) - z1 * Math.sin(ROT_X);
  const z2 = y * Math.sin(ROT_X) + z1 * Math.cos(ROT_X);
  const depth = VIEW.cameraZ - z2;
  return {
    x: round(W / 2 + ((x1 + offsetX) * focal) / depth),
    y: round(H / 2 - (y2 * focal) / depth),
    scale: focal / depth,
    fade: round(Math.min(1, Math.max(0.35, (VIEW.cameraZ + 4.5 - depth) / 5))),
  };
}

const { nodes, links } = generateTopology();

interface StaticNetworkProps {
  className?: string;
  /** Center the cluster instead of using the desktop hero's right-shifted framing. */
  centered?: boolean;
  /** Draw the three domain anchors (CN, CC, DevOps) with labels and animated packet trails. */
  anchors?: boolean;
  /** Hub index of the locked-in domain, or null. */
  selected?: number | null;
  /** When set, anchors become focusable, clickable buttons. */
  onSelect?: (hub: number) => void;
}

export function StaticNetwork({
  className = "",
  centered = false,
  anchors = false,
  selected = null,
  onSelect,
}: StaticNetworkProps) {
  const uid = useId();
  const { effectsOff } = useMotionPreference();
  const projected = useMemo(() => {
    const offsetX = centered ? 0 : VIEW.offsetX;
    return nodes.map((n) => ({ ...n, ...project(n.x, n.y, n.z, offsetX) }));
  }, [centered]);
  const glowId = (tone: keyof typeof TONE_HEX) => `${uid}-glow-${tone}`;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={centered ? "xMidYMid meet" : "xMidYMid slice"}
      {...(onSelect
        ? { role: "group", "aria-label": "Domain network: choose Computer Networks, Cloud Computing or DevOps" }
        : { "aria-hidden": true })}
      focusable="false"
    >
      <defs>
        {(Object.keys(TONE_HEX) as (keyof typeof TONE_HEX)[]).map((tone) => (
          <radialGradient key={tone} id={glowId(tone)}>
            <stop offset="0%" stopColor={TONE_HEX[tone]} stopOpacity={0.45} />
            <stop offset="100%" stopColor={TONE_HEX[tone]} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      <g strokeWidth={1}>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={projected[a].x}
            y1={projected[a].y}
            x2={projected[b].x}
            y2={projected[b].y}
            stroke={TONE_HEX[nodes[a].tone]}
            strokeOpacity={round((0.12 + ((i * 37) % 14) / 100) * projected[a].fade)}
          />
        ))}
      </g>
      {projected.map((n, i) => (
        <g key={i} opacity={n.fade}>
          <circle cx={n.x} cy={n.y} r={round(n.radius * n.scale * 3)} fill={`url(#${glowId(n.tone)})`} />
          <circle cx={n.x} cy={n.y} r={round(n.radius * n.scale)} fill={n.hub ? "#e0e7ff" : TONE_HEX[n.tone]} />
        </g>
      ))}
      {anchors && (
        <g>
          {!effectsOff &&
            DOMAINS.map((d, i) => {
              const from = projected[d.hub];
              const to = projected[DOMAINS[(i + 1) % DOMAINS.length].hub];
              const path = `M${from.x} ${from.y} L${to.x} ${to.y}`;
              return TRAIL_LAGS.map((lag, k) => (
                <circle key={`${d.id}-${k}`} r={4 - k} fill="#eef2ff" opacity={1 - k * 0.3}>
                  <animateMotion dur="2.8s" begin={`${-lag * 2.8 - i * 0.9}s`} repeatCount="indefinite" path={path} />
                </circle>
              ));
            })}
          {DOMAINS.map((d) => {
            const n = projected[d.hub];
            const active = selected === d.hub;
            const hex = TONE_HEX[d.tone];
            const press = () => onSelect?.(d.hub);
            return (
              <g
                key={d.id}
                {...(onSelect
                  ? {
                      role: "button",
                      tabIndex: 0,
                      "aria-pressed": active,
                      "aria-label": d.name,
                      onClick: press,
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          press();
                        }
                      },
                      className: "domain-node",
                      style: { cursor: "pointer" },
                    }
                  : {})}
              >
                {/* Oversized transparent target so a fingertip lands on it */}
                <circle cx={n.x} cy={n.y} r={52} fill="transparent" />
                <circle cx={n.x} cy={n.y} r={active ? 30 : 22} fill={`url(#${glowId(d.tone)})`} />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 15 : 11}
                  fill="#0f0c24"
                  stroke={hex}
                  strokeWidth={active ? 4 : 2.5}
                />
                <circle cx={n.x} cy={n.y} r={5} fill={hex} />
                <text
                  x={n.x}
                  y={n.y + 38}
                  textAnchor="middle"
                  fontSize={26}
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight={active ? 700 : 500}
                  fill={active ? "#ffffff" : "#d4d4d8"}
                >
                  {d.short}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
