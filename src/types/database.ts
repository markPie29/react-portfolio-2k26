export type InquiryStatus = 'new' | 'confirmed' | 'done' | 'cancelled';

export interface InquiryRow {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  project_type: string;
  description: string;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlotRow {
  id: string;
  day_of_week: number | null; // 0=Sun, 1=Mon... 6=Sat
  specific_date: string | null; // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  slot_duration: number; // in minutes
  is_active: boolean;
  created_at: string;
}

export type BookingStatus = 'new' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type MeetingType = 'discovery' | 'follow-up' | 'consultation';

export interface BookingRow {
  id: string;
  inquiry_id: string | null;
  client_name: string;
  client_email: string;
  booked_date: string; // YYYY-MM-DD
  booked_time: string; // HH:mm
  duration: number; // minutes
  meeting_type: MeetingType;
  status: BookingStatus;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  category?: string | null;
  categories?: string[] | null;
  description: string;
  long_description: string | null;
  role: string | null;
  tech_stack: string[];
  features: string[] | null;
  image: string | null;
  images: string[] | null;
  video_url: string | null;
  live_url: string | null;
  github_url: string | null;
  href: string | null;
  display_order: number;
  is_featured?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceFeaturedProjectRow {
  id: string;
  service_slug: string;
  project_ids: string[];
  created_at: string;
  updated_at: string;
}


