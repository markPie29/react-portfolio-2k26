-- Migration: 00011_create_service_featured_projects.sql
-- Description: Table for storing up to 3 admin-selected featured projects per service.

CREATE TABLE IF NOT EXISTS public.service_featured_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL UNIQUE,
  project_ids text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookup by service_slug
CREATE UNIQUE INDEX IF NOT EXISTS service_featured_projects_slug_idx
  ON public.service_featured_projects (service_slug);

-- Enable RLS
ALTER TABLE public.service_featured_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public select service_featured_projects" ON public.service_featured_projects;
CREATE POLICY "Public select service_featured_projects"
  ON public.service_featured_projects
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert service_featured_projects" ON public.service_featured_projects;
CREATE POLICY "Admin insert service_featured_projects"
  ON public.service_featured_projects
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update service_featured_projects" ON public.service_featured_projects;
CREATE POLICY "Admin update service_featured_projects"
  ON public.service_featured_projects
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin delete service_featured_projects" ON public.service_featured_projects;
CREATE POLICY "Admin delete service_featured_projects"
  ON public.service_featured_projects
  FOR DELETE
  USING (true);
