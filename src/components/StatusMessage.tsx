interface StatusMessageProps {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}

const TONES = {
  error: "border-danger/40 bg-danger/10 text-danger",
  success: "border-accent/40 bg-accent/10 text-accent",
  info: "border-primary/30 bg-primary/10 text-brand",
};

/** Inline error / success / info banner. Errors are announced to screen readers. */
export function StatusMessage({ tone, children, className = "" }: StatusMessageProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border p-3 text-xs font-mono leading-relaxed ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
