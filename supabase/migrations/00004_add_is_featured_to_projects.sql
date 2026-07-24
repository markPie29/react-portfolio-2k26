-- Migration: 00004_add_is_featured_to_projects.sql
-- Description: Add is_featured boolean column to projects table to support featuring projects from the admin dashboard.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL;

-- Create an index to optimize querying featured projects
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);
