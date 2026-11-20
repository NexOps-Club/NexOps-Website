"use client";

import { useRef } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface GlassCardProps {
  /** Shown in the terminal-style title bar, e.g. "~/pillars/cloud-computing". */
  title: string;
  children: React.ReactNode;
  className?: string;
}

const MAX_TILT_DEG = 5;

export function GlassCard({ title, children, className = "" }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { effectsOff } = useMotionPreference();
  // Tilt only for a real mouse; touch devices and reduced motion get a flat card.
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const canTilt = finePointer && !effectsOff;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    if (canTilt) {
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * MAX_TILT_DEG}deg) rotateY(${(px - 0.5) * MAX_TILT_DEG}deg)`;
    }
  };

  const handlePointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`glass-card group flex flex-col rounded-xl overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-ink/[0.06] bg-ink/[0.02] px-3.5 py-2"
      >
        <span className="h-2 w-2 rounded-full bg-danger/70" />
        <span className="h-2 w-2 rounded-full bg-amber-500/70" />
        <span className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="ml-1.5 truncate font-mono text-[10px] text-muted">{title}</span>
      </div>
      {children}
    </div>
  );
}
