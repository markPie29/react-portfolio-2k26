import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, ArrowRight, RotateCcw } from 'lucide-react';

interface SuccessProps {
  onReset: () => void;
  inquiryId?: string;
}

export const InquirySuccess: React.FC<SuccessProps> = ({ onReset, inquiryId }) => {
  const discoveryCallUrl =
    import.meta.env.VITE_DISCOVERY_CALL_URL ||
    'https://cal.com';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-8 px-4 text-center space-y-6 max-w-lg mx-auto"
    >
      {/* Animated Check Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-20 h-20 bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto border-2 border-sky-500/30"
      >
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-2xl font-neutralfacebold text-gray-900 dark:text-white uppercase tracking-tight">
          Inquiry Submitted!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Thank you for reaching out. Your project inquiry has been delivered directly to my inbox. I will review your requirements and respond within 24 hours.
        </p>
        {inquiryId && (
          <p className="text-xs text-gray-400 font-mono pt-1">Reference ID: {inquiryId}</p>
        )}
      </div>

      {/* Discovery Call CTA Card */}
      <div className="p-6 bg-gradient-to-br from-sky-900/10 via-cyan-900/10 to-transparent border border-sky-500/20 rounded-2xl space-y-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500 text-white rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-neutralfacebold text-sm text-gray-900 dark:text-white">
              Schedule a Discovery Call
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Lock in a 1-on-1 video call to discuss your timeline, architecture & scope.
            </p>
          </div>
        </div>

        <a
          href={discoveryCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-neutralfacebold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 group cursor-pointer"
        >
          <span>Schedule Discovery Call</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Reset Form Option */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors cursor-pointer pt-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Submit another inquiry</span>
      </button>
    </motion.div>
  );
};
