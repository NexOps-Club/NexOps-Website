"use client";

import { useState } from "react";
import Link from "next/link";
import { eventsData } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventRegisterModal } from "@/components/EventRegisterModal";
import { LevelFilter, type LevelFilterValue } from "@/components/LevelFilter";
import { ZeroToProduction } from "@/components/ZeroToProduction";
import { CinematicHero } from "@/components/CinematicHero";
import { DomainShowcase } from "@/components/DomainShowcase";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { Section, SectionHeader } from "@/components/Section";
import { BentoTile } from "@/components/BentoTile";
import { Reveal } from "@/components/Reveal";
import { EventItem } from "@/types";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [domain, setDomain] = useState<number | null>(null);
  const [level, setLevel] = useState<LevelFilterValue>("all");

  const upcomingEvents = eventsData
    .filter((e) => e.status === "upcoming" && (level === "all" || e.level === level))
    .slice(0, 3);

  return (
    <div className="dark-stage cinema overflow-hidden">
      <CinematicHero selected={domain} onSelect={setDomain} />
      <DomainShowcase selected={domain} onSelect={setDomain} />
      <ZeroToProduction />

      {/* Upcoming events */}
      <Section glow="violet" glowSide="right" labelledBy="events-title">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader id="events-title" className="flex-1 self-stretch" command="ls events/ --upcoming" title="Workshops, talks and CTFs" />
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-ink">
            <span>View all events</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {eventsData.length > 0 && <LevelFilter value={level} onChange={setLevel} className="mt-8" />}

        {upcomingEvents.length === 0 ? (
          <div className="mt-8 space-y-2 rounded-xl border border-dashed border-line-strong p-8 text-center">
            <p className="text-sm font-semibold text-ink-soft">
              {eventsData.length > 0 ? "No upcoming events at this level yet." : "No events announced yet."}
            </p>
            <p className="text-xs text-muted">
              {eventsData.length > 0 ? "Try another level, or start" : "New workshops, talks and CTFs will appear here. Start"} with the{" "}
              <Link href="/resources" className="text-brand hover:underline">
                self-paced roadmaps
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.08} fill>
                <EventCard event={event} onRegister={(ev) => setSelectedEvent(ev)} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <ProjectsShowcase />

      {/* Join */}
      <Section glow="blue" glowSide="right" labelledBy="join-title">
        <Reveal>
        <BentoTile tone="dark" gradientBorder className="flex flex-col items-start justify-between gap-8 p-8 sm:p-12 md:flex-row md:items-center">
          <div className="space-y-3">
            <p className="eyebrow text-accent">Open to every branch and year</p>
            <h2 id="join-title" className="max-w-[20ch] text-3xl font-bold leading-[1.1] tracking-tight text-ink text-balance sm:text-4xl">
              Ready to accelerate your infrastructure career?
            </h2>
            <p className="max-w-[46ch] text-sm text-muted">No prior cloud experience required. Just a willingness to learn.</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="rounded-lg border border-line bg-ink/[0.04] px-3.5 py-2 font-mono text-xs text-ink-soft">
              <span className="text-accent">$</span> ./apply --join
            </span>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f6fa] px-6 py-3 text-sm font-semibold text-[#05070b] shadow-[0_0_34px_-6px_rgb(180_230_255/0.4)] transition hover:bg-white"
            >
              <span>Start Application</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </BentoTile>
        </Reveal>
      </Section>

      {/* Registration modal */}
      <EventRegisterModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
