"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useMotionPreference } from "@/contexts/MotionContext";

/** Thin cyan-to-blue bar under the top edge that fills as the page is scrolled. Hidden with reduced motion. */
export function ScrollProgress() {
  const { effectsOff } = useMotionPreference();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  if (effectsOff) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-brand to-accent-2"
      style={{ scaleX }}
    />
  );
}
