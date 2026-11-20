import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BentoTile } from "@/components/BentoTile";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "@/components/Section";
import { projectsData } from "@/data/projects";

/** Featured member projects from src/data/projects.ts. Shows an empty state until projects are added. */
export function ProjectsShowcase() {
  const featured = projectsData.filter((p) => p.featured).slice(0, 3);
  return (
    <Section band glow="cyan" glowSide="left" labelledBy="projects-title">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeader id="projects-title" className="flex-1 self-stretch" command="git log --projects" title="Production tools and labs" />
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-ink">
          <span>View all projects</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      {featured.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-line-strong p-8 text-center">
          <p className="text-sm font-semibold text-ink-soft">No projects listed yet.</p>
          <p className="mt-1 text-xs text-muted">Member projects will appear here once they are added.</p>
        </div>
      ) : (
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} fill>
          <BentoTile as="article" tone="dark" className="flex flex-col gap-3 p-7">
            <span className="self-start rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-accent">{p.category}</span>
            <h3 className="text-xl font-bold text-ink">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{p.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              {p.techStack.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md bg-ink/[0.07] px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </BentoTile>
          </Reveal>
        ))}
      </div>
      )}
    </Section>
  );
}
