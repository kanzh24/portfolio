"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import type { Bilingual, ExperienceData, ExperiencesData } from "@/lib/markdown";

function renderBullet(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function ExperienceCard({ exp }: { exp: ExperienceData }) {
  return (
    <div
      className={`w-full p-6 sm:p-10 rounded-xl glass-card ${
        exp.featured
          ? "border border-primary/10"
          : "opacity-100 dark:opacity-80 dark:hover:opacity-100"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="font-[var(--font-headline)] font-bold text-xl sm:text-2xl">
          {exp.title}
        </div>
        <time
          className={`font-mono text-[10px] px-3 py-1.5 rounded-full ${
            exp.featured
              ? "bg-primary-container text-on-primary-container"
              : "text-outline border border-outline-variant/30"
          }`}
        >
          {exp.period}
        </time>
      </div>
      <div
        className={`mb-4 sm:mb-6 text-base sm:text-lg tracking-wide ${
          exp.featured ? "text-primary font-bold" : "text-on-surface-variant font-bold"
        }`}
      >
        {exp.company}
      </div>
      <ul className="space-y-3 sm:space-y-4 text-sm text-on-surface-variant leading-relaxed">
        {exp.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="text-primary opacity-50">•</span>
            <span
              dangerouslySetInnerHTML={{
                __html: renderBullet(bullet),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceClient({ data }: { data: Bilingual<ExperiencesData> }) {
  const { locale } = useLocale();
  const { title, subtitle, experiences } = data[locale];

  return (
    <section
      className="py-16 sm:py-20 md:py-24 relative px-4 sm:px-6 md:px-8"
      id="experience"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 text-center">
          <Reveal>
            <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-4">
              {title}
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-[var(--font-headline)] font-bold">
              {subtitle}
            </h3>
          </Reveal>
        </div>

        <div className="relative md:hidden space-y-12 pl-10 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
          {experiences.map((exp) => (
            <Reveal key={`${locale}-${exp.title}`}>
              <div className="relative">
                <div
                  className={`absolute -left-10 top-2 flex items-center justify-center w-10 h-10 rounded-full border bg-surface z-10 ${
                    exp.featured
                      ? "border-primary/50 shadow-[0_0_15px_rgba(0,218,243,0.3)]"
                      : "border-outline-variant/50"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-sm ${
                      exp.featured ? "text-primary" : "text-outline"
                    }`}
                  >
                    {exp.icon}
                  </span>
                </div>
                <ExperienceCard exp={exp} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="hidden md:block relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent pointer-events-none"
            aria-hidden
          />
          <div className="space-y-16 lg:space-y-20">
            {experiences.map((exp, index) => (
              <Reveal key={`${locale}-${exp.title}`}>
                <div className="relative flex items-center w-full">
                  <div className="flex-1 flex justify-end pr-8 min-w-0">
                    {index % 2 === 1 ? (
                      <div className="w-full max-w-xl">
                        <ExperienceCard exp={exp} />
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-10 flex-shrink-0 w-12 flex justify-center">
                    <div
                      className={`flex items-center justify-center w-11 h-11 rounded-full border bg-surface shadow-[0_0_0_4px_var(--color-surface)] ${
                        exp.featured
                          ? "border-primary/50 shadow-[0_0_15px_rgba(0,218,243,0.3)] animate-pulse"
                          : "border-outline-variant/50"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-sm ${
                          exp.featured ? "text-primary" : "text-outline"
                        }`}
                      >
                        {exp.icon}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-start pl-8 min-w-0">
                    {index % 2 === 0 ? (
                      <div className="w-full max-w-xl">
                        <ExperienceCard exp={exp} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
