import { FooterClient } from "./FooterClient";
import { getSocialData } from "@/lib/markdown";

export async function Footer() {
  const social = getSocialData();
  return <FooterClient social={social} />;
}
