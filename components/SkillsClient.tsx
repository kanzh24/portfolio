"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import type { Bilingual, SkillsData } from "@/lib/markdown";

const tagClass =
  "skills-prog-tag px-4 py-1.5 text-xs font-mono rounded-sm border hover:border-primary/50 transition-colors";

function isArchitectureItem(
  item: string | { label: string; tag: string }
): item is { label: string; tag: string } {
  return typeof item === "object" && "label" in item && "tag" in item;
}

export function SkillsClient({ data }: { data: Bilingual<SkillsData> }) {
  const { locale } = useLocale();
  const { title, subtitle, categories } = data[locale];

  return (
    <section
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 relative"
      id="skills"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <Reveal>
            <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-4">
              {title}
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-[var(--font-headline)] font-bold">
              {subtitle}
            </h3>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-start">
          {categories.map((category, index) => {
            if (category.fullWidth) {
              return (
                <Reveal key={category.id} delay={500}>
                  <div
                    className={`md:col-span-4 p-6 sm:p-8 md:p-10 glass-card rounded-xl min-w-0 ${
                      category.borderTop ? "border-t-4 border-primary/20" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl shrink-0">
                        {category.icon}
                      </span>
                      <h4 className="font-[var(--font-headline)] font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-tight">
                        {category.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      {category.items.map((item) => {
                        if (!isArchitectureItem(item)) return null;
                        return (
                          <div
                            key={item.label}
                            className="arch-bento-item shrink-0 min-w-[160px] sm:min-w-[180px] p-5 sm:p-6 rounded-lg border transition-colors"
                          >
                            <div className="arch-bento-tag text-xs font-mono mb-2">
                              {item.tag}
                            </div>
                            <div className="arch-bento-title font-bold text-base sm:text-lg">
                              {item.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            }

            const delay = (index + 1) * 100;
            return (
              <Reveal key={category.id} delay={delay}>
                <div
                  className={`p-6 sm:p-8 glass-card rounded-xl min-w-0 ${
                    category.colSpan === 2 ? "md:col-span-2" : ""
                  } ${category.borderLeft ? "border-l-4 border-primary/60" : ""}`}
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <span
                      className={`material-symbols-outlined text-primary ${
                        category.colSpan === 2 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                      }`}
                    >
                      {category.icon}
                    </span>
                    <h4
                      className={`font-[var(--font-headline)] font-bold uppercase tracking-tight ${
                        category.colSpan === 2 ? "text-lg sm:text-xl" : "text-base sm:text-xl"
                      }`}
                    >
                      {category.title}
                    </h4>
                  </div>
                  <div
                    className={
                      category.id === "language" ||
                      category.id === "principles"
                        ? "flex flex-wrap gap-2"
                        : "space-y-3"
                    }
                  >
                    {category.items.map((item) => {
                      if (typeof item === "string") {
                        return category.id === "language" ||
                          category.id === "principles" ? (
                          <span key={item} className={tagClass}>
                            {item}
                          </span>
                        ) : (
                          <div
                            key={item}
                            className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                          >
                            {item}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
