"use client";

import { MotionConfig } from "motion/react";
import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

interface MotionContextType {
  prefersReducedMotion: boolean;
  /** 3D and motion effects are on by default; only the OS "reduce motion" setting turns them off. */
  effectsOff: boolean;
}

const MotionContext = createContext<MotionContextType>({
  prefersReducedMotion: false,
  effectsOff: false,
});

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(subscribe, getReducedMotionSnapshot, getServerSnapshot);
  const effectsOff = prefersReducedMotion;

  // Drives the CSS fallbacks (solid surfaces, no blur, no aurora animation).
  useEffect(() => {
    document.documentElement.dataset.fx = effectsOff ? "off" : "on";
  }, [effectsOff]);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, effectsOff }}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionPreference() {
  return useContext(MotionContext);
}
