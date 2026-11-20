"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionPreference } from "@/contexts/MotionContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const INTERACTIVE = 'a, button, [role="button"], summary, label[for]';
const TEXT_FIELDS = "input, textarea, select";

/**
 * Replaces the arrow with a dot that tracks the pointer exactly and a glass ring that follows with a spring,
 * growing over links and buttons. Only on mouse-like devices and never with reduced motion. Text fields keep
 * the native cursor so typing stays clear.
 */
export function MotionCursor() {
  const { effectsOff } = useMotionPreference();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !effectsOff;
  const [mode, setMode] = useState<"idle" | "link" | "text">("idle");
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 300, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-motion-cursor");
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setMode(t?.closest(TEXT_FIELDS) ? "text" : t?.closest(INTERACTIVE) ? "link" : "idle");
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-motion-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const hidden = mode === "text";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden ? 0 : 1, scale: mode === "link" ? 0 : 1 }}
      />
      <motion.div
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/40"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden ? 0 : 1, scale: pressed ? 0.8 : mode === "link" ? 1.25 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      />
    </div>
  );
}
