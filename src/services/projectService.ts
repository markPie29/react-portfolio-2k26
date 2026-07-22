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

/**
 * Fetches all projects from Supabase. Fallbacks to local hardcoded data if table is empty or Supabase is unconfigured.
 */
export const fetchProjects = async (): Promise<ProjectItem[]> => {
  if (!isSupabaseConfigured) {
    return projectsData;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch projects error, using hardcoded fallback:', error.message);
      return projectsData;
    }

    if (!data || data.length === 0) {
      return projectsData;
    }

    return data.map((row: ProjectRow) => mapRowToProjectItem(row));
  } catch (err) {
    console.error('Unexpected error fetching projects:', err);
    return projectsData;
  }
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

    // Ensure cover URL is included in gallery images if empty
    if (coverUrl && !galleryUrls.includes(coverUrl)) {
      galleryUrls.unshift(coverUrl);
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
      image: coverUrl || (galleryUrls[0] ?? null),
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
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase environment variables missing.' };
  }

  try {
    let coverUrl = form.image || '';
    const galleryUrls: string[] = form.images ? [...form.images] : [];

    if (newCoverFile) {
      coverUrl = await uploadProjectMedia(newCoverFile);
    }

    if (newGalleryFiles && newGalleryFiles.length > 0) {
      for (const file of newGalleryFiles) {
        const url = await uploadProjectMedia(file);
        galleryUrls.push(url);
      }
    }

    if (coverUrl && !galleryUrls.includes(coverUrl)) {
      galleryUrls.unshift(coverUrl);
    }

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      long_description: form.longDescription || null,
      role: form.role || null,
      tech_stack: form.techStack,
      features: form.features || [],
      image: coverUrl || (galleryUrls[0] ?? null),
      images: galleryUrls,
      video_url: form.videoUrl || null,
      live_url: form.liveUrl || null,
      github_url: form.githubUrl || null,
      href: form.href || '#',
      display_order: form.displayOrder ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update project in Supabase:', error);
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
 * Deletes a project from Supabase DB
 */
export const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase not configured.' };
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
};
