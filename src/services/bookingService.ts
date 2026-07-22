import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BookingRow, MeetingType } from '../types/database';

export interface AvailableTimeSlot {
  time: string; // e.g. "09:00"
  label: string; // e.g. "9:00 AM"
  isAvailable: boolean;
}

export interface CreateBookingPayload {
  inquiryId?: string;
  clientName: string;
  clientEmail: string;
  bookedDate: string; // YYYY-MM-DD
  bookedTime: string; // HH:mm
  duration?: number;
  meetingType?: MeetingType;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  error?: string;
}

// Standard default business hour slots for fallback/initial setup
const DEFAULT_BUSINESS_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

const formatTimeLabel = (time24: string): string => {
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minStr || '00'} ${period}`;
};

export const fetchAvailableSlotsForDate = async (
  dateStr: string // YYYY-MM-DD
): Promise<AvailableTimeSlot[]> => {
  if (!isSupabaseConfigured) {
    // Return mock slots for local preview
    return DEFAULT_BUSINESS_SLOTS.map((time, idx) => ({
      time,
      label: formatTimeLabel(time),
      isAvailable: idx !== 2, // Mock 11:00 AM as booked for testing UI
    }));
  }

  try {
    const selectedDate = new Date(dateStr);
    const dayOfWeek = selectedDate.getDay(); // 0=Sun..6=Sat

    // 1. Fetch active custom rules for this day of week or specific date
    const { data: slotsData, error: slotsError } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('is_active', true)
      .or(`day_of_week.eq.${dayOfWeek},specific_date.eq.${dateStr}`);

    if (slotsError) {
      console.warn('Error fetching availability_slots, using default slots:', slotsError);
    }

    // Determine base times
    let baseTimes: string[] = DEFAULT_BUSINESS_SLOTS;

    if (slotsData && slotsData.length > 0) {
      const generatedTimes: string[] = [];
      for (const slot of slotsData) {
        const startH = parseInt(slot.start_time.split(':')[0], 10);
        const endH = parseInt(slot.end_time.split(':')[0], 10);
        const step = (slot.slot_duration || 30) / 60;

        for (let h = startH; h < endH; h += step) {
          const hours = Math.floor(h);
          const mins = Math.round((h - hours) * 60);
          const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
          if (!generatedTimes.includes(timeStr)) {
            generatedTimes.push(timeStr);
          }
        }
      }
      if (generatedTimes.length > 0) {
        baseTimes = generatedTimes.sort();
      }
    }

    // 2. Fetch existing bookings for this date to check booked slots
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('booked_time, status')
      .eq('booked_date', dateStr)
      .neq('status', 'cancelled');

    if (bookingsError) {
      console.warn('Error fetching existing bookings:', bookingsError);
    }

    const bookedTimesSet = new Set(
      (existingBookings || []).map((b) => b.booked_time.substring(0, 5))
    );

    return baseTimes.map((time) => ({
      time,
      label: formatTimeLabel(time),
      isAvailable: !bookedTimesSet.has(time),
    }));
  } catch (err) {
    console.error('Failed to fetch available slots:', err);
    return DEFAULT_BUSINESS_SLOTS.map((time) => ({
      time,
      label: formatTimeLabel(time),
      isAvailable: true,
    }));
  }
};

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<BookingResponse> => {
  if (!isSupabaseConfigured) {
    console.log('Simulating booking creation (Supabase env missing):', payload);
    return {
      success: true,
      message: 'Discovery call booked in local preview mode!',
      bookingId: `BOOK-DEV-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          inquiry_id: payload.inquiryId || null,
          client_name: payload.clientName,
          client_email: payload.clientEmail,
          booked_date: payload.bookedDate,
          booked_time: payload.bookedTime,
          duration: payload.duration || 30,
          meeting_type: payload.meetingType || 'discovery',
          status: 'confirmed',
          notes: payload.notes || null,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase Booking Insert Error:', error);
      return {
        success: false,
        message: 'Failed to confirm booking. Please try another time slot.',
        error: error.message,
      };
    }

    // Update status of linked inquiry to 'booked'
    if (payload.inquiryId) {
      await supabase
        .from('inquiries')
        .update({ status: 'booked' })
        .eq('id', payload.inquiryId);
    }

    return {
      success: true,
      message: 'Discovery call booked successfully!',
      bookingId: data?.id,
    };
  } catch (err: any) {
    console.error('Unexpected booking error:', err);
    return {
      success: false,
      message: 'An error occurred while booking. Please try again.',
      error: err?.message || 'Unknown error',
    };
  }
};
