"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { getUi } from "@/lib/i18n";
import type { SocialData } from "@/lib/markdown";

export function FooterClient({ social }: { social: SocialData }) {
  const { locale } = useLocale();
  const ui = getUi(locale);
  const links = social.links ?? [];

  return (
    <footer className="site-footer w-full py-12 sm:py-16 border-t mt-12 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto gap-8 sm:gap-12">
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <div className="text-xl sm:text-2xl font-black text-on-surface font-[var(--font-headline)] uppercase tracking-tighter">
            KhanhNg<span className="text-primary">.Portfolio</span>
          </div>
          <p className="font-[var(--font-body)] text-sm tracking-wide text-on-surface-variant max-w-sm">
            {ui.footerTagline}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {links.map((link) => {
            const label = link.label[locale];
            const external = /^https?:\/\//i.test(link.href);
            const className =
              "font-[var(--font-body)] text-xs font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center gap-2 group";
            return external ? (
              <a
                key={`${link.href}-${label}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                <span className="w-1 h-1 bg-primary/40 rounded-full group-hover:scale-150 transition-transform" />
                {label}
              </a>
            ) : (
              <Link key={`${link.href}-${label}`} href={link.href} className={className}>
                <span className="w-1 h-1 bg-primary/40 rounded-full group-hover:scale-150 transition-transform" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
