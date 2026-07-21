export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "facebook" | "github" | "linkedin" | "discord";
  label: string;
  url: string;
  iconClass?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SkillBadge {
  name: string;
  label: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillBadge[];
}

export interface TechStackGroup {
  heading: "Developer" | "Designer";
  topSkills: SkillBadge[];
  categories?: SkillCategory[];
}

export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  href?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "Graphic Design" | "Graphic Design & Video Editing" | "Software Development" | "Social Media Management";
  description: string;
  longDescription?: string;
  techStack: string[];
  image?: string;
  images?: string[];
  features?: string[];
  liveUrl?: string;
  githubUrl?: string;
  role?: string;
  href?: string;
}
