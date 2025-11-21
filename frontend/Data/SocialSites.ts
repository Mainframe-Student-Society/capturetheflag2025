import type { LucideIcon } from "lucide-react";
import { Linkedin, Mail, Instagram } from "lucide-react";

export interface SocialSite {
  title: string;
  icon: LucideIcon;
  href: string;
}

export const Social: SocialSite[] = [
  {
    title: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/wolves-mass",
  },
  {
    title: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/wolvesmass",
  },
  { title: "Email", icon: Mail, href: "mailto:masswlv@gmail.com" },
];
