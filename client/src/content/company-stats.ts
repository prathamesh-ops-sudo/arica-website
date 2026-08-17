import { Award, Globe, Users } from "lucide-react";

export const COMPANY_STATS = [
  { icon: Users, value: 100, suffix: "+", label: "Brands Associated", accent: "blue" as const },
  { icon: Globe, value: 200, suffix: "+", label: "Professionals Trained", accent: "green" as const },
  { icon: Award, value: 15, suffix: "", label: "Expert Team Members", accent: "blue" as const },
] as const;
