import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  fetchAvailableSlotsForDate,
  createBooking,
  AvailableTimeSlot,
} from '../../../services/bookingService';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface BookingSlotProps {
  inquiryId?: string;
  clientName: string;
  clientEmail: string;
  onBookingSuccess?: () => void;
}

export const Step4BookingSlot: React.FC<BookingSlotProps> = ({
  inquiryId,
  clientName,
  clientEmail,
  onBookingSuccess,
}) => {
  // Generate list of available dates (next 14 days, starting tomorrow)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const formatDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(formatDateStr(availableDates[0]));
  const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedTimeLabel, setConfirmedTimeLabel] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const loadSlots = async () => {
      setIsLoadingSlots(true);
      setErrorMsg(null);
      setSelectedTime(null);
      try {
        const result = await fetchAvailableSlotsForDate(selectedDate);
        if (isMounted) {
          setSlots(result);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg('Failed to load slots for selected date.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSlots(false);
        }
      }
    };

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const handleConfirmBooking = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const slotLabel = slots.find((s) => s.time === selectedTime)?.label || selectedTime;

    const res = await createBooking({
      inquiryId,
      clientName: clientName || 'Client',
      clientEmail: clientEmail || 'client@example.com',
      bookedDate: selectedDate,
      bookedTime: selectedTime,
      duration: 30,
      meetingType: 'discovery',
    });

    setIsSubmitting(false);

    if (res.success) {
      setConfirmedTimeLabel(slotLabel);
      setBookingConfirmed(true);
      if (onBookingSuccess) onBookingSuccess();
    } else {
      setErrorMsg(res.message || 'Failed to book slot.');
    }
  };

  if (bookingConfirmed) {
    const formattedDisplayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-transparent border border-emerald-500/30 rounded-2xl text-center space-y-4"
      >
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="font-neutralfacebold text-lg text-gray-900 dark:text-white uppercase">
          Discovery Call Confirmed!
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Your 30-minute 1-on-1 discovery call is locked in for:
        </p>

        <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 bg-white/80 dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white mx-auto">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-sky-500" />
            <span>{formattedDisplayDate}</span>
          </div>
          <span className="hidden sm:inline text-gray-400">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>{confirmedTimeLabel}</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          A confirmation note has been recorded. The meeting link will be sent to{' '}
          <strong className="text-gray-800 dark:text-gray-200">{clientEmail}</strong>.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
        <div>
          <h4 className="font-neutralfacebold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-sky-500" />
            <span>Select Discovery Call Date & Time</span>
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pick a 30-minute window for our initial consultation.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500">
          {errorMsg}
        </div>
      )}

      {/* Date Carousel Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          1. Choose Date
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {availableDates.map((d) => {
            const dateVal = formatDateStr(d);
            const isSelected = selectedDate === dateVal;
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = d.getDate();
            const monthName = d.toLocaleDateString('en-US', { month: 'short' });

            return (
              <button
                key={dateVal}
                type="button"
                onClick={() => setSelectedDate(dateVal)}
                className={`flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-500/40'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">{dayName}</span>
                <span className="text-base font-neutralfacebold my-0.5">{dayNum}</span>
                <span className="text-[10px] opacity-75">{monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span>2. Choose Time Slot (PST / UTC+8)</span>
          {isLoadingSlots && (
            <span className="text-sky-500 flex items-center gap-1 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading times...
            </span>
          )}
        </label>

        {!isLoadingSlots && slots.length === 0 && (
          <p className="text-xs text-gray-500 py-4 text-center">
            No open time slots for this date. Please select another date.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.isAvailable}
                onClick={() => setSelectedTime(slot.time)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  !slot.isAvailable
                    ? 'opacity-40 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 cursor-not-allowed text-gray-400 line-through'
                    : isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 border-sky-500 text-white shadow-md'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-sky-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.label}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        disabled={!selectedTime || isSubmitting}
        onClick={handleConfirmBooking}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Locking in meeting...</span>
          </>
        ) : (
          <>
            <span>Confirm Discovery Call Booking</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
