import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BentoTile } from "@/components/BentoTile";
import { Section, SectionHeader } from "@/components/Section";
import { projectsData } from "@/data/projects";
import { VERIFIED } from "@/lib/verified";

/**
 * Featured member projects. Until project details are verified, only the title, category and stack show.
 * Descriptions, leads and repository or demo links stay hidden (see src/lib/verified.ts).
 */
export function ProjectsShowcase() {
  const featured = projectsData.filter((p) => p.featured).slice(0, 3);
  return (
    <Section labelledBy="projects-title">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeader id="projects-title" className="flex-1 self-stretch" command="git log --projects" title="Production tools and labs" />
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-ink">
          <span>View all projects</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((p) => (
          <BentoTile key={p.id} as="article" tone="dark" className="flex flex-col gap-3 p-7">
            <span className="self-start rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-accent">{p.category}</span>
            <h3 className="text-xl font-bold text-ink">{p.title}</h3>
            {VERIFIED.projectDetails && <p className="text-sm leading-relaxed text-muted">{p.description}</p>}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              {p.techStack.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md bg-ink/[0.07] px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </BentoTile>
        ))}
      </div>
    </Section>
  );
}
