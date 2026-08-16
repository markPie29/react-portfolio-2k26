import { projectsData } from '../data/projects';
import { ProjectItem } from '../types/content';

/**
 * Fetches all portfolio projects from local static data.
 * Keeps async signature for backward compatibility with component lifecycle methods.
 */
export const fetchProjects = async (): Promise<ProjectItem[]> => {
  return projectsData;
};
