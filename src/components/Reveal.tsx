"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait once the element enters view. Use index * 0.06 for staggered groups (cap at about 0.4). */
  delay?: number;
  /** Make the single child stretch to the wrapper height (for equal-height grid cells). */
  fill?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * Fades and lifts its children (16px, 600ms) the first time they scroll into view.
 *
 * Content is fully visible on the server and before hydration. Only elements that start below the fold are
 * hidden, and only after mount, so nothing is ever left invisible. Reduced motion skips the effect entirely.
 * The phase lives in a data attribute written straight to the DOM, so no re-render happens.
 */
export function Reveal({ children, delay = 0, fill = false, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { effectsOff } = useMotionPreference();

  useEffect(() => {
    const el = ref.current;
    if (!el || effectsOff || typeof IntersectionObserver === "undefined") return;
    // Already on screen at load: leave it as is.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.phase = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Two frames so the hidden state is painted before the transition starts.
        requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.phase = "shown")));
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.phase;
    };
  }, [effectsOff]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${fill ? "[&>*]:h-full" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
