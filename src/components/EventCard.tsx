"use client";

import Image from "next/image";
import { EventItem } from "@/types";
import { GlassCard } from "@/components/GlassCard";
import { LEVELS, LEVEL_LABEL } from "@/data/levels";
import { Calendar, Clock, MapPin, UserCheck, CalendarPlus } from "lucide-react";

interface EventCardProps {
  event: EventItem;
  onRegister: (event: EventItem) => void;
}

export function EventCard({ event, onRegister }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";

  const getCalendarUrl = () => {
    const { title, description, location, startTime, endTime } = event.calendarData;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(location)}`;
  };

  return (
    <GlassCard title={`events/${event.slug}`}>
      {/* Event Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-canvas">
        {event.posterImage ? (
          <Image
            src={event.posterImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-primary/20 to-surface flex items-center justify-center">
            <span className="text-subtle font-mono text-sm">[EVENT_POSTER]</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

        {/* Badges */}
        {/* Badges sit on the poster image, so they always use the dark palette */}
        <div className="dark-stage bg-transparent absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-canvas/85 px-2.5 py-1 text-[11px] font-semibold text-brand border border-primary/30">
            {event.category}
          </span>
          <span className="rounded-md bg-canvas/85 px-2.5 py-1 text-[11px] font-mono text-ink-soft border border-ink/15">
            {LEVELS.find((l) => l.id === event.level)?.index}{" // "}{LEVEL_LABEL[event.level]}
          </span>
          {isUpcoming && (
            <span className="flex items-center gap-1.5 rounded-md bg-canvas/85 px-2.5 py-1 text-[11px] font-medium text-accent border border-accent/40">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-brand transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="mt-2 text-xs text-muted line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Date, Time, Venue */}
        <div className="space-y-1.5 text-xs text-muted pt-1 border-t border-ink/10">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-brand shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-danger shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Instructor */}
        {event.instructor && (
          <div className="rounded-lg bg-sunken p-2.5 border border-ink/10 flex items-center gap-2.5 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-brand font-bold text-xs shrink-0">
              {event.instructor.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="font-semibold text-ink-soft truncate">{event.instructor.name}</p>
              <p className="text-[11px] text-muted truncate">{event.instructor.companyOrYear}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-ink/5 px-2 py-0.5 text-[10px] font-mono text-ink-soft"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto pt-3 flex items-center gap-2 border-t border-ink/10">
          {isUpcoming && event.registrationOpen ? (
            <button
              onClick={() => onRegister(event)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover py-2 px-3 text-xs font-semibold text-on-primary transition active:scale-95"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Register Now</span>
            </button>
          ) : (
            <div className="flex-1 rounded-lg bg-ink/5 py-2 px-3 text-center text-xs font-medium text-muted">
              Event Concluded
            </div>
          )}

          {isUpcoming && (
            <a
              href={getCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              title="Add to Google Calendar"
              aria-label={`Add ${event.title} to Google Calendar`}
              className="rounded-lg border border-ink/15 bg-ink/5 p-2 text-ink-soft hover:text-ink hover:bg-ink/10 transition"
            >
              <CalendarPlus className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

