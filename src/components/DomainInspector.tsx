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
  emerald: {
    active: "border-emerald-400/60 bg-emerald-500/15 text-emerald-300",
    chip: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    label: "text-emerald-400",
  },
  cyan: {
    active: "border-cyan-400/60 bg-cyan-500/15 text-cyan-300",
    chip: "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
    label: "text-cyan-400",
  },
  violet: {
    active: "border-violet-400/60 bg-violet-500/15 text-violet-300",
    chip: "border-violet-500/25 bg-violet-500/10 text-violet-300",
    label: "text-violet-400",
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
                      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
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
                <p className="text-sm text-zinc-200 leading-relaxed">{domain.analogy}</p>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Tools you&apos;ll touch</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {domain.tools.map((t) => (
                      <span key={t} className={`rounded border px-2 py-0.5 text-[11px] font-mono ${tone.chip}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">What you&apos;ll build</p>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{domain.build}</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-zinc-100">Explore the three domains</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Tap a glowing node in the network, or pick CN, CC or DevOps above, to see what each one
                  means in plain English and what you will build with it.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
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
