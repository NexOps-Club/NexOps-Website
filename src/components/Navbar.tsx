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

  return (
    // Fixed-height header: the pill shrinks inside it, so scrolling never shifts the page.
    <header className="dark-stage sticky top-0 z-50 h-20 bg-transparent w-full px-3 pt-3 sm:px-4">
      <div
        className={`glass-surface mx-auto rounded-2xl transition-[max-width,box-shadow] duration-300 ${
          scrolled ? "max-w-[76rem] shadow-2xl shadow-black/50" : "max-w-7xl"
        }`}
      >
        <div
          className={`flex items-center justify-between px-3 sm:px-5 transition-[height] duration-300 ${
            scrolled ? "h-14" : "h-16"
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
                <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-brand border border-primary/30">
                  SIET
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? "text-brand bg-primary/10 border border-primary/30"
                      : "text-ink-soft border border-transparent hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Join CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/join"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs lg:text-sm font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95 shadow-md shadow-primary/20"
            >
              <span>Join NexOps</span>
              <ArrowRight className="h-4 w-4" />
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
          <div id="mobile-menu" className="border-t border-ink/10 px-3 pt-2 pb-5 lg:hidden">
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
