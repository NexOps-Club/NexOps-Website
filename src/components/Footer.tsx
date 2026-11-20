import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, DiscordIcon } from "@/components/Icons";
import { VERIFIED } from "@/lib/verified";

export function Footer() {
  return (
    <footer className="dark-stage cinema w-full border-t border-line bg-canvas text-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image src="/logo-mark.png" alt="" width={60} height={36} className="h-9 w-[60px] object-contain" />
              <span className="font-bold text-ink text-sm">{siteConfig.name}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-3">
              Navigation
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand transition-colors">
                  About Us & Story
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-brand transition-colors">
                  Workshops & Events
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand transition-colors">
                  Projects Showcase
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-brand transition-colors">
                  Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-brand transition-colors">
                  Our Team & Faculty
                </Link>
              </li>
            </ul>
          </div>

          {/* College & Department */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-3">
              Affiliation
            </h2>
            <div className="space-y-2 text-xs text-muted">
              <p className="font-medium text-ink-soft">{siteConfig.college.name}</p>
              <p>{siteConfig.college.department}</p>
              <p>{siteConfig.college.campus}</p>
              {VERIFIED.footerClaims && (
                <p className="pt-2 text-[11px] text-muted">An officially recognized student technical society.</p>
              )}
            </div>
          </div>

          {/* Connect & Socials */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-3">
              Community & Social
            </h2>
            <p className="text-xs text-muted mb-3">
              Join student developers and cloud engineers in our discussion spaces.
            </p>
            {(VERIFIED.socialLinks || VERIFIED.contactEmail) && (
            <div className="flex items-center gap-3">
              {VERIFIED.socialLinks && (<>
              <a
                href={siteConfig.contact.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-surface p-2 text-ink-soft hover:border-line-strong hover:text-ink transition"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.discord}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-surface p-2 text-ink-soft hover:border-line-strong hover:text-ink transition"
                aria-label="Discord"
              >
                <DiscordIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-surface p-2 text-ink-soft hover:border-line-strong hover:text-ink transition"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              </>)}
              {VERIFIED.contactEmail && (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="rounded-lg border border-line bg-surface p-2 text-ink-soft hover:border-line-strong hover:text-ink transition"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              )}
            </div>
            )}
            <div className="mt-4">
              <Link
                href="/join"
                className="text-xs text-brand hover:underline flex items-center gap-1 font-medium"
              >
                <span>Recruitment open for all branches</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}.{VERIFIED.footerClaims && " Open-source under MIT License."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {siteConfig.recruitment.open && (
              <Link
                href="/join"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] text-brand hover:bg-primary/15 transition"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span>Recruiting: {siteConfig.recruitment.label}</span>
              </Link>
            )}
            {VERIFIED.footerClaims && (
            <a
              href={`${siteConfig.contact.github}/blob/main/.github/workflows/ci.yml`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 font-mono text-[11px] text-ink-soft hover:border-ink/20 hover:text-ink transition"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span>Tested &amp; Docker-built by our own CI pipeline | View pipeline</span>
            </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
