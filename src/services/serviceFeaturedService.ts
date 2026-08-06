import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceFeaturedProjectRow } from '../types/database';

const LOCAL_STORAGE_PREFIX = 'service_pins_';

const getLocalStoragePins = (slug: string): string[] => {
  try {
    const data = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${slug}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setLocalStoragePins = (slug: string, projectIds: string[]): void => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${slug}`, JSON.stringify(projectIds));
  } catch (err) {
    console.error('Failed to save service pins to localStorage:', err);
  }
};

/**
 * Fetches pinned project IDs for a specific service slug
 */
export const fetchServicePins = async (slug: string): Promise<string[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('service_featured_projects')
        .select('*')
        .eq('service_slug', slug)
        .maybeSingle();

      if (!error && data) {
        const row = data as ServiceFeaturedProjectRow;
        return row.project_ids || [];
      }
    } catch (err) {
      console.warn(`Error fetching service pins for ${slug} from Supabase, falling back:`, err);
    }
  }

  return getLocalStoragePins(slug);
};

/**
 * Fetches all service pins as a map of serviceSlug -> projectIds[]
 */
export const fetchAllServicePins = async (): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('service_featured_projects')
        .select('*');

      if (!error && data) {
        (data as ServiceFeaturedProjectRow[]).forEach((row) => {
          result[row.service_slug] = row.project_ids || [];
        });
        return result;
      }
    } catch (err) {
      console.warn('Error fetching all service pins from Supabase, falling back:', err);
    }
  }

  // Fallback to localStorage for known services
  ['graphic-design', 'software-development', 'social-media-management'].forEach((slug) => {
    result[slug] = getLocalStoragePins(slug);
  });

  return result;
};

/**
 * Saves/upserts pinned project IDs for a service slug
 */
export const saveServicePins = async (
  slug: string,
  projectIds: string[]
): Promise<{ success: boolean; error?: string }> => {
  // Always update local storage for offline / quick fallback support
  setLocalStoragePins(slug, projectIds);

  if (isSupabaseConfigured) {
    try {
      const payload = {
        service_slug: slug,
        project_ids: projectIds,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('service_featured_projects')
        .upsert(payload, { onConflict: 'service_slug' });

      if (error) {
        console.error(`Failed to upsert service pins for ${slug} into Supabase:`, error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  }

  return { success: true };
};
