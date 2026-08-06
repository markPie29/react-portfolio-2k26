-- Migration: 00008_add_categories_to_projects.sql
-- Description: Add a categories array column to the projects table so a project can be tagged with more than one category.
-- The existing `category` column is kept as the primary/legacy fallback and continues to be written alongside `categories`.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}'::text[] NOT NULL;

-- Index for filtering projects by category membership
CREATE INDEX IF NOT EXISTS idx_projects_categories ON public.projects USING GIN (categories);
