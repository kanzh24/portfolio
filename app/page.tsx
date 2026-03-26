import {
  Navbar,
  HeroClient,
  Skills,
  Projects,
  Experience,
  Contact,
  Footer,
  CursorGlow,
  ScrollEffects,
  LocaleProvider,
} from "@/components";
import { getIntroData } from "@/lib/markdown";

export default async function Home() {
  const intro = await getIntroData();

  return (
    <LocaleProvider>
      <div className="grain-overlay" aria-hidden />
      <div className="mesh-bg" aria-hidden />
      <ScrollEffects />
      <CursorGlow />
      <Navbar />
      <main className="pt-16 sm:pt-20">
        <HeroClient data={intro} />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </LocaleProvider>
  );
}
