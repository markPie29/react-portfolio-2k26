import React from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';
import TaglineStrip from '../home/TaglineStrip';

const AboutHeroHeader: React.FC = () => {
  return (
    <section id="about" className="relative pt-24 pb-8 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="max-w-5xl mx-auto w-full px-6 md:px-12 flex flex-col items-center gap-6 mb-8">
        {/* Main Display Headline */}
        <div className="w-full max-w-4xl">
          <GradientText
            colors={['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef']}
            animationSpeed={6}
            showBorder={false}
            className="font-neutralfacebold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-center"
          >
            DESIGN, DEVELOP, DEPLOY
          </GradientText>
        </div>

        {/* Action Buttons: DOWNLOAD CV & WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2"
        >
          {/* DOWNLOAD CV Button */}
          <a
            href="/Mark_Angelo_Isulat_Final_Resume.pdf"
            download
            className="gradient-bg text-white hover:brightness-110 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-sky-500/25 inline-flex items-center gap-3"
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

      {/* Marquee Ticker Strip Ribbon - Full Bleed */}
      <div className="w-full">
        <TaglineStrip direction="left" speed={40} />
      </div>
    </section>
  );
};

export default AboutHeroHeader;
