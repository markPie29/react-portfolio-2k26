-- Migration: 00002_projects_schema.sql
-- Description: Projects table schema, RLS Policies, Storage Bucket policies, and default seed configuration.

-- ============================================================================
-- 1. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  role TEXT,
  tech_stack TEXT[] DEFAULT '{}'::text[] NOT NULL,
  features TEXT[] DEFAULT '{}'::text[],
  image TEXT,
  images TEXT[] DEFAULT '{}'::text[],
  video_url TEXT,
  live_url TEXT,
  github_url TEXT,
  href TEXT DEFAULT '#',
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for ordering projects
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone (public) can read projects
DROP POLICY IF EXISTS "Public select projects" ON public.projects;
CREATE POLICY "Public select projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated Admins can insert projects
DROP POLICY IF EXISTS "Admin insert projects" ON public.projects;
CREATE POLICY "Admin insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated Admins can update projects
DROP POLICY IF EXISTS "Admin update projects" ON public.projects;
CREATE POLICY "Admin update projects"
  ON public.projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated Admins can delete projects
DROP POLICY IF EXISTS "Admin delete projects" ON public.projects;
CREATE POLICY "Admin delete projects"
  ON public.projects
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================================================
-- 2. SUPABASE STORAGE BUCKET: projects
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'projects' bucket
DROP POLICY IF EXISTS "Anyone can read project assets" ON storage.objects;
CREATE POLICY "Anyone can read project assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admins can upload project assets" ON storage.objects;
CREATE POLICY "Admins can upload project assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update project assets" ON storage.objects;
CREATE POLICY "Admins can update project assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete project assets" ON storage.objects;
CREATE POLICY "Admins can delete project assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
