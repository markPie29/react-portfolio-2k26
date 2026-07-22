export type InquiryStatus =
  | 'new'
  | 'reviewed'
  | 'contacted'
  | 'booked'
  | 'completed'
  | 'archived';

export interface InquiryAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
  content?: string; // base64 fallback
}

export interface InquiryRow {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  services: string[];
  budget: string;
  timeline: string;
  project_type: string;
  feature_chips: string[] | null;
  description: string;
  attachments: InquiryAttachment[];
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

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no-show';
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
