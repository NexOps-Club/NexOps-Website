import type { ReactNode } from "react";

interface TerminalPanelProps {
  /** Shown in the title bar, e.g. "nexops ~ domains". */
  title: string;
  children: ReactNode;
  /** Optional controls rendered at the right of the title bar. */
  actions?: ReactNode;
  className?: string;
}

/** Engineering-style panel: title bar with window dots, crop-mark corners and a mono body. */
export function TerminalPanel({ title, children, actions, className = "" }: TerminalPanelProps) {
  return (
    <div className={`terminal-panel dark-stage ${className}`}>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-3.5 py-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-subtle/60" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-subtle/60" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-subtle/60" />
        <span className="ml-1.5 truncate font-mono text-[11px] text-muted">{title}</span>
        {actions && <div className="ml-auto">{actions}</div>}
      </div>
      <div className="px-4 py-3.5 font-mono text-[13px] leading-7 text-ink">{children}</div>
    </div>
  );
}
