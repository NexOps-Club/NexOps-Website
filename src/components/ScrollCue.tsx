"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMotionPreference } from "@/contexts/MotionContext";

/** "Scroll" hint at the bottom of the hero: a dot slides down a rail, and the cue fades out once scrolling starts. */
export function ScrollCue() {
  const { effectsOff } = useMotionPreference();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 160], [1, 0]);
  return (
    <motion.a
      href="#domains"
      aria-label="Scroll to the domains section"
      style={{ opacity }}
      className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-subtle transition-colors hover:text-ink lg:flex"
    >
      SCROLL
      <span className="relative block h-9 w-px overflow-hidden bg-white/20">
        {!effectsOff && (
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-white"
            animate={{ y: [-12, 36] }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.3 }}
          />
        )}
      </span>
    </motion.a>
  );
}
