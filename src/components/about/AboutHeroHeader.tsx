import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';
import TaglineStrip from '../home/TaglineStrip';
import { useTheme } from '../../context/ThemeContext';

const DAY_TIME = 3.0; // Day scene starting timestamp in seconds
const SPEED_MULTIPLIER = 2.0; // 2x faster transition speed

const AboutHeroHeader: React.FC = () => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevThemeRef = useRef<string>(theme);
  const animFrameRef = useRef<number | null>(null);
  const isLoadedRef = useRef<boolean>(false);

  const handleLoadedMetadata = () => {
    isLoadedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = SPEED_MULTIPLIER;

    if (theme === 'light') {
      video.currentTime = DAY_TIME;
    } else {
      video.currentTime = video.duration ? Math.max(0, video.duration - 0.1) : 0;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const isThemeChanged = prevThemeRef.current !== theme;

    if (isThemeChanged) {
      if (theme === 'dark') {
        // Transition: Day -> Night (Play forward faster from 3.0s to end of video)
        video.currentTime = DAY_TIME;
        video.playbackRate = SPEED_MULTIPLIER;
        video.play().catch(() => {});

        const stepForward = () => {
          const maxDur = video.duration ? video.duration - 0.1 : DAY_TIME + 2;
          if (video.currentTime >= maxDur || video.paused) {
            video.pause();
            if (video.duration) {
              video.currentTime = Math.max(0, video.duration - 0.1);
            }
          } else {
            animFrameRef.current = requestAnimationFrame(stepForward);
          }
        };
        animFrameRef.current = requestAnimationFrame(stepForward);
      } else {
        // Transition: Night -> Day (Reverse playback faster from Night down to 3.0s)
        video.pause();

        if (video.currentTime <= DAY_TIME && video.duration) {
          video.currentTime = Math.max(0, video.duration - 0.1);
        }

        let lastTime = performance.now();
        const stepReverse = (now: number) => {
          const dt = ((now - lastTime) / 1000) * SPEED_MULTIPLIER;
          lastTime = now;

          if (video.currentTime <= DAY_TIME) {
            video.currentTime = DAY_TIME;
          } else {
            video.currentTime = Math.max(DAY_TIME, video.currentTime - dt);
            animFrameRef.current = requestAnimationFrame(stepReverse);
          }
        };
        animFrameRef.current = requestAnimationFrame(stepReverse);
      }
    } else if (isLoadedRef.current) {
      video.pause();
      if (theme === 'light') {
        video.currentTime = DAY_TIME;
      } else if (video.duration) {
        video.currentTime = Math.max(0, video.duration - 0.1);
      }
    }

    prevThemeRef.current = theme;

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [theme]);

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

        {/* Right Column: Hero Video Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 w-full flex justify-center lg:justify-end"
        >
          <div className="relative group max-w-md w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-sky-500/10 bg-slate-100 dark:bg-slate-900/60">
            <video
              ref={videoRef}
              src="/about-me-transition.mp4"
              muted
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle interactive hover highlight */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-sky-500/0 group-hover:border-sky-500/30 transition-colors duration-500 pointer-events-none" />
          </div>
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


