import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AmbientBackground } from "@/components/AmbientBackground";
import { MotionProvider } from "@/contexts/MotionContext";
import { MotionCursor } from "@/components/MotionCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Needs NEXT_PUBLIC_SITE_URL at build time in production; local development falls back to localhost.
const siteUrl = getSiteUrl() ?? (process.env.NODE_ENV === "development" ? new URL("http://localhost:3000") : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | ${siteConfig.college.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "NexOps",
    "DevOps",
    "Cloud Computing",
    "Kubernetes",
    "Docker",
    "Computer Networks",
    "CI/CD",
    "Terraform",
    "SIET Tumakuru",
    "Student Tech Club",
  ],
  authors: [{ name: `${siteConfig.name} - ${siteConfig.college.name}` }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="dark-stage cinema min-h-full flex flex-col bg-canvas text-ink selection:bg-primary selection:text-on-primary">
        <AmbientBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#f4f6fa] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#05070b]"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <MotionCursor />
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
