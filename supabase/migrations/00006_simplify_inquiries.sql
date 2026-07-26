-- Migration: 00006_simplify_inquiries.sql
-- Description: Drop deprecated columns (services, budget, timeline, feature_chips, attachments) and update status constraint to ('new', 'confirmed', 'cancelled').

-- 1. Migrate existing status values before dropping/updating constraints
UPDATE public.inquiries
SET status = 'confirmed'
WHERE status IN ('reviewed', 'contacted', 'booked');

UPDATE public.inquiries
SET status = 'cancelled'
WHERE status IN ('completed', 'archived');

-- 2. Drop constraint and recreate with new status list
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status IN ('new', 'confirmed', 'cancelled'));

-- 3. Drop deprecated columns
ALTER TABLE public.inquiries DROP COLUMN IF EXISTS services;
ALTER TABLE public.inquiries DROP COLUMN IF EXISTS budget;
ALTER TABLE public.inquiries DROP COLUMN IF EXISTS timeline;
ALTER TABLE public.inquiries DROP COLUMN IF EXISTS feature_chips;
ALTER TABLE public.inquiries DROP COLUMN IF EXISTS attachments;
