-- Migration: 00010_add_booking_alert_tracking.sql
-- Description: Add last_upcoming_alert_at column to bookings table to track 1-hour pre-call Discord notifications.

ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS last_upcoming_alert_at TIMESTAMPTZ DEFAULT NULL;
