"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { LEVELS } from "@/data/levels";
import type { EventLevel } from "@/types";

export type LevelFilterValue = "all" | EventLevel;

interface LevelFilterProps {
  value: LevelFilterValue;
  onChange: (value: LevelFilterValue) => void;
  className?: string;
}

/** Segmented glass pill bar: "Pick your track". */
export function LevelFilter({ value, onChange, className = "" }: LevelFilterProps) {
  const options: { id: LevelFilterValue; index: string; label: string; hint: string }[] = [
    { id: "all", index: "00", label: "All Levels", hint: "Every workshop and event" },
    ...LEVELS,
  ];
  const pillId = useId();
  const active = options.find((o) => o.id === value);

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Pick your track"
        className="glass-surface grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl p-1"
      >
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={`relative rounded-lg px-3 py-2 text-left sm:text-center text-xs transition-colors ${
                on ? "font-semibold text-on-primary" : "text-ink-soft hover:bg-ink/10 hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={pillId}
                  className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">
                <span className={`font-mono ${on ? "text-on-primary" : "text-brand"}`}>{o.index}{" // "}</span>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-2 text-center text-[11px] font-mono text-muted">
        {active?.hint}
      </p>
    </div>
  );
}
