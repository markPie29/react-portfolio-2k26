import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RESUME_OPTIONS, ResumeOption } from '../../data/resumes';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#080A0F] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-cyan-500/20 z-[100000] my-auto text-white overflow-hidden"
          >
            {/* Background Glow Orbs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all duration-200 z-20 group"
            >
              <i className="bx bx-x text-2xl group-hover:scale-110 transition-transform" />
            </button>

            {/* Modal Header */}
            <div className="text-center max-w-lg mx-auto mb-8 sm:mb-9">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/20 text-accent mb-3">
                <i className="bx bx-download text-sm" />
                Select Resume Variant
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Which CV version do you need?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose the targeted resume matching your hiring focus for full skills alignment.
              </p>
            </div>

            {/* Resume Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {RESUME_OPTIONS.map((option: ResumeOption) => (
                <div
                  key={option.id}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  {/* Role Icon & Title Header */}
                  <div className="flex items-start gap-3.5 mb-2">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-2xl text-accent shrink-0">
                      <i className={`bx ${option.icon}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight">
                        {option.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {option.roleSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Official Branding Download Button */}
                  <a
                    href={option.filePath}
                    download={option.fileName}
                    onClick={onClose}
                    className="gradient-bg text-white hover:brightness-110 shadow-lg shadow-sky-500/25 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 w-full mt-6"
                  >
                    <span>DOWNLOAD CV</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Bottom Note */}
            <div className="mt-7 text-center text-[11px] text-slate-500">
              Need custom portfolio details or references? Feel free to reach out directly via the contact form.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
