"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { useMotionPreference } from "@/contexts/MotionContext";
import { getContentStats, type LiveStats } from "@/lib/stats";

type StatId = (typeof siteConfig.stats)[number]["id"];
type Values = Record<StatId, number | null>;

const DURATION_MS = 1400;
const LIVE: ReadonlySet<StatId> = new Set<StatId>(["members", "registrations"]);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Content-derived counts are known at build time; live counts arrive from /api/stats.
const initialValues: Values = { members: null, registrations: null, ...getContentStats() };

export function StatTiles() {
  const { effectsOff } = useMotionPreference();
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(initialValues);
  const [liveFailed, setLiveFailed] = useState(false);
  const [animated, setAnimated] = useState<Values | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? (res.json() as Promise<LiveStats>) : Promise.reject(res.status)))
      .then((live) => {
        if (!cancelled) setValues((v) => ({ ...v, members: live.members, registrations: live.registrations }));
      })
      .catch(() => {
        if (!cancelled) setLiveFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const settled = liveFailed || (values.members !== null && values.registrations !== null);

  // Count up once all values are known and the tiles scroll into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!settled || effectsOff || !el) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const k = easeOutCubic(t);
          const next = { ...values };
          for (const id of Object.keys(next) as StatId[]) {
            const v = values[id];
            next[id] = v === null ? null : Math.round(v * k);
          }
          setAnimated(t < 1 ? next : null);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [settled, effectsOff, values]);

  const shown = animated ?? values;

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {siteConfig.stats.map((stat) => {
        const value = values[stat.id];
        const live = LIVE.has(stat.id);
        return (
          <div key={stat.id} className="glass-card rounded-2xl p-5 sm:p-6 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-3xl sm:text-4xl font-extrabold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                <span aria-hidden="true">{shown[stat.id] ?? "—"}</span>
                <span className="sr-only">{value ?? (liveFailed ? "not available" : "loading")}</span>
              </p>
              {live && (
                <span
                  className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-emerald-400"
                  title="Live count"
                  aria-hidden="true"
                />
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-100">{stat.label}</p>
            <p className="text-[11px] text-zinc-400 hidden sm:block">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
