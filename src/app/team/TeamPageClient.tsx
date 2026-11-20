"use client";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import Image from "next/image";
import { teamData } from "@/data/team";
import { Mail, Sparkles, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";

type CategoryFilter = "all" | "faculty" | "leads" | "core";

interface CategoryOption {
  label: string;
  value: CategoryFilter;
}

/** Member photo with an initials fallback if the remote image fails to load. */
function MemberPhoto({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={name}
        className="absolute inset-0 flex items-center justify-center bg-sunken font-heading text-4xl font-bold text-subtle"
      >
        {name
          .replace(/^(Dr|Prof)\.?\s+/i, "")
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase())
          .join("")}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function TeamPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const filteredMembers =
    filter === "all"
      ? teamData
      : teamData.filter((member) => member.category === filter);

  const categories: CategoryOption[] = [
    { label: "Everyone", value: "all" },
    { label: "Faculty Coordinators", value: "faculty" },
    { label: "Student Leads", value: "leads" },
    { label: "Core Committee", value: "core" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <PageHeader
        icon={Sparkles}
        badge="The People Behind the Terminals"
        title="Leadership & Core Team"
        description={
          <>
            Faculty mentors, student leads, and enthusiastic engineers who organize labs, maintain cluster infrastructure, and teach weekly workshops at SIET.
          </>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              filter === cat.value
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "bg-surface text-muted hover:text-ink-soft hover:bg-sunken border border-line"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <h2 className="sr-only">Team members</h2>
      {/* Members Grid */}
      {filteredMembers.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No team members in this group"
          description="Choose another group to see the rest of the team."
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <GlassCard key={member.id} title={`~/team/${member.id}`}>
            {/* Member Photo */}
            <div className="relative h-56 w-full overflow-hidden bg-canvas">
              <MemberPhoto src={member.photoUrl} name={member.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
              {member.track && (
                <span className="absolute top-3 left-3 rounded bg-surface/90 border border-primary/30 px-2 py-0.5 text-[10px] font-mono text-brand z-10">
                  {member.track}
                </span>
              )}
            </div>

            {/* Member Details */}
            <div className="flex flex-1 flex-col p-5 space-y-3">
              <div>
                <h3 className="text-base font-bold text-ink group-hover:text-brand transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-brand">{member.role}</p>
                <p className="text-[11px] text-muted">{member.yearOrDesignation}</p>
              </div>

              <p className="text-xs text-muted leading-relaxed flex-1">
                {member.bio}
              </p>

              {/* Badges */}
              {member.badges && member.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {member.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded bg-ink/5 px-2 py-0.5 text-[10px] font-mono text-ink-soft"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Icons */}
              <div className="pt-3 border-t border-ink/10 flex items-center gap-2">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-1.5 text-muted hover:text-ink hover:bg-ink/10 transition"
                    aria-label={`${member.name} GitHub`}
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-1.5 text-muted hover:text-ink hover:bg-ink/10 transition"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="rounded p-1.5 text-muted hover:text-ink hover:bg-ink/10 transition"
                    aria-label={`${member.name} Email`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recruitment Callout Banner */}
      <div className="panel p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-ink">Want to join the Core Team?</h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            We are actively looking for student coordinators, workshop instructors, and lab administrators.
            Step up and lead tech sessions in the next semester!
          </p>
        </div>
        <Link
          href="/join"
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-5 py-2.5 text-xs font-bold text-on-primary transition active:scale-95 shadow-md shadow-primary/20"
        >
          <span>Apply as Core Member</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
