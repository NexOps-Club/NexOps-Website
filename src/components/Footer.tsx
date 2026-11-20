import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, DiscordIcon } from "@/components/Icons";

interface FooterLink {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  external: boolean;
}

export function Footer() {
  const { github, discord, linkedin, email } = siteConfig.contact;
  const candidates: (FooterLink & { value: string })[] = [
    { value: github, label: "GitHub", href: github, Icon: GithubIcon, external: true },
    { value: discord, label: "Discord", href: discord, Icon: DiscordIcon, external: true },
    { value: linkedin, label: "LinkedIn", href: linkedin, Icon: LinkedinIcon, external: true },
    { value: email, label: "Email", href: `mailto:${email}`, Icon: Mail, external: false },
  ];
  const links = candidates.filter((l) => l.value);

  return (
    <footer className="dark-stage cinema w-full border-t border-line bg-canvas text-muted">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={594} height={678} className="h-10 w-auto object-contain" />
            <span className="font-heading text-lg font-bold text-ink">{siteConfig.name}</span>
          </div>

          {/* Socials: shown only for the contact values filled in src/config/site.ts */}
          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="rounded-lg border border-line bg-surface p-2 text-ink-soft hover:border-line-strong hover:text-ink transition"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}.</p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
