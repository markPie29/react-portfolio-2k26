import React from 'react';
import { motion } from 'motion/react';
import SplitText from '../../../components/SplitText';
import TaglineStrip from '../home/TaglineStrip';

const AboutHeroHeader: React.FC = () => {
  return (
    <section id="about" className="relative pt-32 pb-12 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-8 mb-12">
        {/* Main Display Headline */}
        <div className="w-full max-w-4xl">
          <SplitText
            text="CREATING DIGITAL EXPERIENCES AS A DEVELOPER AND DESIGNER"
            className="font-neutralfacebold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-gray-900 dark:text-white"
            delay={30}
            duration={0.7}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 25 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
        </div>

        {/* Action Buttons: RESUME & WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2"
        >
          {/* RESUME / DOWNLOAD CV Button */}
          <a
            href="/Mark_Angelo_Isulat_Final_Resume.pdf"
            download
            className="px-8 py-3.5 rounded-full font-neutralfacebold text-xs sm:text-sm uppercase tracking-widest text-white gradient-bg hover:brightness-110 shadow-lg shadow-sky-500/25 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>

          {/* WORKS Button */}
          <a
            href="/projects"
            className="px-8 py-3.5 rounded-full font-neutralfacebold text-xs sm:text-sm uppercase tracking-widest bg-slate-900 text-white dark:bg-white/10 dark:text-white border border-slate-700 dark:border-white/20 hover:border-accent hover:text-accent transition-all duration-300 transform hover:-translate-y-1 shadow-md inline-flex items-center gap-2"
          >
            <span>WORKS</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Marquee Ticker Strip Ribbon */}
      <div className="w-full">
        <TaglineStrip direction="left" speed={40} />
      </div>
    </section>
  );
};

export default AboutHeroHeader;
