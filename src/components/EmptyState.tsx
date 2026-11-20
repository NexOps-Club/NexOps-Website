import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/** Consistent "nothing here" panel for filtered lists. */
export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="text-center py-14 rounded-xl border border-dashed border-line-strong bg-surface/50 p-8 space-y-3">
      <Icon className="h-10 w-10 text-subtle mx-auto" aria-hidden="true" />
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
