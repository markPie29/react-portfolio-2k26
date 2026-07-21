import React from 'react';
import { motion } from 'motion/react';
import { socialsData } from '../../data/socials';
import SplitText from '../../../components/SplitText';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Name, Socials, Resume */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center z-10">
          {/* Main Display Heading */}
          <div className="mb-6">
            <h1 className="font-neutralfacebold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] leading-[0.95] tracking-tight uppercase">
              <span className="block text-current">MARKY</span>
              <span className="block text-current">ISULAT</span>
            </h1>
          </div>

          {/* Social Tag Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-2.5 sm:gap-3 mb-8"
          >
            {socialsData.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm flex items-center gap-2"
              >
                <i className={s.iconClass}></i>
                <span>{s.label}</span>
              </a>
            ))}
          </motion.div>

          {/* Resume Download Pill Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="/Mark_Angelo_Isulat_Final_Resume.pdf"
              download
              className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg inline-flex items-center gap-3"
            >
              <span>RESUME</span>
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
          </motion.div>
        </div>

        {/* Right Column - Hero Image Placeholder / Profile Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-gray-300 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group"
          >
            <img
              src="/avatar.png"
              alt="Marky Isulat Profile"
              className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700"
              onError={(e) => {
                // Fallback to stylized box if avatar image unavailable
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
