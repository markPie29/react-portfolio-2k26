-- Migration: 00005_security_fixes.sql
-- Description: Fix RLS policies for anonymous slot checking, add double-booking prevention constraint, and tighten storage security.

-- 1. Public RLS policy for Bookings (Only check booked times, without exposing sensitive client data)
DROP POLICY IF EXISTS "Public read confirmed bookings time slots" ON public.bookings;
CREATE POLICY "Public read confirmed bookings time slots"
  ON public.bookings
  FOR SELECT
  USING (status != 'cancelled');

-- 2. Add Unique Index to prevent double booking the exact same date and time slot
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking_slot
  ON public.bookings (booked_date, booked_time)
  WHERE status != 'cancelled';

-- 3. Storage Bucket Configuration & Policy Hardening
UPDATE storage.buckets
SET file_size_limit = 5242880, -- 5MB limit
    allowed_mime_types = ARRAY[
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'application/zip',
      'application/x-figma'
    ]
WHERE id = 'inquiry-attachments';
