"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MagneticLink } from "@/components/MagneticLink";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useMotionPreference } from "@/contexts/MotionContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { StaticNetwork } from "@/components/3d/StaticNetwork";

// three.js and the post-processing chain only load when the 3D scene is going to render.
const PipelineScene = dynamic(() => import("@/components/3d/PipelineScene"), { ssr: false });

let webglSupport: boolean | null = null;
function hasWebGL(): boolean {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

interface CinematicHeroProps {
  /** Hub index of the locked-in domain, or null. */
  selected: number | null;
  onSelect: (hub: number) => void;
}

/**
 * Black full-bleed hero: large type on the left, the lit pipeline scene across the middle.
 * Falls back to the static SVG network on small screens, without WebGL, or with reduced motion.
 */
export function CinematicHero({ selected, onSelect }: CinematicHeroProps) {
  const { effectsOff } = useMotionPreference();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const use3D = isDesktop && webgl && !effectsOff;

  // Defer the 3D chunk until the browser is idle so it never competes with first paint.
  const [ready, setReady] = useState(false);
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

  return (
    <section
      aria-label="NexOps introduction"
      className="dark-stage cinema relative isolate flex flex-col overflow-hidden lg:block lg:h-[min(100vh-5rem,860px)] lg:min-h-[700px]"
    >
      {/* 3D stage (desktop) */}
      <div className="absolute inset-0 hidden lg:block">
        {use3D ? (
          ready && (
            <div className="absolute inset-0 animate-[net-fade-in_900ms_ease-out_both]">
              <PipelineScene selected={selected} onSelect={onSelect} />
            </div>
          )
        ) : (
          <div className="absolute inset-y-0 right-0 w-[58%]">
            <StaticNetwork anchors selected={selected} onSelect={onSelect} className="absolute inset-0 h-full w-full" />
          </div>
        )}
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_55%_55%,transparent_55%,var(--canvas)_100%)]"
        />
      </div>

      {/* Copy */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[90rem] px-4 pt-14 sm:px-8 lg:px-14 lg:pt-24">
        <p className="pointer-events-auto font-mono text-xs tracking-[0.08em] text-subtle">{siteConfig.tagline}</p>
        <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-ink text-balance sm:text-6xl lg:text-[4.5rem]">
          Engineering
          <br />
          what&rsquo;s next.
        </h1>
        <p className="pointer-events-auto mt-6 max-w-[26rem] text-[15px] leading-relaxed text-muted">
          NexOps is an engineering community exploring DevOps, Cloud Computing and Computer Networks through practical
          learning, experimentation and collaboration.
        </p>
        <MagneticLink
          href="#domains"
          className="glass-pill pointer-events-auto mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-[12.5px] font-medium tracking-[0.08em] text-ink active:scale-[0.97]"
        >
          EXPLORE NEXOPS
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </MagneticLink>
      </div>

      {/* Small screens: interactive SVG network in place of the canvas */}
      <div className="relative mt-4 h-72 sm:h-80 lg:hidden">
        <StaticNetwork centered anchors selected={selected} onSelect={onSelect} className="h-full w-full" />
      </div>

      {/* Recruiting indicator: shown only when recruitment is open in src/config/site.ts */}
      {siteConfig.recruitment.open && (
        <div className="relative z-10 mx-auto flex w-full max-w-[90rem] justify-end px-4 pb-8 pt-4 sm:px-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-14">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 font-mono text-xs text-subtle transition hover:text-ink"
          >
            <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            Recruiting: {siteConfig.recruitment.label}
          </Link>
        </div>
      )}
    </section>
  );
}
