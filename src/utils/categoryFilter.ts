import { ProjectItem, ProjectCategory } from '../types/content';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Graphic Design',
  'Software Development',
  'Social Media Management',
];

const CATEGORY_KEYWORDS: Record<ProjectCategory, string[]> = {
  'Graphic Design': ['graphic'],
  'Software Development': ['software', 'development'],
  'Social Media Management': ['social', 'media'],
};

export const getProjectCategories = (project: ProjectItem): string[] =>
  project.categories && project.categories.length > 0
    ? project.categories
    : project.category
    ? [project.category]
    : [];

export const serviceSlugToCategory = (slug: string): string => {
  const lower = slug.toLowerCase();
  if (lower.includes('graphic')) return 'Graphic Design';
  if (lower.includes('software')) return 'Software Development';
  if (lower.includes('social') || lower.includes('media')) return 'Social Media Management';
  return slug;
};

export const projectMatchesCategory = (project: ProjectItem, filter: string): boolean => {
  const normalized = filter.toLowerCase().replace(/[-_]+/g, ' ').trim();
  if (normalized === 'all' || normalized === '') return true;

  const bucket = PROJECT_CATEGORIES.find((c) => c.toLowerCase() === normalized);
  if (!bucket) {
    return getProjectCategories(project).some((cat) => cat.toLowerCase() === normalized);
  }

  const keywords = [bucket.toLowerCase(), ...CATEGORY_KEYWORDS[bucket]];
  return getProjectCategories(project).some((cat) => {
    const lower = cat.toLowerCase();
    return keywords.some((k) => lower.includes(k));
  });
};
