import React from 'react';
import { motion } from 'motion/react';
import { socialsData } from '../../data/socials';
import SplitText from '../../../components/SplitText';
import TextType from '../../../components/TextType';
import BlurText from '../../../components/BlurText';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center z-10">
        {/* BlurText Social Tag Pills (Centered above name) */}
        <div className="mb-6 w-full flex justify-center">
          <BlurText
            text={socialsData.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-200 hover-gradient-blue shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <i className={s.iconClass}></i>
                <span>{s.label}</span>
              </a>
            ))}
            delay={100}
            animateBy="words"
            className="flex flex-wrap justify-center gap-2.5 sm:gap-3"
          />
        </div>

        {/* SplitText Display Name (Centered, Single Line) */}
        <div className="mb-4 w-full flex justify-center text-center overflow-visible">
          <SplitText
            text="MARKY ISULAT"
            className="font-neutralfacebold text-2xl sm:text-4xl md:text-6xl lg:text-[75px] xl:text-[85px] leading-[0.95] tracking-tight uppercase whitespace-nowrap inline-block"
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
        </div>

        {/* TextType Rotating Subtitle (Centered) */}
        <div className="mb-8 h-8 flex items-center justify-center text-center">
          <TextType
            text={["Software Engineer", "Multimedia Designer", "Tech Enthusiast"]}
            typingSpeed={80}
            pauseDuration={1800}
            showCursor
            cursorCharacter="_"
            deletingSpeed={40}
            className="text-base sm:text-xl font-helvetica-neue-medium text-accent uppercase tracking-wider"
          />
        </div>

        {/* Download CV Pill Button (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <a
            href="/Mark_Angelo_Isulat_Final_Resume.pdf"
            download
            className="gradient-bg text-white hover:brightness-110 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-sky-500/25 inline-flex items-center gap-3"
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
