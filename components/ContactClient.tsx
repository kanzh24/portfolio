"use client";

import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import { useLocale } from "./LocaleProvider";
import { getUi } from "@/lib/i18n";
import type { Bilingual, ContactData } from "@/lib/markdown";

export function ContactClient({ data }: { data: Bilingual<ContactData> }) {
  const { locale } = useLocale();
  const ui = getUi(locale);
  const { education, certifications } = data[locale];

  return (
    <section
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden"
      id="contact"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <Reveal>
            <h3 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-8 sm:mb-12">
              {ui.credentials}
            </h3>
            <div className="space-y-10 sm:space-y-12">
              <div className="flex gap-6 sm:gap-8 group">
                <div className="mt-1 w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-card flex items-center justify-center border-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform group-hover:rotate-12">
                    school
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-[var(--font-headline)] font-bold text-lg sm:text-xl mb-1">
                    {education.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm tracking-wide">
                    {education.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 sm:gap-8 group">
                <div className="mt-1 w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-card flex items-center justify-center border-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform group-hover:rotate-12">
                    verified
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3 min-w-0">
                  {certifications.map((cert) => (
                    <div
                      key={cert}
                      className="text-sm font-bold flex items-center gap-2 group/item hover:text-primary transition-colors cursor-default"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="p-6 sm:p-10 glass-card rounded-xl">
            <h3 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-8 sm:mb-10">
              {ui.establishConnection}
            </h3>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
