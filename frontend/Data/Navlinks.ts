import type { LucideIcon } from "lucide-react";
import { Home, Trophy, User, Award } from "lucide-react";

export interface NavLink {
  title: string;
  icon: LucideIcon;
  href: string;
}

export const NavLinks: NavLink[] = [
  { title: "Challenges", icon: Home, href: "/challenges" },
  { title: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { title: "FAQs", icon: Award, href: "/faqs" },
];
