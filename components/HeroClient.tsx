"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { useLocale } from "./LocaleProvider";
import type { IntroData } from "@/lib/markdown";

export function HeroClient({ data }: { data: IntroData }) {
  const { locale } = useLocale();
  const copy = data[locale];
  const statusLabel = data.statusLabels[data.workStatus][locale];

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden px-4 sm:px-6 md:px-8"
      id="intro"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="md:col-span-7">
          <Reveal>
            <div className="hero-intro-badge inline-flex items-center gap-2 px-3 py-1 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase rounded-sm mb-4 sm:mb-6 border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {copy.badge}
            </div>
          </Reveal>
          <Reveal>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-[var(--font-headline)] font-bold tracking-tighter leading-[0.9] mb-6 sm:mb-8">
              {copy.headlineLine1} <br />
              <span className="text-primary drop-shadow-[0_0_15px_rgba(0,218,243,0.3)]">
                {copy.headlineLine2}
              </span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-body">
              {copy.description}
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-4 sm:gap-6">
              <MagneticButton
                as="a"
                href="#projects"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-sm flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40"
              >
                {copy.ctaProjects}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </MagneticButton>
              <div className="flex items-center gap-4">
                <div className="w-8 sm:w-12 h-[1px] bg-outline-variant/40" />
                <span className="text-xs sm:text-sm font-mono text-outline uppercase tracking-widest">
                  {copy.estPrefix} {copy.estYear}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-5 hidden md:block">
          <Reveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/35 to-primary-container/35 blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative glass-card p-2 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 mix-blend-overlay pointer-events-none transition-colors duration-500" />
                <Image
                  alt="Profile"
                  className="w-full aspect-square object-cover rounded-lg brightness-110 contrast-105 saturate-110 transition-all duration-700 group-hover:scale-[1.02]"
                  src={data.profileImage}
                  width={400}
                  height={400}
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20 max-w-[calc(100%-2rem)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping shrink-0" />
                  <span className="text-[10px] font-mono text-primary tracking-widest uppercase font-bold truncate">
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
