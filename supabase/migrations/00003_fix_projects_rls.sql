-- Migration: 00003_fix_projects_rls.sql
-- Description: Ensure full access for project management in admin dashboard (including DELETE, INSERT, UPDATE) for both authenticated and public/anon roles.

-- 1. Update RLS Policies on public.projects
DROP POLICY IF EXISTS "Public select projects" ON public.projects;
CREATE POLICY "Public select projects"
  ON public.projects
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert projects" ON public.projects;
CREATE POLICY "Admin insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update projects" ON public.projects;
CREATE POLICY "Admin update projects"
  ON public.projects
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin delete projects" ON public.projects;
CREATE POLICY "Admin delete projects"
  ON public.projects
  FOR DELETE
  USING (true);

-- 2. Update Storage Policies for 'projects' bucket
DROP POLICY IF EXISTS "Anyone can read project assets" ON storage.objects;
CREATE POLICY "Anyone can read project assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admins can upload project assets" ON storage.objects;
CREATE POLICY "Admins can upload project assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admins can update project assets" ON storage.objects;
CREATE POLICY "Admins can update project assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admins can delete project assets" ON storage.objects;
CREATE POLICY "Admins can delete project assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'projects');
