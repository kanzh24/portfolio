import { ProjectsClient } from "./ProjectsClient";
import { getProjectsBilingual } from "@/lib/markdown";

export async function Projects() {
  const data = await getProjectsBilingual();
  return <ProjectsClient data={data} />;
}
