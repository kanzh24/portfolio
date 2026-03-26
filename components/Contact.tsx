import { ContactClient } from "./ContactClient";
import { getContactBilingual } from "@/lib/markdown";

export async function Contact() {
  const data = await getContactBilingual();
  return <ContactClient data={data} />;
}
