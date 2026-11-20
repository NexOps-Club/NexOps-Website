import type { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Adds the faint blueprint grid behind the top of the section. */
  grid?: boolean;
  /** Soft coloured light behind the section so each part of the page has its own atmosphere. */
  glow?: "blue" | "cyan" | "violet";
  glowSide?: "left" | "right";
  /** Slightly lighter band with hairlines, to separate it from its neighbours. */
  band?: boolean;
  /** Accessible name when the section has no visible heading id to point at. */
  labelledBy?: string;
}

/** Light content section with the standard width, gutters and vertical rhythm. */
const GLOW: Record<NonNullable<SectionProps["glow"]>, string> = {
  blue: "37 99 235",
  cyan: "6 182 212",
  violet: "139 92 246",
};

export function Section({
  children,
  id,
  className = "",
  grid = false,
  glow,
  glowSide = "right",
  band = false,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative overflow-hidden ${band ? "border-y border-line bg-sunken/40" : ""} ${className}`}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(48% 60% at ${glowSide === "right" ? "90%" : "10%"} 20%, rgb(${GLOW[glow]} / 0.16), rgb(${GLOW[glow]} / 0.05) 55%, transparent 80%)`,
          }}
        />
      )}
      {grid && (
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[560px] overflow-hidden">
          <div className="blueprint-grid" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  /** Small mono label above the heading, e.g. "Domain showcase". */
  eyebrow?: string;
  /** Terminal command shown as "$ command" above the heading, e.g. "ls domains/". */
  command?: string;
  description?: ReactNode;
  /** Heading element; the page title stays an h1 elsewhere, so sections default to h2. */
  as?: ElementType;
  id?: string;
  className?: string;
}

export function SectionHeader({
  title,
  eyebrow,
  command,
  description,
  as: Heading = "h2",
  id,
  className = "",
}: SectionHeaderProps) {
  return (
    <Reveal className={`space-y-3 ${className}`}>
      {command && <div className="cmd-label">{command}</div>}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id} className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-[1.1] text-balance">
        {title}
      </Heading>
      {description && <p className="max-w-[60ch] text-sm sm:text-base text-muted leading-relaxed">{description}</p>}
    </Reveal>
  );
}
