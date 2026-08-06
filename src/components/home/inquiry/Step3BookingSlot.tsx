import React, { useState, useEffect } from 'react';
import {
  fetchAvailableSlotsForDate,
  AvailableTimeSlot,
} from '../../../services/bookingService';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { FieldErrors } from 'react-hook-form';
import { ProjectInquiryFormData } from '../../../types/inquirySchema';
import { CURATED_TIMEZONES, convertTimezoneSlot } from '../../../utils/timezone';

interface Step3BookingSlotProps {
  selectedDate: string;
  selectedTime: string;
  selectedTimezone: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onSelectTimezone: (tz: string) => void;
  errors: FieldErrors<ProjectInquiryFormData>;
}

export const Step3BookingSlot: React.FC<Step3BookingSlotProps> = ({
  selectedDate,
  selectedTime,
  selectedTimezone,
  onSelectDate,
  onSelectTime,
  onSelectTimezone,
  errors,
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

  // Default selected date if empty
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      onSelectDate(formatDateStr(availableDates[0]));
    }
  }, [selectedDate, onSelectDate]);

  const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) return;
    let isMounted = true;

    const loadSlots = async () => {
      setIsLoadingSlots(true);
      setErrorMsg(null);
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

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4 gap-4">
        <div>
          <h4 className="font-neutralfacebold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-sky-500" />
            <span>Select Discovery Call Date & Time</span>
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pick a 30-minute window for our initial consultation.
          </p>
        </div>

        {/* Timezone Selector Component */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl shrink-0">
          <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <select
            value={selectedTimezone}
            onChange={(e) => onSelectTimezone(e.target.value)}
            className="bg-transparent text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer border-none py-0.5"
          >
            {CURATED_TIMEZONES.map((tz) => (
              <option key={tz.tz} value={tz.tz} className="bg-white dark:bg-[#0c1017] text-gray-900 dark:text-gray-100">
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(errorMsg || errors.bookedDate || errors.bookedTime) && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500 space-y-1">
          {errorMsg && <div>{errorMsg}</div>}
          {errors.bookedDate && <div>{errors.bookedDate.message}</div>}
          {errors.bookedTime && <div>{errors.bookedTime.message}</div>}
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
                onClick={() => {
                  onSelectDate(dateVal);
                }}
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
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            2. Choose Time Slot
          </label>
          {isLoadingSlots && (
            <span className="text-sky-500 flex items-center gap-1 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading times...
            </span>
          )}
        </div>

        {!isLoadingSlots && slots.length === 0 && (
          <p className="text-xs text-gray-500 py-6 text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            No open time slots for this date. Please select another date.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const { localLabel, utc8Label } = convertTimezoneSlot(
              selectedDate,
              slot.time,
              selectedTimezone
            );

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.isAvailable}
                onClick={() => onSelectTime(slot.time)}
                title={selectedTimezone !== 'Asia/Manila' ? `${utc8Label} (PST / UTC+8)` : undefined}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  !slot.isAvailable
                    ? 'opacity-40 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 cursor-not-allowed text-gray-400 line-through'
                    : isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 border-sky-500 text-white shadow-md'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-sky-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500 group-hover:scale-110 transition-transform" />
                  <span>{localLabel}</span>
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

