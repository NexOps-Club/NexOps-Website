"use client";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { eventsData } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventRegisterModal } from "@/components/EventRegisterModal";
import { LevelFilter, type LevelFilterValue } from "@/components/LevelFilter";
import { EventItem } from "@/types";
import { Calendar, Search, Filter } from "lucide-react";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [statusTab, setStatusTab] = useState<"all" | "upcoming" | "past">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState<LevelFilterValue>("all");

  const categories = ["All", "Workshop", "Bootcamp", "Talk", "CTF"];

  const filteredEvents = eventsData.filter((evt) => {
    const matchesStatus =
      statusTab === "all" ? true : evt.status === statusTab;

    const matchesCategory =
      selectedCategory === "All" ? true : evt.category === selectedCategory;

    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = level === "all" ? true : evt.level === level;

    return matchesStatus && matchesCategory && matchesSearch && matchesLevel;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <PageHeader
        icon={Calendar}
        badge="Workshops, Talks & Hackathons"
        title="Club Events & Bootcamps"
        description={
          <>
            Level up with hands-on, live-fire sessions on cloud architectures, networking protocols, Kubernetes clusters, and DevSecOps CTFs.
          </>
        }
      />

      {/* Pick your track */}
      <LevelFilter value={level} onChange={setLevel} />

      {/* Filter and Search Bar */}
      <div className="panel p-4 sm:p-6 space-y-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-canvas border border-line w-full md:w-auto">
            {(["all", "upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`flex-1 md:flex-none capitalize px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusTab === tab
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-muted hover:text-ink-soft"
                }`}
              >
                {tab === "all" ? "All Events" : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-subtle" />
            <input
              type="text"
              placeholder="Search by topic or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink placeholder-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line">
          <span className="text-xs text-subtle font-mono flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-ink text-canvas font-semibold"
                  : "bg-sunken/60 text-muted hover:text-ink-soft hover:bg-sunken"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <h2 className="sr-only">Event listings</h2>
      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Try adjusting your search query or switching filters to see past sessions."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={(ev) => setSelectedEvent(ev)}
            />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      <EventRegisterModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

