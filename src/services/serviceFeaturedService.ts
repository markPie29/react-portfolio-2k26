import { serviceFeaturedProjects } from '../data/serviceFeaturedProjects';

/**
 * Fetches pinned project IDs for a specific service slug from local static configuration.
 */
export const fetchServicePins = async (slug: string): Promise<string[]> => {
  return serviceFeaturedProjects[slug] || [];
};

/**
 * Fetches all service pins as a map of serviceSlug -> projectIds[]
 */
export const fetchAllServicePins = async (): Promise<Record<string, string[]>> => {
  return serviceFeaturedProjects;
};
