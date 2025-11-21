import type { LucideIcon } from "lucide-react";
import { Home, Trophy, User, Award } from "lucide-react";

export interface NavLink {
  title: string;
  icon: LucideIcon;
  href: string;
}

export const NavLinks: NavLink[] = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { title: "Achievements", icon: Award, href: "/achievements" },
  { title: "Profile", icon: User, href: "/profile" },
];
