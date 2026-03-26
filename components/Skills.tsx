import { SkillsClient } from "./SkillsClient";
import { getSkillsBilingual } from "@/lib/markdown";

export async function Skills() {
  const data = await getSkillsBilingual();
  return <SkillsClient data={data} />;
}
