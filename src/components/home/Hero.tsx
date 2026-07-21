import React from 'react';
import { motion } from 'motion/react';
import { socialsData } from '../../data/socials';
import SplitText from '../../../components/SplitText';
import TextType from '../../../components/TextType';
import BlurText from '../../../components/BlurText';
import TiltedCard from '../../../components/TiltedCard';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Name, Dynamic Subtitle, Socials, Resume */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center z-10">
          {/* SplitText Display Name */}
          <div className="mb-4">
            <SplitText
              text="MARKY"
              className="font-neutralfacebold text-5xl sm:text-7xl md:text-8xl lg:text-[95px] leading-[0.95] tracking-tight uppercase block"
              delay={40}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
            />
            <SplitText
              text="ISULAT"
              className="font-neutralfacebold text-5xl sm:text-7xl md:text-8xl lg:text-[95px] leading-[0.95] tracking-tight uppercase block"
              delay={40}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
            />
          </div>

          {/* TextType Rotating Subtitle */}
          <div className="mb-6 h-8 flex items-center">
            <TextType
              text={["Software Engineer", "UI/UX Designer", "Multimedia Specialist"]}
              typingSpeed={80}
              pauseDuration={1800}
              showCursor
              cursorCharacter="_"
              deletingSpeed={40}
              className="text-base sm:text-xl font-helvetica-neue-medium text-accent uppercase tracking-wider"
            />
          </div>

          {/* BlurText Social Tag Pills */}
          <div className="mb-8 w-full">
            <BlurText
              text={socialsData.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm inline-flex items-center gap-2"
                >
                  <i className={s.iconClass}></i>
                  <span>{s.label}</span>
                </a>
              ))}
              delay={100}
              animateBy="words"
              className="flex flex-wrap gap-2.5 sm:gap-3"
            />
          </div>

          {/* Resume Download Pill Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Right Column - Hero Profile Image with TiltedCard ReactBits effect */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <TiltedCard
              imageSrc="/avatar.png"
              altText="Marky Isulat Profile"
              containerHeight="440px"
              containerWidth="100%"
              imageHeight="440px"
              imageWidth="100%"
              rotateAmplitude={10}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
