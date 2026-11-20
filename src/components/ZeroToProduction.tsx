import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/Section";
import { VERIFIED } from "@/lib/verified";

const STEPS = [
  {
    when: "Week 1",
    stage: "Foundations",
    items: ["Linux command line", "Git workflows", "How an HTTP request actually works"],
    tone: "text-brand",
  },
  {
    when: "Month 1",
    stage: "Containers & Cloud",
    items: ["Dockerizing an app", "Subnetting basics", "Deploying to a cloud VM"],
    tone: "text-accent",
  },
  {
    when: "Semester Goal",
    stage: "Production",
    items: [
      "Automated CI/CD pipelines",
      "Monitoring dashboards",
      VERIFIED.homelab ? "Contributing to the club homelab" : "Contributing to club projects",
    ],
    tone: "text-accent-2",
  },
];

export function ZeroToProduction() {
  return (
    <Section band glow="blue" glowSide="left" labelledBy="roadmap-title">
      <SectionHeader
        id="roadmap-title"
        command="cat roadmap.md"
        title="From first command to live deploy"
        description="No prior cloud experience needed. Here is the path most members follow in their first semester."
      />

      <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {STEPS.map((step, i) => (
          <li key={step.when} className="relative">
            <GlassCard title={`~/path/${i + 1}-${step.stage.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <div className="p-6 space-y-3">
                <p className={`text-xs font-mono font-semibold uppercase tracking-wider ${step.tone}`}>{step.when}</p>
                <h3 className="text-base font-bold text-ink">{step.stage}</h3>
                <ul className="space-y-1.5 text-xs text-ink-soft">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className={`mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current ${step.tone}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
            {i < STEPS.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 -right-[18px] z-10 h-4 w-4 -translate-y-1/2 text-subtle"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 text-center">
        <Link href="/resources" className="text-xs sm:text-sm font-semibold text-brand hover:text-brand transition">
          See the full learning roadmaps &rarr;
        </Link>
      </div>
    </Section>
  );
}
