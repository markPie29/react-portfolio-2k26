import React from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';
import LogoLoop, { LogoItem } from '../LogoLoop';
import TiltedCard from '../../../components/TiltedCard';
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiLaravel,
  SiFirebase,
  SiSupabase,
  SiCanva,
  SiFigma,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiFramer,
  SiMysql,
  SiUnity,
  SiPython,
  SiPhp,
  SiGit,
  SiGithub,
  SiDocker,
  SiShadcnui,
} from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from '../CustomIcons';

const techLogos: LogoItem[] = [
  { node: <SiReact />, title: 'React' },
  { node: <SiNextdotjs />, title: 'Next.js' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS' },
  { node: <SiTypescript />, title: 'TypeScript' },
  { node: <SiJavascript />, title: 'JavaScript' },
  { node: <SiExpress />, title: 'Express' },
  { node: <SiLaravel />, title: 'Laravel' },
  { node: <SiFirebase />, title: 'Firebase' },
  { node: <SiSupabase />, title: 'Supabase' },
  { node: <CustomPhotoshop />, title: 'Adobe Photoshop' },
  { node: <CustomIllustrator />, title: 'Adobe Illustrator' },
  { node: <SiCanva />, title: 'Canva' },
  { node: <SiFigma />, title: 'Figma' },
  { node: <CustomCapcut />, title: 'CapCut' },
  { node: <SiShadcnui />, title: 'Shadcn UI' },
  { node: <SiFramer />, title: 'Framer Motion' },
  { node: <SiMysql />, title: 'MySQL' },
  { node: <SiUnity />, title: 'Unity' },
  { node: <SiPython />, title: 'Python' },
  { node: <SiPhp />, title: 'PHP' },
  { node: <SiGit />, title: 'Git' },
  { node: <SiGithub />, title: 'GitHub' },
  { node: <SiDocker />, title: 'Docker' },
  { node: <SiHtml5 />, title: 'HTML5' },
  { node: <SiCss />, title: 'CSS3' },
];

const AboutHeroHeader: React.FC = () => {
  return (
    <section id="about" className="relative pt-24 pb-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
        {/* Left Column: Stacked Headline, Subtext, & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col items-start gap-6 text-left"
        >
          {/* Main Display Headline (Stacked DESIGN, DEVELOP, DEPLOY) */}
          <div className="w-full">
            <GradientText
              colors={['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef']}
              animationSpeed={6}
              showBorder={false}
              className="!mx-0 font-neutralfacebold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none text-left"
            >
              <div className="flex flex-col items-start gap-1 sm:gap-2">
                <span>DESIGN</span>
                <span>DEVELOP</span>
                <span>DEPLOY</span>
              </div>
            </GradientText>
          </div>

          {/* Intro Bio Subtext */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl lg:max-w-2xl text-left font-sans">
            My name is Mark Angelo A. Isulat, but people call me Marky. I started as a simple tech enthusiast as a kid, which led me to begin learning programming at the age of 16 and enter the design world at 18. Currently a 4th-year student in BS Computer Engineering and a DOST Scholar, I have worked with different brands and businesses both locally and internationally.
          </p>

          {/* Action Buttons: DOWNLOAD CV & WORKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 pt-2"
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
        </motion.div>

        {/* Right Column: Profile Image Showcase (Avatar with TiltedCard ReactBits effect) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 w-full flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md">
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
          </div>
        </motion.div>
      </div>

      {/* Logo Loop Marquee Ticker Strip - Full Bleed */}
      <div className="w-full py-4 bg-slate-100/60 dark:bg-white/[0.03] border-y border-slate-200 dark:border-white/10 overflow-hidden backdrop-blur-sm shadow-inner">
        <LogoLoop
          logos={techLogos}
          speed={50}
          direction="left"
          logoHeight={34}
          gap={48}
          fadeOut={true}
          pauseOnHover={true}
          scaleOnHover={true}
          ariaLabel="Tech & design stack logo loop"
        />
      </div>
    </section>
  );
};

export default AboutHeroHeader;
