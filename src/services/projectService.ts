import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProjectItem } from '../types/content';
import { ProjectRow } from '../types/database';
import { projectsData } from '../data/projects';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export interface ProjectFormData {
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  role?: string;
  techStack: string[];
  features?: string[];
  image?: string;
  images?: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  href?: string;
  displayOrder?: number;
}

/**
 * Converts a database row to a ProjectItem format used by UI components
 */
export const mapRowToProjectItem = (row: ProjectRow): ProjectItem => {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    longDescription: row.long_description || undefined,
    role: row.role || undefined,
    techStack: row.tech_stack || [],
    features: row.features || [],
    image: row.image || undefined,
    images: row.images && row.images.length > 0 ? row.images : row.image ? [row.image] : [],
    videoUrl: row.video_url || undefined,
    liveUrl: row.live_url || undefined,
    githubUrl: row.github_url || undefined,
    href: row.href || '#',
  };
};

/**
 * Uploads a single media file (image or video) to Supabase Storage bucket 'projects'.
 * If the file exceeds 50MB, it throws a descriptive warning suggesting hardcoding/local asset path.
 */
export const uploadProjectMedia = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `File "${file.name}" is ${sizeMb}MB, exceeding the 50MB Supabase limit. Please place your media file in /public/assets/projects/ and use the direct path (e.g. /assets/projects/${file.name}) or hosted URL instead.`
    );
  }

  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set environment variables to upload media.');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `project-${Date.now()}-${Math.random().toString(36).substring(7)}-${cleanFileName}`;

  const { data, error } = await supabase.storage.from('projects').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Supabase project storage upload error:', error);
    throw new Error(`Upload failed for ${file.name}: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('projects').getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

const DELETED_PROJECTS_KEY = 'deleted_project_ids';
const EDITED_PROJECTS_KEY = 'edited_projects_override_map';

const getDeletedProjectIds = (): string[] => {
  try {
    const stored = localStorage.getItem(DELETED_PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addDeletedProjectId = (id: string): void => {
  try {
    const deleted = getDeletedProjectIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(deleted));
    }
  } catch (err) {
    console.error('Failed to save deleted project ID to localStorage:', err);
  }
};

const getEditedProjectsMap = (): Record<string, ProjectItem> => {
  try {
    const stored = localStorage.getItem(EDITED_PROJECTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveEditedProjectOverride = (item: ProjectItem): void => {
  try {
    const map = getEditedProjectsMap();
    map[item.id] = item;
    localStorage.setItem(EDITED_PROJECTS_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save edited project override to localStorage:', err);
  }
};

const IS_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Fetches all projects from Supabase. Fallbacks to local hardcoded data if table is empty or Supabase is unconfigured.
 */
export const fetchProjects = async (): Promise<ProjectItem[]> => {
  const deletedIds = getDeletedProjectIds();
  const editedMap = getEditedProjectsMap();
  let resultProjects: ProjectItem[] = [];

  if (!isSupabaseConfigured) {
    resultProjects = projectsData;
  } else {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) {
          console.warn('Supabase fetch projects error, using hardcoded fallback:', error.message);
        }
        resultProjects = projectsData;
      } else {
        resultProjects = data.map((row: ProjectRow) => mapRowToProjectItem(row));
      }
    } catch (err) {
      console.error('Unexpected error fetching projects:', err);
      resultProjects = projectsData;
    }
  }

  // Apply edited overrides
  const mergedProjects = resultProjects.map((p) => editedMap[p.id] || p);

  // Include any newly created/migrated override projects that aren't in resultProjects yet
  Object.values(editedMap).forEach((editedItem) => {
    if (!mergedProjects.some((p) => p.id === editedItem.id)) {
      mergedProjects.unshift(editedItem);
    }
  });

  return mergedProjects.filter((p) => !deletedIds.includes(p.id));
};

/**
 * Creates a new project in Supabase DB
 */
export const createProject = async (
  form: ProjectFormData,
  coverFile?: File | null,
  galleryFiles?: File[]
): Promise<{ success: boolean; project?: ProjectItem; error?: string }> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase environment variables are missing. Cannot insert project.',
    };
  }

  try {
    let coverUrl = form.image || '';
    const galleryUrls: string[] = form.images ? [...form.images] : [];

    // 1. Upload Cover File if provided
    if (coverFile) {
      coverUrl = await uploadProjectMedia(coverFile);
    }

    // 2. Upload Gallery Files if provided
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        const url = await uploadProjectMedia(file);
        galleryUrls.push(url);
      }
    }

    const newId = crypto.randomUUID();

    const payload = {
      id: newId,
      title: form.title,
      category: form.category,
      description: form.description,
      long_description: form.longDescription || null,
      role: form.role || null,
      tech_stack: form.techStack,
      features: form.features || [],
      image: coverUrl || null,
      images: galleryUrls,
      video_url: form.videoUrl || null,
      live_url: form.liveUrl || null,
      github_url: form.githubUrl || null,
      href: form.href || '#',
      display_order: form.displayOrder ?? 0,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Failed to insert project into Supabase:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      project: mapRowToProjectItem(data as ProjectRow),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
};

/**
 * Updates an existing project in Supabase DB
 */
export const updateProject = async (
  id: string,
  form: ProjectFormData,
  newCoverFile?: File | null,
  newGalleryFiles?: File[]
): Promise<{ success: boolean; project?: ProjectItem; error?: string }> => {
  try {
    let coverUrl = form.image || '';
    const galleryUrls: string[] = form.images ? [...form.images] : [];

    if (newCoverFile && isSupabaseConfigured) {
      coverUrl = await uploadProjectMedia(newCoverFile);
    }

    if (newGalleryFiles && newGalleryFiles.length > 0 && isSupabaseConfigured) {
      for (const file of newGalleryFiles) {
        const url = await uploadProjectMedia(file);
        galleryUrls.push(url);
      }
    }

    const isUuid = IS_UUID_REGEX.test(id);
    const targetId = isUuid ? id : crypto.randomUUID();

    // If migrating non-UUID hardcoded item to UUID
    if (!isUuid) {
      addDeletedProjectId(id);
    }

    const updatedItem: ProjectItem = {
      id: targetId,
      title: form.title,
      category: form.category,
      description: form.description,
      longDescription: form.longDescription || undefined,
      role: form.role || undefined,
      techStack: form.techStack,
      features: form.features || [],
      image: coverUrl || undefined,
      images: galleryUrls,
      videoUrl: form.videoUrl || undefined,
      liveUrl: form.liveUrl || undefined,
      githubUrl: form.githubUrl || undefined,
      href: form.href || '#',
    };

    // Save override locally for instant preview / fallback persistence
    saveEditedProjectOverride(updatedItem);

    if (isSupabaseConfigured) {
      const payload = {
        id: targetId,
        title: form.title,
        category: form.category,
        description: form.description,
        long_description: form.longDescription || null,
        role: form.role || null,
        tech_stack: form.techStack,
        features: form.features || [],
        image: coverUrl || null,
        images: galleryUrls,
        video_url: form.videoUrl || null,
        live_url: form.liveUrl || null,
        github_url: form.githubUrl || null,
        href: form.href || '#',
        display_order: form.displayOrder ?? 0,
        updated_at: new Date().toISOString(),
      };

      if (isUuid) {
        const { data, error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.warn('Update failed, falling back to insert:', error.message);
          const { data: insertData, error: insertError } = await supabase
            .from('projects')
            .insert([payload])
            .select()
            .single();

          if (!insertError && insertData) {
            return {
              success: true,
              project: mapRowToProjectItem(insertData as ProjectRow),
            };
          }
        } else if (data) {
          return {
            success: true,
            project: mapRowToProjectItem(data as ProjectRow),
          };
        }
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('projects')
          .insert([payload])
          .select()
          .single();

        if (!insertError && insertData) {
          return {
            success: true,
            project: mapRowToProjectItem(insertData as ProjectRow),
          };
        }
      }
    }

    return {
      success: true,
      project: updatedItem,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
};

/**
 * Deletes a project from Supabase DB & local override
 */
export const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
  // Always mark in local deleted list so fallback or local UI persists deletion
  addDeletedProjectId(id);

  // If Supabase is configured and ID is a valid UUID, attempt deletion from DB as well
  if (isSupabaseConfigured && IS_UUID_REGEX.test(id)) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.warn('Supabase DB delete notification:', error.message);
      }
    } catch (err: any) {
      console.error('Supabase DB delete error:', err);
    }
  }

  return { success: true };
};
