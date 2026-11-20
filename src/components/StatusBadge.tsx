const TONES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  reviewing: "bg-primary/10 text-brand border-primary/30",
  unread: "bg-primary/10 text-brand border-primary/30",
  accepted: "bg-accent/10 text-accent border-accent/30",
  confirmed: "bg-accent/10 text-accent border-accent/30",
  attended: "bg-accent/10 text-accent border-accent/30",
  replied: "bg-accent/10 text-accent border-accent/30",
  rejected: "bg-danger/10 text-danger border-danger/30",
  cancelled: "bg-danger/10 text-danger border-danger/30",
};

/** Colour-coded record status (applications, RSVPs, messages). Unknown statuses fall back to neutral. */
export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[status] ?? "bg-sunken text-ink-soft border-line";
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-mono ${tone}`}>
      <span aria-hidden="true">●</span>
      {status}
    </span>
  );
}
