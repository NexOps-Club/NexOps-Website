// Fixed aurora + grid layer behind every page. Pure CSS: transform-only animation, no JS.
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="aurora-blob -left-[15%] -top-[20%] h-[70vh] w-[70vw] opacity-60"
        style={{ background: "radial-gradient(closest-side, rgb(99 102 241 / 0.16), transparent)" }}
      />
      <div
        className="aurora-blob -right-[10%] top-[5%] h-[65vh] w-[60vw] opacity-60"
        style={{ background: "radial-gradient(closest-side, rgb(251 146 60 / 0.16), transparent)", animationDelay: "-9s" }}
      />
      <div
        className="aurora-blob left-[25%] top-[45%] h-[60vh] w-[55vw] opacity-50"
        style={{ background: "radial-gradient(closest-side, rgb(56 189 248 / 0.12), transparent)", animationDelay: "-18s" }}
      />
      <div className="grid-overlay" />
    </div>
  );
}
