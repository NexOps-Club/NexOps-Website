"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Compass, Terminal, Network, Cloud, GitMerge, ChevronRight, CheckCircle2, Flag, Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { roadmapsData } from "@/data/resources";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  devops: GitMerge,
  cloud: Cloud,
  networking: Network,
};

/** Topics written as "Name: what to learn" render with the name emphasised. */
function Topic({ text }: { text: string }) {
  const i = text.indexOf(": ");
  if (i === -1) return <span>{text}</span>;
  return (
    <span>
      <span className="font-medium text-ink">{text.slice(0, i)}</span>
      <span className="text-muted">{text.slice(i)}</span>
    </span>
  );
}

export default function ResourcesPage() {
  const [activeId, setActiveId] = useState(roadmapsData[0]?.id ?? "");
  const pillId = useId();
  const current = roadmapsData.find((r) => r.id === activeId) ?? roadmapsData[0];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        icon={Compass}
        badge="Learning Roadmaps"
        title="Engineering Learning Roadmaps"
        description={<>Choose your engineering path. Three domains. Multiple skill levels. One engineering ecosystem.</>}
      />

      {current && (
        <>
          {/* Roadmap tabs */}
          <div
            role="group"
            aria-label="Choose a roadmap"
            className="mx-auto grid max-w-3xl grid-cols-1 gap-1 rounded-2xl border border-line bg-surface/80 p-1.5 sm:grid-cols-3"
          >
            {roadmapsData.map((rm) => {
              const on = rm.id === current.id;
              const Icon = ICONS[rm.id] ?? Terminal;
              return (
                <button
                  key={rm.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActiveId(rm.id)}
                  className={`relative rounded-xl px-4 py-3 text-left transition-colors ${
                    on ? "text-on-primary" : "text-muted hover:bg-sunken/60 hover:text-ink"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId={pillId}
                      className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>
                      <span className="block text-sm font-semibold uppercase tracking-wide">{rm.tabLabel}</span>
                      <span className={`block text-xs ${on ? "text-on-primary/80" : "text-subtle"}`}>{rm.tagline}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected roadmap */}
          <section aria-labelledby="roadmap-title" className="panel space-y-8 p-6 sm:p-10">
            <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                  Beginner to Advanced · {current.steps.length} levels
                </span>
                <h2 id="roadmap-title" className="text-2xl font-bold text-ink sm:text-3xl">
                  {current.title}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-ink-soft">Goal: </span>
                  {current.goal}
                </p>
                {current.note && <p className="max-w-2xl text-xs leading-relaxed text-subtle">{current.note}</p>}
              </div>
              <Link
                href="/join"
                className="glass-pill inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-semibold text-ink md:self-auto"
              >
                <span>Join NexOps</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <ol className="space-y-6">
              {current.steps.map((step, idx) => (
                <li key={`${current.id}-${idx}`}>
                  <Reveal>
                    <article className="panel-inset space-y-5 p-6 transition hover:border-line-strong">
                      <header className="space-y-1">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">{step.stage}</p>
                        <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                        {step.description && <p className="text-xs text-muted">{step.description}</p>}
                      </header>

                      <div className="space-y-2">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-subtle">Topics to learn</p>
                        <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-ink-soft sm:grid-cols-2">
                          {step.topics.map((t) => (
                            <li key={t} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                              <Topic text={t} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {step.tools && (
                        <p className="flex items-start gap-2 text-sm text-ink-soft">
                          <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                          <span>
                            <span className="font-medium text-ink">Tools: </span>
                            {step.tools}
                          </span>
                        </p>
                      )}

                      <div className="space-y-2 border-t border-line pt-4">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-subtle">Practical projects</p>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft marker:text-accent">
                          {step.projects.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                        Milestone: {step.milestone}
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
