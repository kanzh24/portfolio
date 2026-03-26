"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import { getUi } from "@/lib/i18n";
import type { Bilingual, ProjectsData, ProjectData } from "@/lib/markdown";

const AUTO_SLIDE_MS = 6000;
/** Phải khớp khoảng cách giữa các card trên track (px) */
const GAP_PX = 32;

function ProjectCard({
  project,
  ui,
}: {
  project: ProjectData;
  ui: ReturnType<typeof getUi>;
}) {
  return (
    <div className="group glass-card rounded-xl overflow-hidden h-full flex flex-col w-full min-w-0">
      <div className="project-card-hero h-48 sm:h-56 relative flex items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-all duration-700" />
        <span className="material-symbols-outlined text-6xl sm:text-7xl text-primary/20 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-700">
          {project.icon}
        </span>
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8">
          <div className="text-[10px] font-mono bg-primary text-on-primary px-2 sm:px-3 py-1 rounded shadow-lg shadow-primary/20">
            {project.badge}
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-10 flex flex-col flex-1 min-h-0">
        <h4 className="text-xl sm:text-2xl font-[var(--font-headline)] font-bold mb-2 sm:mb-3">
          {project.title}
        </h4>
        <p className="text-on-surface-variant text-sm mb-4 leading-relaxed opacity-90">
          {project.objective}
        </p>
        {project.links && (project.links.frontend || project.links.backend) && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-7">
            {project.links.frontend && (
              <a
                href={project.links.frontend}
                target="_blank"
                rel="noopener noreferrer"
                className="project-repo-btn inline-flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 font-mono text-sm sm:text-base font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
                aria-label={`${ui.linkFrontend} (opens in new tab)`}
              >
                <span className="material-symbols-outlined text-[22px] sm:text-2xl shrink-0" aria-hidden>
                  code
                </span>
                <span>{ui.linkFrontend}</span>
                <span className="material-symbols-outlined text-lg opacity-80 shrink-0" aria-hidden>
                  open_in_new
                </span>
              </a>
            )}
            {project.links.backend && (
              <a
                href={project.links.backend}
                target="_blank"
                rel="noopener noreferrer"
                className="project-repo-btn inline-flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 font-mono text-sm sm:text-base font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
                aria-label={`${ui.linkBackend} (opens in new tab)`}
              >
                <span className="material-symbols-outlined text-[22px] sm:text-2xl shrink-0" aria-hidden>
                  storage
                </span>
                <span>{ui.linkBackend}</span>
                <span className="material-symbols-outlined text-lg opacity-80 shrink-0" aria-hidden>
                  open_in_new
                </span>
              </a>
            )}
          </div>
        )}
        <div className="mb-4 sm:mb-6">
          <div className="text-[10px] font-mono text-outline uppercase mb-2">{ui.myRole}</div>
          <p className="text-sm font-medium text-primary/90">{project.role}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="chip-tech px-2 sm:px-3 py-1 text-[10px] font-mono rounded border"
            >
              {t}
            </span>
          ))}
        </div>
        <ul className="space-y-2 sm:space-y-3 text-xs text-on-surface-variant mt-auto">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3">
              <span className="text-primary mt-0.5">•</span>
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProjectsClient({ data }: { data: Bilingual<ProjectsData> }) {
  const { locale } = useLocale();
  const ui = getUi(locale);
  const { title, subtitle, count, projects } = data[locale];

  const n = projects.length;
  const showCarousel = n > 1;

  const [isMd, setIsMd] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMd(mq.matches);
    const fn = () => setIsMd(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /** Một hàng dài: … + clone để nối vòng khi trượt từng ô */
  const trackProjects = useMemo(() => {
    if (n < 2) return projects;
    return isMd
      ? [...projects, projects[0], projects[1]]
      : [...projects, projects[0]];
  }, [projects, n, isMd]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const [viewportW, setViewportW] = useState(0);
  const [pos, setPos] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const cardW =
    viewportW > 0 ? (isMd ? (viewportW - GAP_PX) / 2 : viewportW) : 0;
  const step = cardW > 0 ? cardW + GAP_PX : 0;

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewportW(el.clientWidth));
    ro.observe(el);
    setViewportW(el.clientWidth);
    return () => ro.disconnect();
  }, [locale, showCarousel]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setPos(0);
    setTransitionOn(true);
  }, [locale, projects, isMd]);

  const maxPos = n;

  const goNext = useCallback(() => {
    if (!showCarousel || n < 2) return;
    let p = posRef.current;
    if (p === maxPos) p = 0;
    if (reduceMotion) {
      setPos((x) => (x + 1) % n);
      return;
    }
    setTransitionOn(true);
    if (p < n - 1) setPos(p + 1);
    else if (p === n - 1) setPos(maxPos);
  }, [showCarousel, n, reduceMotion, maxPos]);

  const goPrev = useCallback(() => {
    if (!showCarousel || n < 2) return;
    let p = posRef.current;
    if (p === maxPos) p = 0;
    if (reduceMotion) {
      setPos((x) => (x - 1 + n) % n);
      return;
    }
    if (p > 0) {
      setTransitionOn(true);
      setPos(p - 1);
      return;
    }
    setTransitionOn(false);
    setPos(maxPos);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionOn(true);
        setPos(n - 1);
      });
    });
  }, [showCarousel, n, reduceMotion, maxPos]);

  useEffect(() => {
    if (!showCarousel) return;
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => goNext(), AUTO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, [showCarousel, reduceMotion, paused, goNext]);

  const onTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (reduceMotion) return;
      if (posRef.current === maxPos) {
        setTransitionOn(false);
        setPos(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setTransitionOn(true));
        });
      }
    },
    [maxPos, reduceMotion]
  );

  const jumpTo = useCallback(
    (i: number) => {
      if (!showCarousel || i < 0 || i >= n) return;
      setTransitionOn(reduceMotion ? false : true);
      setPos(i);
    },
    [showCarousel, n, reduceMotion]
  );

  const activeDot = pos >= maxPos ? 0 : pos;
  const translatePx = step > 0 ? -pos * step : 0;
  const transitionClass =
    reduceMotion || !transitionOn
      ? "duration-0"
      : "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <section
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8"
      id="projects"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <Reveal>
            <div>
              <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-4">
                {title}
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-[var(--font-headline)] font-bold">
                {subtitle}
              </h3>
            </div>
          </Reveal>
          <div className="h-[1px] bg-outline-variant/20 flex-grow mx-0 md:mx-8 hidden md:block mb-3" />
          <span className="text-xs font-mono text-outline uppercase mb-3">
            {ui.projectsActivePrefix} {count}
          </span>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
          }}
        >
          {showCarousel && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={ui.projectsCarouselPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 -ml-1 sm:-ml-2 rounded-full glass-card border border-outline-variant/30 flex items-center justify-center text-on-surface hover:border-primary/50 hover:text-primary transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={ui.projectsCarouselNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 -mr-1 sm:-mr-2 rounded-full glass-card border border-outline-variant/30 flex items-center justify-center text-on-surface hover:border-primary/50 hover:text-primary transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>
            </>
          )}

          <div
            className="w-full min-w-0 px-12 sm:px-14 md:px-16"
            role="region"
            aria-roledescription="carousel"
            aria-label={subtitle}
          >
            {n === 0 ? null : !showCarousel ? (
              <div className="w-full max-w-2xl mx-auto min-w-0">
                <ProjectCard project={projects[0]} ui={ui} />
              </div>
            ) : (
              <div
                ref={viewportRef}
                className="w-full min-w-0 overflow-hidden select-none"
              >
                <div
                  className={`flex flex-row items-stretch ${transitionClass} transition-transform will-change-transform`}
                  style={{
                    gap: GAP_PX,
                    transform: `translate3d(${translatePx}px,0,0)`,
                  }}
                  onTransitionEnd={onTrackTransitionEnd}
                >
                  {trackProjects.map((project, idx) => (
                    <div
                      key={`${locale}-track-${idx}`}
                      className="shrink-0 box-border"
                      style={{
                        width: cardW > 0 ? cardW : "min(100%, 22rem)",
                        minWidth: cardW > 0 ? cardW : undefined,
                      }}
                    >
                      <ProjectCard project={project} ui={ui} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showCarousel && (
            <div className="flex justify-center gap-2 mt-8 sm:mt-10">
              {projects.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`${i + 1} / ${n}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeDot
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-outline-variant/40 hover:bg-outline-variant/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
