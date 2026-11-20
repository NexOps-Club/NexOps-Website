"use client";

import { BentoTile } from "@/components/BentoTile";
import { Section, SectionHeader } from "@/components/Section";
import { DOMAINS, type DomainInfo } from "@/data/domains";

const TONE: Record<DomainInfo["tone"], { badge: string; ring: string; label: string }> = {
  blue: { badge: "bg-primary text-on-primary", ring: "border-primary/70 shadow-[0_0_0_1px_rgb(37_99_235/0.5)]", label: "text-brand" },
  cyan: { badge: "bg-[#06b6d4] text-[#0b1020]", ring: "border-accent/70 shadow-[0_0_0_1px_rgb(6_182_212/0.5)]", label: "text-accent" },
  violet: { badge: "bg-[#7c3aed] text-white", ring: "border-accent-2/70 shadow-[0_0_0_1px_rgb(167_139_250/0.5)]", label: "text-accent-2" },
};

interface DomainShowcaseProps {
  /** Hub index of the locked-in domain, or null. Shared with the hero scene. */
  selected: number | null;
  onSelect: (hub: number) => void;
}

/** Three domain tiles. Selecting one also lights its node in the hero. */
export function DomainShowcase({ selected, onSelect }: DomainShowcaseProps) {
  return (
    <Section id="domains" grid glow="cyan" glowSide="right" labelledBy="domains-title">
      <SectionHeader
        id="domains-title"
        command="ls domains/"
        title="Three domains. One pipeline."
        description="The network carries your traffic, the cloud runs your code, and DevOps ships it safely."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {DOMAINS.map((d) => {
          const tone = TONE[d.tone];
          const active = d.hub === selected;
          return (
            <BentoTile
              key={d.id}
              as="article"
              className={`flex flex-col gap-4 p-7 ${active ? tone.ring : ""}`}
              tone="dark"
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-9 w-9 place-items-center rounded-[10px] font-mono text-xs font-semibold ${tone.badge}`}>
                  {d.short === "DevOps" ? "DO" : d.short}
                </span>
                <span className="font-mono text-[11px] text-subtle">~/domains/{d.id}</span>
              </div>
              <h3 className="text-xl font-bold text-ink">{d.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{d.analogy}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.tools.map((t) => (
                  <span key={t} className="rounded-md bg-ink/[0.07] px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto space-y-1 pt-2 text-sm text-ink-soft">
                <span className={`eyebrow ${tone.label}`}>You&rsquo;ll build</span>
                <p>{d.build}</p>
              </div>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(d.hub)}
                className="self-start rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-muted transition hover:border-ink/40 hover:text-ink aria-pressed:border-ink/50 aria-pressed:text-ink"
              >
                {active ? "Lit in the pipeline" : "Light it up in the pipeline"}
              </button>
            </BentoTile>
          );
        })}
      </div>
    </Section>
  );
}
