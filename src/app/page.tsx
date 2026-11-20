"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { eventsData } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventRegisterModal } from "@/components/EventRegisterModal";
import { DomainInspector } from "@/components/DomainInspector";
import { LevelFilter, type LevelFilterValue } from "@/components/LevelFilter";
import { ZeroToProduction } from "@/components/ZeroToProduction";
import { HeroNetwork } from "@/components/3d/HeroNetwork";
import { StaticNetwork } from "@/components/3d/StaticNetwork";
import { useMotionPreference } from "@/contexts/MotionContext";
import { EventItem } from "@/types";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [domain, setDomain] = useState<number | null>(null);
  const [level, setLevel] = useState<LevelFilterValue>("all");
  const heroRef = useRef<HTMLElement>(null);
  const { effectsOff } = useMotionPreference();

  // Feeds --mx/--my (-1..1) to the floating tech chips for a gentle parallax.
  const handleHeroPointer = (e: React.PointerEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el || effectsOff || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };

  const upcomingEvents = eventsData
    .filter((e) => e.status === "upcoming" && (level === "all" || e.level === level))
    .slice(0, 3);
  
  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        onPointerMove={handleHeroPointer}
        className="dark-stage relative isolate pt-12 pb-16 sm:pt-20 sm:pb-24"
      >
        <HeroNetwork selected={domain} onSelect={setDomain} />
        {/* Dark hero dissolves into the light page below */}
        <div aria-hidden="true" className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Brand lockup: logo + club name */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <Image
                  src="/logo-mark.png"
                  alt=""
                  width={110}
                  height={66}
                  loading="eager"
                  className="h-[66px] w-[110px] object-contain drop-shadow-[0_0_24px_rgb(59_130_246/0.4)]"
                />
                <div className="text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink leading-none">
                    {siteConfig.name}
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm font-mono text-brand">{siteConfig.tagline}</p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
                Bridging code and{" "}
                <span className="bg-gradient-to-r from-brand via-accent to-accent-2 bg-clip-text text-transparent">
                  cloud infrastructure.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-ink-soft max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong className="text-ink">{siteConfig.name}</strong>. We build, automate,
                deploy, and scale real systems.
                From raw Linux kernels to global Kubernetes clusters.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/join"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition active:scale-95"
                >
                  <span>Apply to Join</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-ink/5 hover:bg-ink/10 hover:border-ink/25 hover:text-ink px-5 py-3 text-sm font-semibold text-ink transition"
                >
                  <span>Explore Workshops</span>
                </Link>
              </div>
            </div>

            {/* Right Column: the 3D network shows through on desktop; the inspector card is mobile-only */}
            <div className="lg:col-span-5 lg:self-end">
              {/* Small screens: interactive SVG network in place of the canvas (no WebGL on mobile) */}
              <div className="lg:hidden -mx-4 h-64 sm:h-80">
                <StaticNetwork centered anchors selected={domain} onSelect={setDomain} className="h-full w-full" />
              </div>
              <DomainInspector selected={domain} onSelect={setDomain} className="mt-2 lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      <ZeroToProduction />

      {/* Upcoming Events Highlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-ink/10">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand">
              Live & Upcoming
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
              Workshops, Talks & CTFs
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs sm:text-sm font-semibold text-brand hover:text-brand flex items-center gap-1.5 transition"
          >
            <span>View all events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <LevelFilter value={level} onChange={setLevel} className="mt-6" />

        {upcomingEvents.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-ink/15 p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-ink-soft">No upcoming events at this level yet.</p>
            <p className="text-xs text-muted">
              Try another level, or start with the{" "}
              <Link href="/resources" className="text-brand hover:underline">
                self-paced roadmaps
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={(ev) => setSelectedEvent(ev)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Join CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass-surface rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Ready to start?</h2>
          <p className="text-xs sm:text-sm text-muted">
            Open to every branch and year. No prior cloud experience required.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-bold text-on-primary transition active:scale-95"
          >
            <span>Apply to Join</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegisterModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
