"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { animate } from "motion/react";
import { useMotionPreference } from "@/contexts/MotionContext";

/** Link that leans up to 8px toward a mouse pointer. Touch, pen and reduced motion get no movement. */
export function MagneticLink({ children, ...props }: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { effectsOff } = useMotionPreference();
  const spring = { type: "spring", stiffness: 300, damping: 24 } as const;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || effectsOff || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.14;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
    animate(el, { x: Math.max(-8, Math.min(8, dx)), y: Math.max(-6, Math.min(6, dy)) }, spring);
  };
  const reset = () => {
    if (ref.current) animate(ref.current, { x: 0, y: 0 }, spring);
  };

  return (
    <Link ref={ref} onPointerMove={move} onPointerLeave={reset} {...props}>
      {children}
    </Link>
  );
}
