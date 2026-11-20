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
  // Minimal bar on every page (the whole site is dark). The floating-pill branches below are kept for reference.
  const isHome = true;

  return (
    // Fixed-height header: the pill shrinks inside it, so scrolling never shifts the page.
    <header
      className={
        isHome
          ? `dark-stage cinema sticky top-0 z-50 h-20 w-full px-4 transition-colors duration-300 sm:px-8 lg:px-14 ${
              scrolled ? "border-b border-line bg-canvas/85 backdrop-blur-md" : "border-b border-transparent bg-canvas"
            }`
          : "dark-stage sticky top-0 z-50 h-20 bg-transparent w-full px-3 pt-3 sm:px-4"
      }
    >
      <div
        className={
          isHome
            ? "mx-auto max-w-[90rem]"
            : `glass-surface mx-auto rounded-2xl transition-[max-width,box-shadow] duration-300 ${
                scrolled ? "max-w-[76rem] shadow-2xl shadow-black/50" : "max-w-7xl"
              }`
        }
      >
        <div
          className={`flex items-center justify-between ${
            isHome ? "h-20" : `px-3 sm:px-5 transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`
          }`}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group rounded-lg">
            <Image
              src="/logo-mark.png"
              alt=""
              width={70}
              height={42}
              preload
              className={`object-contain transition-all duration-300 group-hover:scale-105 ${
                scrolled ? "h-9 w-[60px]" : "h-[42px] w-[70px]"
              }`}
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-ink flex items-center gap-1.5">
                {siteConfig.name}
                {!isHome && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-brand border border-primary/30">
                    SIET
                  </span>
                )}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center ${isHome ? "glass-pill gap-1 rounded-full p-1.5" : "gap-1 xl:gap-1.5"}`}
            aria-label="Main"
          >
            {siteConfig.nav
              .filter((item) => !(isHome && item.href === "/resources"))
              .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isHome
                      ? `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                          isActive
                            ? "border-white/25 bg-white/15 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_4px_14px_-6px_rgb(96_165_250/0.5)]"
                            : "border-transparent text-ink-soft hover:border-white/15 hover:bg-white/10 hover:text-ink"
                        }`
                      : `whitespace-nowrap px-2.5 xl:px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                          isActive
                            ? "text-brand bg-primary/10 border border-primary/30"
                            : "text-ink-soft border border-transparent hover:text-ink hover:bg-ink/5"
                        }`
                  }
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Join CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {isHome && (
              <Link
                href="/resources"
                className="inline-flex items-center whitespace-nowrap rounded-full glass-pill px-5 py-2 text-sm text-ink active:scale-[0.97]"
              >
                Roadmaps
              </Link>
            )}
            <Link
              href="/join"
              className={
                isHome
                  ? "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full glass-pill px-5 py-2 text-sm text-ink active:scale-[0.97]"
                  : "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs lg:text-sm font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95 shadow-md shadow-primary/20"
              }
            >
              <span>Join NexOps</span>
              {!isHome && <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer (inside the pill, overlays the page) */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className={`border-t border-ink/10 px-3 pt-2 pb-5 lg:hidden ${
              isHome ? "absolute inset-x-0 top-full border-b border-line bg-canvas px-4 sm:px-8" : ""
            }`}
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
                    className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-brand font-semibold"
                        : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-ink/10 flex flex-col gap-2">
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
              >
                <span>Join NexOps</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-ink/10 bg-ink/5 px-4 py-2.5 text-xs font-mono text-ink-soft hover:text-ink"
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
