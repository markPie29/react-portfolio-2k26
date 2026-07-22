import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, RotateCcw } from 'lucide-react';
import { Step4BookingSlot } from './Step4BookingSlot';

interface SuccessProps {
  onReset: () => void;
  inquiryId?: string;
  clientName?: string;
  clientEmail?: string;
}

export const InquirySuccess: React.FC<SuccessProps> = ({
  onReset,
  inquiryId,
  clientName = '',
  clientEmail = '',
}) => {
  const [showBooking, setShowBooking] = useState<boolean>(true);

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
        className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto border-2 border-sky-500/30"
      >
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </motion.div>

      <div className="space-y-1.5">
        <h3 className="text-2xl font-neutralfacebold text-gray-900 dark:text-white uppercase tracking-tight">
          Inquiry Received!
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
          Thank you for reaching out. Your inquiry has been stored. You can now choose a time slot below to schedule our discovery call directly.
        </p>
        {inquiryId && (
          <p className="text-[11px] text-sky-500 font-mono pt-1">Ref ID: {inquiryId}</p>
        )}
      </div>

      {/* Integrated Discovery Call Booking */}
      {showBooking ? (
        <div className="p-6 bg-white/50 dark:bg-white/5 border border-sky-500/20 rounded-2xl">
          <Step4BookingSlot
            inquiryId={inquiryId}
            clientName={clientName}
            clientEmail={clientEmail}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowBooking(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-500 text-xs font-semibold hover:bg-sky-500/20 transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Discovery Call</span>
        </button>
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
