import { Boxes, Cloud, Container, Flame, GitMerge, ShipWheel, Terminal, type LucideIcon } from "lucide-react";

// Generic glyphs: lucide no longer ships vendor brand icons.
const stack: { name: string; icon: LucideIcon }[] = [
  { name: "Docker", icon: Container },
  { name: "Kubernetes", icon: ShipWheel },
  { name: "AWS", icon: Cloud },
  { name: "Terraform", icon: Boxes },
  { name: "Linux", icon: Terminal },
  { name: "Prometheus", icon: Flame },
  { name: "GitOps", icon: GitMerge },
];

/** Glass pills that float gently; parallax comes from --mx/--my set on the hero section. */
export function TechChips() {
  return (
    <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-2" aria-label="Tech stack">
      {stack.map(({ name, icon: Icon }, i) => (
        <li
          key={name}
          className="float-chip inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/[0.05] px-3 py-1.5 text-[11px] font-mono text-ink-soft shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] hover:border-primary/40"
          style={{ "--i": i, "--depth": 2 + (i % 3) * 2 } as React.CSSProperties}
        >
          <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          {name}
        </li>
      ))}
    </ul>
  );
}
