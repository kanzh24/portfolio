"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { MagneticButton } from "./MagneticButton";
import { useLocale } from "./LocaleProvider";
import { NAV_LABELS } from "@/lib/i18n";

const navKeys = [
  { href: "#intro", sectionId: "intro", key: "intro" as const },
  { href: "#skills", sectionId: "skills", key: "skills" as const },
  { href: "#projects", sectionId: "projects", key: "projects" as const },
  { href: "#experience", sectionId: "experience", key: "experience" as const },
  { href: "#contact", sectionId: "contact", key: "contact" as const },
];

const navLinkBase =
  "relative py-2 font-medium transition-all duration-300 ease-out after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all duration-300 after:ease-out";

export function Navbar() {
  const { locale } = useLocale();
  const labels = NAV_LABELS[locale];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const sections = navKeys
      .map((l) => document.getElementById(l.sectionId))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          if (id) setActiveSection(id);
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getLinkClass = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    return `${navLinkBase} ${
      isActive
        ? "text-primary font-bold after:w-full"
        : "text-on-surface-variant hover:text-primary after:w-0 hover:after:w-full"
    }`;
  };

  return (
    <nav className="nav-bar fixed top-0 w-full z-50 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-300">
      <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <Link
          href="#intro"
          className="text-lg sm:text-xl font-bold tracking-tighter text-on-surface font-[var(--font-headline)] uppercase group cursor-pointer"
        >
          KhanhNg<span className="text-primary group-hover:animate-pulse">.Portfolio</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-[var(--font-headline)] tracking-tight">
          {navKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClass(link.sectionId)}
              onClick={() => setMobileOpen(false)}
            >
              {labels[link.key]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <MagneticButton
            as="a"
            href="/api/cv"
            className="hidden md:flex items-center gap-2 bg-primary-container/80 hover:bg-primary-container text-on-primary-container px-4 sm:px-6 py-2.5 rounded-sm font-bold shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            {labels.downloadCv}
          </MagneticButton>
          <button
            type="button"
            className="md:hidden text-on-surface p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-panel md:hidden border-t backdrop-blur-xl">
          <div className="flex flex-col py-4 px-4 gap-2">
            {navKeys.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-4 rounded-sm transition-all duration-300 ${
                    isActive
                      ? "text-primary font-bold bg-primary/10 border-l-2 border-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {labels[link.key]}
                </Link>
              );
            })}
            <MagneticButton
              as="a"
              href="/api/cv"
              className="mt-2 flex items-center justify-center gap-2 bg-primary-container/80 hover:bg-primary-container text-on-primary-container px-6 py-3 rounded-sm font-bold"
            >
              <span className="material-symbols-outlined text-sm">terminal</span>
              {labels.downloadCv}
            </MagneticButton>
          </div>
        </div>
      )}
    </nav>
  );
}
