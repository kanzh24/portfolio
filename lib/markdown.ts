import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const dataDir = join(process.cwd(), "data");

function loadMarkdown<T>(filename: string): T {
  const fullPath = join(dataDir, filename);
  const fileContents = readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);
  return data as T;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  colSpan?: number;
  borderLeft?: boolean;
  fullWidth?: boolean;
  borderTop?: boolean;
  items: string[] | { label: string; tag: string }[];
}

export interface SkillsData {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
}

export interface ProjectData {
  title: string;
  objective: string;
  badge: string;
  icon: string;
  role: string;
  tech: string[];
  highlights: string[];
  links?: {
    frontend?: string;
    backend?: string;
  };
}

export interface ExperienceData {
  title: string;
  period: string;
  featured?: boolean;
  company: string;
  icon: string;
  bullets: string[];
}

export interface ProjectsData {
  title: string;
  subtitle: string;
  count: string;
  projects: ProjectData[];
}

export interface ExperiencesData {
  title: string;
  subtitle: string;
  experiences: ExperienceData[];
}

export type Bilingual<T> = { en: T; vi: T };

export interface ContactData {
  education: { title: string; subtitle: string };
  certifications: string[];
}

export type WorkStatus = "open_to_work" | "current_working";

export interface IntroLocaleBlock {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaProjects: string;
  estYear: string;
  estPrefix: string;
}

export interface IntroData {
  workStatus: WorkStatus;
  profileImage: string;
  statusLabels: Record<WorkStatus, { en: string; vi: string }>;
  en: IntroLocaleBlock;
  vi: IntroLocaleBlock;
}

export interface SocialLink {
  href: string;
  label: { en: string; vi: string };
}

export interface SocialData {
  links: SocialLink[];
}

export function getSkillsBilingual(): Bilingual<SkillsData> {
  return loadMarkdown<Bilingual<SkillsData>>("skills.md");
}

export function getProjectsBilingual(): Bilingual<ProjectsData> {
  return loadMarkdown<Bilingual<ProjectsData>>("projects.md");
}

export function getExperiencesBilingual(): Bilingual<ExperiencesData> {
  return loadMarkdown<Bilingual<ExperiencesData>>("experience.md");
}

export function getContactBilingual(): Bilingual<ContactData> {
  return loadMarkdown<Bilingual<ContactData>>("contact.md");
}

export function getIntroData(): IntroData {
  return loadMarkdown<IntroData>("intro.md");
}

export function getSocialData(): SocialData {
  return loadMarkdown<SocialData>("social.md");
}
