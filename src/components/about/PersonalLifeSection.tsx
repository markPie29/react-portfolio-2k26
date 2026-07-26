import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, ExternalLink, Sparkles, Heart } from 'lucide-react';
import { FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';
import Stack from '../ui/Stack';

const personalImages = [
  '/personals/6280409722531812042.jpg',
  '/personals/6280409722531812043.jpg',
  '/personals/6280409722531812044.jpg',
  '/personals/6280409722531812045.jpg',
  '/personals/6280409722531812046.jpg',
  '/personals/6280409722531812047.jpg',
  '/personals/6280409722531812048.jpg',
  '/personals/6280409722531812049.jpg',
  '/personals/6280409722531812050.jpg',
  '/personals/6280409722531812051.jpg',
  '/personals/6280409722531812052.jpg',
];

const socials = [
  {
    platform: 'TikTok',
    handle: '@_markpie29 • marky_write on ig💻',
    statsPrimary: '1,400+ Followers',
    statsSecondary: '133K+ Likes',
    url: 'https://www.tiktok.com/@_markpie29',
    icon: FaTiktok,
  },
  {
    platform: 'TikTok',
    handle: '@markdmedia • Marked Media - Mark Isulat',
    statsPrimary: '1,200+ Followers',
    statsSecondary: '28K+ Likes',
    url: 'https://www.tiktok.com/@markdmedia',
    icon: FaTiktok,
  },
  {
    platform: 'Instagram',
    handle: '@marky_write',
    statsPrimary: '200+ Followers',
    statsSecondary: '11 Posts',
    url: 'https://www.instagram.com/marky_write/',
    icon: FaInstagram,
  },
  {
    platform: 'YouTube',
    handle: '@djmarkpie • DJ markPie',
    statsPrimary: '900+ Subscribers',
    statsSecondary: '110K+ Views',
    url: 'https://www.youtube.com/@djmarkpie',
    icon: FaYoutube,
  },
];

const hobbies = [
  { emoji: '💪', label: 'gym' },
  { emoji: '🏀', label: 'basketball' },
  { emoji: '🏐', label: 'volleyball' },
  { emoji: '🎮', label: 'gaming (single player or coop w my baby)' },
  { emoji: '🍳', label: 'cooking' },
  { emoji: '🎥', label: 'content creation' },
  { emoji: '🎧', label: 'DJ' },
  { emoji: '🍿', label: 'watching movies and shows' },
];

const PersonalLifeSection: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const stackCards = personalImages.map((src, i) => (
    <div
      key={i}
      className="w-full h-full rounded-2xl overflow-hidden border-2 border-accent/50 dark:border-[#48cae4]/50 shadow-lg shadow-accent/10 p-0.5 bg-slate-900/30"
    >
      <img
        src={src}
        alt={`Personal moment ${i + 1}`}
        className="w-full h-full object-cover select-none pointer-events-none rounded-[14px]"
      />
    </div>
  ));

  return (
    <section id="personal-life" className="py-8 md:py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* FROSTED GLASS COVER CONTAINER */
            <motion.div
              key="locked-cover"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={() => setIsUnlocked(true)}
              className="relative cursor-pointer group rounded-3xl overflow-hidden p-0.5 bg-slate-200 dark:bg-white/10 hover:border-accent transition-all duration-500 shadow-xl dark:shadow-2xl"
            >
              {/* Glowing Background Mesh on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0077b6]/20 via-[#00b4d8]/20 to-[#48cae4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

              <div className="relative rounded-[23px] bg-white/90 dark:bg-[#04060a] backdrop-blur-md p-10 sm:p-14 text-center flex flex-col items-center justify-center border border-slate-200 dark:border-[#48cae4]/20 group-hover:border-accent/50 transition-all duration-500">
                {/* Padlock Badge */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-accent/30 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                    <Lock className="w-9 h-9 text-accent group-hover:text-[#90e0ef] transition-colors duration-300" />
                  </div>
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 mb-3">
                  CLASSIFIED VAULT
                </span>

                <h3 className="font-neutralfacebold text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2 uppercase tracking-wide group-hover:text-accent transition-colors">
                  CLICK TO UNLOCK MY PERSONAL SIDE
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mb-8 font-sans">
                  Explore my TikTok channels, YouTube content, Instagram updates, hobbies, and photo memory stack.
                </p>

                {/* Reveal Button Callout */}
                <div className="gradient-bg text-white hover:brightness-110 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg shadow-sky-500/25 inline-flex items-center gap-3">
                  <Unlock className="w-4 h-4" />
                  <span>ENTER DIMENSION</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* REVEALED CONTENT CONTAINER */
            <motion.div
              key="unlocked-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/90 dark:bg-[#04060a] backdrop-blur-md border border-slate-200 dark:border-[#48cae4]/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl dark:shadow-2xl"
            >
              {/* Header Bar matching Reference Wireframe */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5 mb-8">
                {/* Reference style Header Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-[#00b4d8] text-xs font-bold uppercase tracking-wider border border-[#00b4d8]/30 shadow-md">
                  <span>SOCIAL MEDIA & CONTENT</span>
                  <Heart className="w-3.5 h-3.5 fill-[#00b4d8] text-[#00b4d8]" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                    <Unlock className="w-4 h-4 text-accent" />
                    <span>Status: Dimension Unlocked</span>
                  </div>
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-accent cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Vault</span>
                  </button>
                </div>
              </div>

              {/* TOP SECTION: 2x2 Social Media Cards Grid (Matching Wireframe) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {socials.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/card bg-slate-100/90 dark:bg-[#080c14] border border-slate-200 dark:border-white/10 hover:border-accent rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md hover:shadow-accent/10"
                    >
                      {/* Top Row: Icon + Platform & External Link */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <Icon className="w-4 h-4 text-accent" />
                          <span>{social.platform}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover/card:text-accent transition-colors" />
                      </div>

                      {/* Middle Main Row: Followers & Likes HIGHLIGHTED */}
                      <div className="my-1">
                        <div className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 dark:text-white group-hover/card:text-accent transition-colors flex items-center flex-wrap gap-x-2 gap-y-1">
                          <span className="text-accent">{social.statsPrimary}</span>
                          <span className="text-slate-400 font-normal text-xs sm:text-sm">•</span>
                          <span className="text-gray-900 dark:text-slate-100">{social.statsSecondary}</span>
                        </div>
                      </div>

                      {/* Bottom Row: Account handle (Secondary info) */}
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        {social.handle}
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* BOTTOM SECTION: Hobbies (Left) & Photo Stack (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* LEFT: Hobbies & Interests Section */}
                <div className="lg:col-span-7 flex flex-col justify-start py-2">
                  <h3 className="font-neutralfacebold text-lg md:text-xl tracking-wider text-accent uppercase mb-6 flex items-center gap-2">
                    <span>HOBBIES & INTERESTS</span>
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {hobbies.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-accent px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm cursor-default"
                      >
                        <span className="text-base leading-none">{item.emoji}</span>
                        <span>{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Photo Stack Memory Shuffle */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[380px] py-2">
                  <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] aspect-square relative">
                    <Stack
                      randomRotation
                      sensitivity={100}
                      sendToBackOnClick={true}
                      cards={stackCards}
                      autoplay={true}
                      autoplayDelay={1000}
                      pauseOnHover={true}
                    />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Click or drag stack to shuffle memory cards</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PersonalLifeSection;

