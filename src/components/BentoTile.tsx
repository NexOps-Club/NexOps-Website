import type { ElementType, ReactNode } from "react";

interface BentoTileProps {
  children: ReactNode;
  /** "dark" renders a Midnight Navy tile with light text; "light" is a white tile. */
  tone?: "light" | "dark";
  /** Adds the blue, cyan and violet hairline border. */
  gradientBorder?: boolean;
  as?: ElementType;
  className?: string;
}

/** Rounded content tile for bento grids. Sizing and grid placement come from className. */
export function BentoTile({
  children,
  tone = "light",
  gradientBorder = false,
  as: Tag = "div",
  className = "",
}: BentoTileProps) {
  const toneClass = tone === "dark" ? "dark-stage" : "";
  const borderClass = gradientBorder ? "gradient-border" : "";
  return <Tag className={`bento-tile p-6 ${toneClass} ${borderClass} ${className}`}>{children}</Tag>;
}
