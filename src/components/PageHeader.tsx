import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  /** Small pill above the title. Omit to show only the title and intro. */
  badge?: string;
  title: string;
  description: React.ReactNode;
}

/** Shared page title block: badge, heading and intro. Keeps every inner page consistent. */
export function PageHeader({ icon: Icon, badge, title, description }: PageHeaderProps) {
  return (
    <header className="text-center max-w-3xl mx-auto space-y-4">
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-medium uppercase tracking-[0.08em] text-brand">
          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
          <span>{badge}</span>
        </div>
      )}
      <h1 className="text-3xl sm:text-5xl font-bold text-ink tracking-tight leading-[1.1] text-balance">{title}</h1>
      <p className="text-sm sm:text-base text-muted leading-relaxed">{description}</p>
    </header>
  );
}
