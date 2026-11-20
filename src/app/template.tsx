/** Route change: content fades in with a short rise. Pure CSS, so nothing stays hidden if JS is slow or off. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
