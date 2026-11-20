"use client";

import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { roadmapsData } from "@/data/resources";
import {
  Compass,
  Terminal,
  Network,
  Server,
  Layers,
  GitMerge,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>("linux");

  const currentRoadmap =
    roadmapsData.find((r) => r.id === activeRoadmapId) || roadmapsData[0];

  const getIcon = (id: string) => {
    switch (id) {
      case "linux":
        return <Terminal className="h-4 w-4" />;
      case "networking":
        return <Network className="h-4 w-4" />;
      case "docker":
        return <Layers className="h-4 w-4" />;
      case "kubernetes":
        return <Server className="h-4 w-4" />;
      case "cicd":
        return <GitMerge className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <PageHeader
        icon={Compass}
        badge="Curated Knowledge Bases"
        title="Cloud & DevOps Roadmaps"
        description={
          <>
            Step-by-step learning paths curated by club leads and industry alumni. From your very first bash prompt to deploying microservices on Kubernetes.
          </>
        }
      />

      {/* Roadmap Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface/80 border border-line max-w-4xl mx-auto">
        {roadmapsData.map((rm) => {
          const isActive = rm.id === activeRoadmapId;
          return (
            <button
              key={rm.id}
              onClick={() => setActiveRoadmapId(rm.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                  : "text-muted hover:text-ink hover:bg-sunken/60"
              }`}
            >
              {getIcon(rm.id)}
              <span>{rm.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Roadmap Display */}
      <div className="panel p-6 sm:p-10 space-y-8">
        {/* Roadmap Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
          <div className="space-y-1">
            <span className="text-xs font-mono text-brand uppercase tracking-wider font-semibold">
              Paced Curriculum • {currentRoadmap.duration}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {currentRoadmap.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-2xl pt-1">
              {currentRoadmap.summary}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/join"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/30 px-3.5 py-2 text-xs font-semibold text-brand hover:bg-primary/20 transition"
            >
              <span>Join Mentored Cohort</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {currentRoadmap.steps.map((step, idx) => (
            <div
              key={idx}
              className="panel-inset p-6 space-y-4 hover:border-line-strong transition"
            >
              <div>
                <h3 className="text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Topics Grid */}
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-subtle font-semibold">
                  Key Competencies to Master:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-soft">
                  {step.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Resources & Labs */}
              <div className="pt-3 border-t border-line space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-subtle font-semibold">
                  Recommended Free Labs & Guides:
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.freeResources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft hover:border-primary/40 hover:text-brand transition"
                    >
                      <span className="rounded bg-sunken px-1.5 py-0.2 text-[10px] font-mono text-brand">
                        {res.type}
                      </span>
                      <span>{res.name}</span>
                      <ExternalLink className="h-3 w-3 text-subtle" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

