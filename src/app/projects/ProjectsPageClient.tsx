"use client";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { projectsData } from "@/data/projects";
import {
  Code2,
  ExternalLink,
  Search,
  ArrowRight,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Infrastructure",
    "Automation",
    "Monitoring",
    "Developer Tools",
  ];

  const filteredProjects = projectsData.filter((p) => {
    const matchesCat =
      selectedCategory === "All" ? true : p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <PageHeader
        icon={Code2}
        badge="Member Built & Maintained"
        title="Projects & Infrastructure Showcase"
        description={
          <>
            Open-source developer tools, Kubernetes management platforms, and telemetry dashboards engineered by club members to power campus systems.
          </>
        }
      />

      {/* Filter and Search Bar */}
      <div className="panel p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-accent text-on-primary shadow-md shadow-accent/20"
                  : "bg-canvas text-muted hover:text-ink-soft border border-line"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-subtle" />
          <input
            type="text"
            placeholder="Search projects or stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>
      </div>

      <h2 className="sr-only">Project listings</h2>
      {/* Projects Grid */}
      {filteredProjects.length === 0 && (
        <EmptyState
          icon={Search}
          title="No projects found"
          description="Try a different category or search term."
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <GlassCard key={project.id} title={`repo/${project.id}`}>
            <div className="flex flex-1 flex-col p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="rounded bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-xs font-mono text-accent">
                {project.category}
              </span>
              {project.lead && (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>Lead: {project.lead}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">{project.description}</p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-ink/5 px-2 py-0.5 text-[11px] font-mono text-ink-soft"
                >
                  {tech}
                </span>
              ))}
            </div>

            {(project.githubUrl || project.demoUrl) && (
            <div className="mt-auto pt-4 border-t border-ink/10 flex items-center justify-between text-xs">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink-soft hover:text-accent transition"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>View Source Code</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span />
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent transition"
                >
                  <span>Live Sandbox</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Callout */}
      <div className="panel p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-ink">Have a tool or project idea?</h3>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          We sponsor cloud hosting credits, domain names, and hardware compute for approved club member initiatives.
        </p>
        <Link
          href="/join"
          className="inline-flex items-center gap-2 rounded-lg bg-accent hover:bg-accent/90 px-5 py-2.5 text-xs font-bold text-on-primary transition"
        >
          <span>Propose a Project</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
