import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar as CalendarIcon, Clock, RotateCcw } from 'lucide-react';

interface SuccessProps {
  onReset: () => void;
  inquiryId?: string;
  clientName?: string;
  clientEmail?: string;
  bookedDate?: string;
  bookedTime?: string;
}

const formatTimeLabel = (time24: string): string => {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minStr || '00'} ${period}`;
};

export const InquirySuccess: React.FC<SuccessProps> = ({
  onReset,
  inquiryId,
  clientEmail = '',
  bookedDate = '',
  bookedTime = '',
}) => {
  const formattedDisplayDate = bookedDate
    ? new Date(bookedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-6 px-2 text-center space-y-6 max-w-xl mx-auto"
    >
      {/* Animated Check Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30"
      >
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </motion.div>

      <div className="space-y-1.5">
        <h3 className="text-2xl font-neutralfacebold text-gray-900 dark:text-white uppercase tracking-tight">
          Inquiry & Discovery Call Booked!
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
          Thank you for reaching out. Your project inquiry has been received and your discovery call schedule is confirmed.
        </p>
        {inquiryId && (
          <p className="text-[11px] text-sky-500 font-mono pt-1">Ref ID: {inquiryId}</p>
        )}
      </div>

      {/* Confirmed Schedule Card */}
      {bookedDate && bookedTime && (
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-transparent border border-emerald-500/30 rounded-2xl space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Your 30-minute discovery call is scheduled for:
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 bg-white/80 dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white mx-auto">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-sky-500" />
              <span>{formattedDisplayDate}</span>
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>{formatTimeLabel(bookedTime)}</span>
            </div>
          </div>

          {clientEmail && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Confirmation details will be sent to{' '}
              <strong className="text-gray-800 dark:text-gray-200">{clientEmail}</strong>.
            </p>
          )}
        </div>
      )}

      {/* Reset Form Option */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Submit another inquiry</span>
        </button>
      </div>
    </motion.div>
  );
};
