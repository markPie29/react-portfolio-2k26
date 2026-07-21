import { SkillBadge, SkillCategory } from '../types/content';

export const developerTopSkills: SkillBadge[] = [
  { name: 'react', label: 'REACT' },
  { name: 'nextjs', label: 'NEXT.JS' },
  { name: 'supabase', label: 'SUPABASE' },
  { name: 'laravel', label: 'LARAVEL' },
  { name: 'firebase', label: 'FIREBASE' },
  { name: 'tailwindcss', label: 'TAILWIND CSS' },
];

export const designerTopSkills: SkillBadge[] = [
  { name: 'photoshop', label: 'PHOTOSHOP' },
  { name: 'illustrator', label: 'ILLUSTRATOR' },
  { name: 'canva', label: 'CANVA' },
  { name: 'figma', label: 'FIGMA' },
  { name: 'capcut', label: 'CAPCUT' },
];

export const developerCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'shadcn', label: 'SHADCN/UI' },
      { name: 'framer', label: 'FRAMER MOTION' },
      { name: 'code', label: 'REACT BITS' },
    ],
  },
  {
    title: 'Backend Frameworks',
    skills: [{ name: 'express', label: 'EXPRESS.JS' }],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'mysql', label: 'MYSQL' },
      { name: 'database', label: 'SQL SERVER' },
    ],
  },
  {
    title: 'Game Development',
    skills: [
      { name: 'unity', label: 'UNITY' },
      { name: 'python', label: 'PYGAME' },
      { name: 'vr', label: 'AR DEV' },
    ],
  },
  {
    title: 'Programming Languages',
    skills: [
      { name: 'java', label: 'JAVA' },
      { name: 'python', label: 'PYTHON' },
      { name: 'php', label: 'PHP' },
      { name: 'typescript', label: 'TYPESCRIPT' },
      { name: 'code', label: 'VISUAL BASIC' },
      { name: 'code', label: 'C#' },
    ],
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'git', label: 'GIT' },
      { name: 'github', label: 'GITHUB' },
      { name: 'docker', label: 'DOCKER' },
    ],
  },
];

export const designerCategories: SkillCategory[] = [
  {
    title: 'Specialization',
    skills: [
      { name: 'image', label: 'POSTERS' },
      { name: 'pentool', label: 'LOGO AND BRANDING' },
      { name: 'wand', label: 'PHOTO MANIPULATION' },
      { name: 'mail', label: 'EMAIL ADS' },
      { name: 'shirt', label: 'APPAREL DESIGN' },
      { name: 'layout', label: 'UI/UX DESIGN' },
      { name: 'playsquare', label: 'SIMPLE MOTION GRAPHICS' },
      { name: 'film', label: 'VIDEO EDITING' },
    ],
  },
];
