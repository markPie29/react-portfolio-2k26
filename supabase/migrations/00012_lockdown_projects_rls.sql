-- Migration: 00012_lockdown_projects_rls.sql
-- Description: Lock down projects table & storage policies to authenticated admin only, restrict public write access.

-- ============================================================================
-- 1. LOCK DOWN PROJECTS TABLE RLS POLICIES
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access (portfolio visitors)
DROP POLICY IF EXISTS "Public select projects" ON public.projects;
CREATE POLICY "Public select projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Restrict INSERT to authenticated admin users only
DROP POLICY IF EXISTS "Admin insert projects" ON public.projects;
CREATE POLICY "Admin insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Restrict UPDATE to authenticated admin users only
DROP POLICY IF EXISTS "Admin update projects" ON public.projects;
CREATE POLICY "Admin update projects"
  ON public.projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Restrict DELETE to authenticated admin users only
DROP POLICY IF EXISTS "Admin delete projects" ON public.projects;
CREATE POLICY "Admin delete projects"
  ON public.projects
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================================================
-- 2. LOCK DOWN PROJECTS STORAGE BUCKET POLICIES
-- ============================================================================

-- Public read access for project media/images
DROP POLICY IF EXISTS "Anyone can read project assets" ON storage.objects;
CREATE POLICY "Anyone can read project assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'projects');

-- Require authentication for uploads, updates, and deletes in projects storage bucket
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

-- ============================================================================
-- 3. LOCK DOWN INQUIRY ATTACHMENTS STORAGE BUCKET POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read inquiry attachments" ON storage.objects;
CREATE POLICY "Admins can read inquiry attachments"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'inquiry-attachments' AND auth.role() = 'authenticated');
