import type { ElementType, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Adds the faint blueprint grid behind the top of the section. */
  grid?: boolean;
  /** Accessible name when the section has no visible heading id to point at. */
  labelledBy?: string;
}

/** Light content section with the standard width, gutters and vertical rhythm. */
export function Section({ children, id, className = "", grid = false, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${className}`}>
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
    <div className={`space-y-3 ${className}`}>
      {command && <div className="cmd-label">{command}</div>}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id} className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-[1.1] text-balance">
        {title}
      </Heading>
      {description && <p className="max-w-[60ch] text-sm sm:text-base text-muted leading-relaxed">{description}</p>}
    </div>
  );
}
