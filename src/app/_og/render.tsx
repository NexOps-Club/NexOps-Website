import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";
import { SOCIAL_IMAGE_ALT } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = SOCIAL_IMAGE_ALT;

const NAVY = "#0B1020";
const BLUE = "#3B82F6";
const CYAN = "#06B6D4";
const VIOLET = "#8B5CF6";

// Decorative CN / CC / DevOps triangle that echoes the 3D hero network.
const NETWORK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <radialGradient id="b"><stop offset="0" stop-color="${BLUE}" stop-opacity=".55"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient>
    <radialGradient id="c"><stop offset="0" stop-color="${CYAN}" stop-opacity=".55"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>
    <radialGradient id="v"><stop offset="0" stop-color="${VIOLET}" stop-opacity=".55"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient>
  </defs>
  <g stroke-width="2" stroke-opacity=".5">
    <line x1="90" y1="110" x2="330" y2="80" stroke="${BLUE}"/>
    <line x1="330" y1="80" x2="210" y2="330" stroke="${CYAN}"/>
    <line x1="210" y1="330" x2="90" y2="110" stroke="${VIOLET}"/>
    <line x1="90" y1="110" x2="40" y2="200" stroke="${BLUE}" stroke-opacity=".35"/>
    <line x1="90" y1="110" x2="150" y2="30" stroke="${BLUE}" stroke-opacity=".35"/>
    <line x1="330" y1="80" x2="395" y2="170" stroke="${CYAN}" stroke-opacity=".35"/>
    <line x1="330" y1="80" x2="290" y2="20" stroke="${CYAN}" stroke-opacity=".35"/>
    <line x1="210" y1="330" x2="300" y2="385" stroke="${VIOLET}" stroke-opacity=".35"/>
    <line x1="210" y1="330" x2="110" y2="390" stroke="${VIOLET}" stroke-opacity=".35"/>
  </g>
  <circle cx="90" cy="110" r="46" fill="url(#b)"/><circle cx="90" cy="110" r="14" fill="${BLUE}"/>
  <circle cx="330" cy="80" r="46" fill="url(#c)"/><circle cx="330" cy="80" r="14" fill="${CYAN}"/>
  <circle cx="210" cy="330" r="46" fill="url(#v)"/><circle cx="210" cy="330" r="14" fill="${VIOLET}"/>
  <g fill="#aab4cc" fill-opacity=".8">
    <circle cx="40" cy="200" r="6"/><circle cx="150" cy="30" r="6"/><circle cx="395" cy="170" r="6"/>
    <circle cx="290" cy="20" r="6"/><circle cx="300" cy="385" r="6"/><circle cx="110" cy="390" r="6"/>
  </g>
</svg>`;

/** Shared 1200x630 social card used by opengraph-image and twitter-image. */
export async function renderSocialImage() {
  const [bold, medium, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/SpaceGrotesk-Bold.ttf")),
    readFile(join(process.cwd(), "src/app/_og/SpaceGrotesk-Medium.ttf")),
    readFile(join(process.cwd(), "public/logo-mark.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const networkSrc = `data:image/svg+xml;base64,${Buffer.from(NETWORK_SVG).toString("base64")}`;
  // One coloured phrase per sentence, whatever the tagline is.
  const tagParts = siteConfig.tagline.replace(/\u2019/g, "'").split(/(?<=\.)\s+/);
  const tagColors = [BLUE, VIOLET, CYAN];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: NAVY,
          fontFamily: "Space Grotesk",
          color: "#F8FAFC",
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 12% 8%, rgba(37,99,235,0.28), transparent 45%), radial-gradient(circle at 92% 92%, rgba(139,92,246,0.26), transparent 42%), radial-gradient(circle at 85% 12%, rgba(6,182,212,0.16), transparent 38%)",
          }}
        />
        {/* Accent rule */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 8,
            display: "flex",
            background: `linear-gradient(90deg, ${BLUE}, ${CYAN}, ${VIOLET})`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 56px 72px",
            width: 760,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={96} height={110} alt="" />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: "#AAB4CC" }}>
              Student technical community
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 148, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
              {siteConfig.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 48, fontWeight: 700, lineHeight: 1.15 }}>
              {tagParts.map((part, i) => (
                <span key={part} style={{ color: tagColors[i % tagColors.length] }}>
                  {part}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 14,
              padding: "12px 24px",
              borderRadius: 999,
              border: "2px solid rgba(248,250,252,0.22)",
              background: "rgba(21,27,53,0.85)",
              fontSize: 26,
              fontWeight: 500,
              color: "#DBE2F0",
            }}
          >
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: CYAN }} />
            {`SIET, ${siteConfig.college.city.split(",")[0]}`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={networkSrc} width={420} height={420} alt="" />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Grotesk", data: medium, style: "normal", weight: 500 },
        { name: "Space Grotesk", data: bold, style: "normal", weight: 700 },
      ],
    },
  );
}
