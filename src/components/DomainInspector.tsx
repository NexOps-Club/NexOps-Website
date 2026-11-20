"use client";

import { GlassCard } from "@/components/GlassCard";
import { DOMAINS, type DomainInfo } from "@/data/domains";

interface DomainInspectorProps {
  /** Hub index of the locked-in domain, or null. */
  selected: number | null;
  onSelect: (hub: number) => void;
  className?: string;
}

const TONE_CLASS: Record<DomainInfo["tone"], { active: string; chip: string; label: string }> = {
  blue: {
    active: "border-primary/60 bg-primary/15 text-brand",
    chip: "border-primary/25 bg-primary/10 text-brand",
    label: "text-brand",
  },
  cyan: {
    active: "border-accent/60 bg-accent/15 text-accent",
    chip: "border-accent/25 bg-accent/10 text-accent",
    label: "text-accent",
  },
  violet: {
    active: "border-accent-2/60 bg-accent-2/15 text-accent-2",
    chip: "border-accent-2/25 bg-accent-2/10 text-accent-2",
    label: "text-accent-2",
  },
};

/** Click-to-inspect card paired with the hero network. Doubles as the keyboard path to the three anchors. */
export function DomainInspector({ selected, onSelect, className = "" }: DomainInspectorProps) {
  const domain = DOMAINS.find((d) => d.hub === selected) ?? null;
  const tone = domain ? TONE_CLASS[domain.tone] : null;

  return (
    <div data-domain-card className={className}>
      <GlassCard title={`~/domains/${domain ? domain.id : "select"}`}>
        <div className="p-5 space-y-4">
          <div role="group" aria-label="Choose a domain" className="flex gap-1.5">
            {DOMAINS.map((d) => {
              const active = d.hub === selected;
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(d.hub)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-mono font-semibold transition ${
                    active
                      ? TONE_CLASS[d.tone].active
                      : "border-ink/10 bg-ink/5 text-ink-soft hover:bg-ink/10 hover:text-ink"
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>

          <div aria-live="polite" className="min-h-[11rem] space-y-3.5">
            {domain && tone ? (
              <>
                <h3 className={`text-base font-bold ${tone.label}`}>{domain.name}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{domain.analogy}</p>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted">Tools you&apos;ll touch</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {domain.tools.map((t) => (
                      <span key={t} className={`rounded border px-2 py-0.5 text-[11px] font-mono ${tone.chip}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted">What you&apos;ll build</p>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed">{domain.build}</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-ink">Explore the three domains</h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Tap a glowing node in the network, or pick CN, CC or DevOps above, to see what each one
                  means in plain English and what you will build with it.
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  Packets flow CN to CC to DevOps: the network carries your traffic, the cloud runs your
                  code, and DevOps ships it safely.
                </p>
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
