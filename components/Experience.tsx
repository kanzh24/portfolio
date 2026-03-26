import { ExperienceClient } from "./ExperienceClient";
import { getExperiencesBilingual } from "@/lib/markdown";

export async function Experience() {
  const data = await getExperiencesBilingual();
  return <ExperienceClient data={data} />;
}
