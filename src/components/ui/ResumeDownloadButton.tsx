import React, { useState } from 'react';
import { ResumeModal } from './ResumeModal';

interface ResumeDownloadButtonProps {
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  className = "gradient-bg text-white hover:brightness-110 px-5 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-sky-500/25 inline-flex items-center gap-2 sm:gap-3",
  label = "DOWNLOAD CV",
  showIcon = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        <span>{label}</span>
        {showIcon && (
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
        )}
      </button>

      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
