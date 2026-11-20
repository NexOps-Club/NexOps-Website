// Fixed aurora + grid layer behind every page. Pure CSS: transform-only animation, no JS.
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="aurora-blob -left-[15%] -top-[20%] h-[70vh] w-[70vw] opacity-60"
        style={{ background: "radial-gradient(closest-side, rgb(37 99 235 / 0.1), transparent)" }}
      />
      <div
        className="aurora-blob -right-[10%] top-[5%] h-[65vh] w-[60vw] opacity-60"
        style={{ background: "radial-gradient(closest-side, rgb(6 182 212 / 0.09), transparent)", animationDelay: "-9s" }}
      />
      <div
        className="aurora-blob left-[25%] top-[45%] h-[60vh] w-[55vw] opacity-50"
        style={{ background: "radial-gradient(closest-side, rgb(139 92 246 / 0.08), transparent)", animationDelay: "-18s" }}
      />
      <div className="grid-overlay" />
    </div>
  );
}
