-- Migration: 00001_init_schema.sql
-- Description: Initial schema migration for Inquiries, Availability Slots, Discovery Call Bookings, RLS Policies, and Storage Bucket.

-- ============================================================================
-- 1. INQUIRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  services TEXT[] NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  project_type TEXT NOT NULL,
  feature_chips TEXT[],
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewed','contacted','booked','completed','archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) for Inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select inquiries" ON public.inquiries;
CREATE POLICY "Admin select inquiries"
  ON public.inquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update inquiries" ON public.inquiries;
CREATE POLICY "Admin update inquiries"
  ON public.inquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete inquiries" ON public.inquiries;
CREATE POLICY "Admin delete inquiries"
  ON public.inquiries
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================================================
-- 2. AVAILABILITY SLOTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INT DEFAULT 30 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) for Availability Slots
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active slots" ON public.availability_slots;
CREATE POLICY "Public read active slots"
  ON public.availability_slots
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin manage slots" ON public.availability_slots;
CREATE POLICY "Admin manage slots"
  ON public.availability_slots
  FOR ALL
  USING (auth.role() = 'authenticated');


-- ============================================================================
-- 3. BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  booked_date DATE NOT NULL,
  booked_time TIME NOT NULL,
  duration INT DEFAULT 30 NOT NULL,
  meeting_type TEXT DEFAULT 'discovery' CHECK (meeting_type IN ('discovery','follow-up','consultation')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','completed','no-show')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) for Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read bookings" ON public.bookings;
CREATE POLICY "Admin read bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update bookings" ON public.bookings;
CREATE POLICY "Admin update bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete bookings" ON public.bookings;
CREATE POLICY "Admin delete bookings"
  ON public.bookings
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================================================
-- 4. SUPABASE STORAGE BUCKET: inquiry-attachments
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-attachments', 'inquiry-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Anyone can upload inquiry attachments" ON storage.objects;
CREATE POLICY "Anyone can upload inquiry attachments"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'inquiry-attachments');

DROP POLICY IF EXISTS "Anyone can read inquiry attachments" ON storage.objects;
CREATE POLICY "Anyone can read inquiry attachments"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'inquiry-attachments');
