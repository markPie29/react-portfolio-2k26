# Supabase Backend & Scheduling Dashboard — Implementation Checklist

> **Project Goal**: Add a zero-cost backend using Supabase for persistent inquiry tracking, client discovery call scheduling, and an admin dashboard.

---

## 📌 Architectural & Decision Summary
- **Database & Auth Platform**: Supabase (Free Tier - 500MB DB, 1GB Storage, 50K Auth MAUs).
- **Admin Auth**: Email & Password only (single-user admin access).
- **Meeting Links**: Manually created & updated by Admin from Dashboard (no Google Calendar API overhead).
- **Free Notification Workaround**: Discord / Telegram Webhook trigger or Supabase Database Webhook (100% free, no domain required).
- **Keep-Alive Strategy**: GitHub Actions scheduled cron job (`.github/workflows/keep-alive.yml`) to prevent Supabase 1-week inactivity pausing.

---

## 📋 Progress Checklist

### Phase 1: Supabase Setup & Database Schema
- [x] **Supabase Project Creation**
  - [x] Install `@supabase/supabase-js`.
  - [x] Create `src/lib/supabase.ts` singleton client.
  - [x] Create `src/types/database.ts` schema definitions.
- [ ] **Database Schema & SQL Execution (In Supabase Console)**
  - [ ] Execute SQL script for `inquiries` table in Supabase SQL Editor.
  - [ ] Execute SQL script for `availability_slots` table in Supabase SQL Editor.
  - [ ] Execute SQL script for `bookings` table in Supabase SQL Editor.
  - [ ] Enable Row Level Security (RLS) policies for all 3 tables.
  - [ ] Create Supabase Storage bucket (`inquiry-attachments`) with public/authenticated access policies.
- [x] **Frontend Supabase Client Integration**
  - [x] Refactor `src/services/inquiryService.ts` to upload attachments to Supabase Storage & insert rows directly into `inquiries`.

---

### Phase 2: Booking & Scheduling System (Client View)
- [x] **Booking Service (`src/services/bookingService.ts`)**
  - [x] Function `fetchAvailableSlotsForDate(date: Date)` to calculate open time slots.
  - [x] Function `createBooking(inquiryId, date, time)` to insert client booking.
- [x] **Interactive Slot Selection Component (`src/components/home/inquiry/Step4BookingSlot.tsx`)**
  - [x] Interactive 14-day calendar date picker.
  - [x] Time slot grid displaying real-time available hours.
  - [x] Instant booking confirmation & reference generation.
- [x] **Inquiry Form Flow Update**
  - [x] Update `ProjectInquiryForm.tsx` & `InquirySuccess.tsx` to launch Step 4 booking upon inquiry submission.

---

### Phase 3: Auth & Admin Protected Routing
- [x] **Auth Context (`src/context/AuthContext.tsx`)**
  - [x] Implement `useAuth` hook (`user`, `session`, `loading`, `signIn`, `signOut`).
  - [x] Session listener with `supabase.auth.onAuthStateChange`.
- [x] **Protected Route Component (`src/components/admin/ProtectedRoute.tsx`)**
  - [x] Route guard redirecting unauthenticated users to `/admin/login`.
- [x] **Admin Login View (`src/pages/admin/AdminLogin.tsx`)**
  - [x] Sleek email/password login form styled in portfolio dark glassmorphism.
- [x] **Routing Updates (`src/components/AnimatedRoutes.tsx` & `src/main.tsx`)**
  - [x] Wrap application in `<AuthProvider>`.
  - [x] Register `/admin/login`, `/admin`, `/admin/inquiries`, `/admin/calendar`, `/admin/availability`.

---

### Phase 4: Admin Dashboard — Inquiry Management
- [x] **Admin Shell & Navigation (`src/components/admin/AdminLayout.tsx`)**
  - [x] Dark glassmorphism sidebar navigation & top bar.
- [x] **Overview Page (`src/pages/admin/AdminDashboard.tsx`)**
  - [x] Metric cards: Total Inquiries, New Inquiries, Confirmed Calls, Completed Calls.
- [x] **Inquiries Management Page (`src/pages/admin/InquiriesPage.tsx`)**
  - [x] Sortable & filterable inquiries table (`new`, `reviewed`, `contacted`, `booked`, `completed`, `archived`).
  - [x] Status badge updater & search bar.
- [x] **Inquiry Detail Panel (`src/pages/admin/InquiryDetailPanel.tsx`)**
  - [x] Slide-out modal with full client brief, attached files viewer, & editable admin notes.
  - [x] Manual Meeting Link field (e.g. paste Google Meet / Zoom link).

---

### Phase 5: Admin Dashboard — Calendar & Availability
- [x] **Calendar Overview Page (`src/pages/admin/CalendarPage.tsx`)**
  - [x] Weekly / Monthly visual schedule showing booked discovery calls.
  - [x] Click-to-view booking details & client contact info.
  - [x] Inline manual Google Meet / Zoom meeting link editor.
- [x] **Availability Manager (`src/pages/admin/AvailabilityManager.tsx`)**
  - [x] Weekly recurring schedule configurator (e.g., Mon-Fri 9:00 AM - 5:00 PM, 30-min slots).
  - [x] Specific date overrides (block holidays or add weekend availability).

---

### Phase 6: Keep-Alive Cron, Free Notifications & Cleanup
- [x] **GitHub Actions Keep-Alive Cron Workflow**
  - [x] Create `.github/workflows/keep-alive.yml` to ping Supabase REST endpoint daily.
- [x] **Free Notification Workaround (Discord / Telegram Webhook)**
  - [x] Add lightweight webhook call upon new inquiry submission to send instant alert to Discord/Telegram (100% free, no custom domain needed).
- [x] **Configuration Files**
  - [x] Create `.env.example` with Supabase & Discord Webhook keys.

---

### Phase 7: Code Quality & Error Verification
- [x] **ESLint Linter Pass**: Checked all files — 0 errors found.
- [x] **Vite Build Verification**: `npm run build` completed cleanly in 1.02s with 0 compilation errors.
- [x] **React Purity & Hooks Check**: Fixed conditional hook calls and random generator purity checks.

---

## 📜 Database SQL Reference Script (Run in Supabase SQL Editor)

```sql
-- 1. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
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
  attachments JSONB DEFAULT '[]',
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewed','contacted','booked','completed','archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Availability Slots Table
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  booked_date DATE NOT NULL,
  booked_time TIME NOT NULL,
  duration INT DEFAULT 30,
  meeting_type TEXT DEFAULT 'discovery' CHECK (meeting_type IN ('discovery','follow-up','consultation')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','completed','no-show')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update inquiries" ON inquiries FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active slots" ON availability_slots FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage slots" ON availability_slots FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read bookings" ON bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update bookings" ON bookings FOR UPDATE USING (auth.role() = 'authenticated');
```
