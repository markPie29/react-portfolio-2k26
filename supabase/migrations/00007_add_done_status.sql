-- Migration: 00007_add_done_status.sql
-- Description: Update inquiries_status_check constraint to include 'done' status.

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status IN ('new', 'confirmed', 'done', 'cancelled'));
