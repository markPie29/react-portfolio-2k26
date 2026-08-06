-- Migration: 00009_add_reminder_tracking.sql
-- Description: Add last_reminder_sent_at column to inquiries table to track hourly Discord reminders for unconfirmed inquiries.

ALTER TABLE public.inquiries 
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ DEFAULT NULL;
