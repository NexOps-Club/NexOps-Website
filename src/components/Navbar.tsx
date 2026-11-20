"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { Menu, X, ArrowRight } from "lucide-react";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 16, () => false);
  // Roadmaps sits in the action buttons on desktop, so it is left out of the link capsule.
  const desktopLinks = siteConfig.nav.filter((item) => item.href !== "/resources");

  return (
    // Fixed-height bar: only its background changes on scroll, so the page never shifts.
    <header
      className={`dark-stage cinema sticky top-0 z-50 h-20 w-full px-4 transition-colors duration-300 sm:px-8 lg:px-14 ${
        scrolled ? "border-b border-line bg-canvas/85 backdrop-blur-md" : "border-b border-transparent bg-canvas"
      }`}
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="flex h-20 items-center justify-between">
          {/* Brand logo */}
          <Link href="/" className="group flex items-center gap-3 rounded-lg">
            <Image
              src="/logo-mark.png"
              alt=""
              width={70}
              height={42}
              preload
              className="h-9 w-[60px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-sm font-bold tracking-tight text-ink">{siteConfig.name}</span>
          </Link>

          {/* Desktop links */}
          <nav className="glass-pill hidden items-center gap-1 rounded-full p-1.5 lg:flex" aria-label="Main">
            {desktopLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "border-white/25 bg-white/15 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_4px_14px_-6px_rgb(96_165_250/0.5)]"
                      : "border-transparent text-ink-soft hover:border-white/15 hover:bg-white/10 hover:text-ink"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              href="/resources"
              className="glass-pill inline-flex items-center whitespace-nowrap rounded-full px-5 py-2 text-sm text-ink active:scale-[0.97]"
            >
              Roadmaps
            </Link>
            <Link
              href="/join"
              className="glass-pill inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-sm text-ink active:scale-[0.97]"
            >
              <span>Join NexOps</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass-pill inline-flex items-center justify-center rounded-full p-2.5 text-ink-soft hover:text-ink lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer: blurred sheet that overlays the page */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="glass-drawer absolute inset-x-0 top-full border-b border-line px-4 pt-2 pb-5 sm:px-8 lg:hidden"
          >
            <div className="space-y-1">
              {siteConfig.nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-full border px-4 py-2 text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "border-white/25 bg-white/15 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
                        : "border-transparent text-ink-soft hover:border-white/15 hover:bg-white/10 hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-ink/10 pt-4">
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-pill flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink active:scale-[0.97]"
              >
                <span>Join NexOps</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-pill flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-mono text-ink-soft hover:text-ink"
              >
                Admin Control Plane
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
