"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { StaticNetwork } from "./StaticNetwork";
import { DOMAINS } from "@/data/domains";
import type { InteractionState, PointerState } from "./NetworkTopology";

// three.js + R3F only load when the 3D scene is actually going to render.
const NetworkTopology = dynamic(() => import("./NetworkTopology"), { ssr: false });

let webglSupport: boolean | null = null;
function hasWebGL(): boolean {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

/**
 * Right-hand hero backdrop (desktop only). Renders the WebGL topology when effects are on,
 * otherwise a static SVG of the same network. Masked on its left edge so it never reaches the copy.
 */
interface HeroNetworkProps {
  /** Hub index of the locked-in domain, or null. */
  selected: number | null;
  onSelect: (hub: number) => void;
}

export function HeroNetwork({ selected, onSelect }: HeroNetworkProps) {
  const { effectsOff } = useMotionPreference();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const use3D = isDesktop && webgl && !effectsOff;

  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: false });
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const interaction = useRef<InteractionState>({ selected: null, hovered: -1, labels: [] });
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    interaction.current.selected = selected;
    onSelectRef.current = onSelect;
  });

  // Defer the 3D chunk until the browser is idle so it never competes with first paint.
  useEffect(() => {
    if (!use3D) return;
    const markReady = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(markReady, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(markReady, 300);
    return () => clearTimeout(id);
  }, [use3D]);

  // Pause rendering when the hero scrolls away or the tab is hidden.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [use3D]);

  // The canvas sits behind the copy and terminal, so track the mouse at window level.
  useEffect(() => {
    if (!use3D) return;
    const onMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const p = pointer.current;
      p.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      p.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      p.inside = Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1;
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [use3D]);

  // The canvas is under the hero copy, so clicks are hit-tested against the anchor the render loop
  // reports as hovered. Real controls (links, buttons, the inspector card) keep their own clicks.
  useEffect(() => {
    if (!use3D) return;
    const onClick = (e: MouseEvent) => {
      const el = containerRef.current;
      const hub = interaction.current.hovered;
      if (!el || hub < 0) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("a, button, input, textarea, select, [data-domain-card]")) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      onSelectRef.current(hub);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [use3D]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hero-network pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
    >
      {use3D ? (
        ready && (
          <div className="absolute inset-0 animate-[net-fade-in_900ms_ease-out_both]">
            <NetworkTopology active={onScreen && tabVisible} pointer={pointer} interaction={interaction} />
          </div>
        )
      ) : (
        <StaticNetwork anchors selected={selected} className="absolute inset-0 h-full w-full" />
      )}
      <div className="hero-vignette absolute inset-0" />
      {use3D && ready &&
        DOMAINS.map((d, i) => (
          <span
            key={d.id}
            ref={(el) => {
              interaction.current.labels[i] = el;
            }}
            data-tone={d.tone}
            data-active={selected === i ? "1" : "0"}
            style={{ transform: "translate(-999px, -999px)" }}
            className="domain-label absolute left-0 top-0"
          >
            {d.short}
          </span>
        ))}
    </div>
  );
}
