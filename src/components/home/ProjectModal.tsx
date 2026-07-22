import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ProjectItem } from '../../types/content';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  ImageOff,
  Film,
  Play
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  );
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalDetailsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Motion scroll progress tracking using useMotionValue and useSpring
  const scrollProgress = useMotionValue(0);

  const scaleX = useSpring(scrollProgress, {
    stiffness: 250,
    damping: 28,
    restDelta: 0.001,
  });

  const updateScrollProgress = useCallback(() => {
    const el = modalDetailsRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      scrollProgress.set(0);
    } else {
      const progress = Math.min(Math.max(el.scrollTop / maxScroll, 0), 1);
      scrollProgress.set(progress);
    }
  }, [scrollProgress]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Construct unified media list (images & videos)
  const mediaList: MediaItem[] = React.useMemo(() => {
    if (!project) return [];
    const items: MediaItem[] = [];

    // Add explicit videoUrl if present
    if (project.videoUrl) {
      items.push({ type: 'video', url: project.videoUrl });
    }

    // Extract images & detect video paths
    const rawImages = project.images && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : [];

    rawImages.forEach((url) => {
      if (url && !items.some((item) => item.url === url)) {
        if (isVideoUrl(url)) {
          items.push({ type: 'video', url });
        } else {
          items.push({ type: 'image', url });
        }
      }
    });

    return items;
  }, [project]);

  // Track scroll position & observe height changes dynamically
  useEffect(() => {
    const el = modalDetailsRef.current;
    if (!el || !project) return;

    updateScrollProgress();
    el.addEventListener('scroll', updateScrollProgress, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollProgress();
    });
    resizeObserver.observe(el);
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', updateScrollProgress);
      resizeObserver.disconnect();
    };
  }, [project, updateScrollProgress]);

  // Reset index & scroll position when modal opens with a new project
  useEffect(() => {
    if (project) {
      setCurrentMediaIndex(0);
      setMediaError(false);
      if (modalDetailsRef.current) {
        modalDetailsRef.current.scrollTop = 0;
      }
      scrollProgress.set(0);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [project, scrollProgress]);

  useEffect(() => {
    setMediaError(false);
  }, [currentMediaIndex]);

  // Lock background scrolling (both standard body scroll and Lenis smooth scroll) + ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!mounted) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = mediaList[currentMediaIndex];

  return createPortal(
    <AnimatePresence>
      {project && (
        <div
          key="project-modal-backdrop-wrapper"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden pointer-events-auto"
        >
          {/* Backdrop overlay focused on modal */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Window Container (Landscape Widescreen Split Layout) */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="relative z-10 w-full max-w-6xl h-[88vh] sm:h-[90vh] my-auto bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col text-gray-900 dark:text-white outline-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (Fixed at top of modal frame) */}
            <div className="relative px-6 py-4.5 sm:px-8 sm:py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md flex-shrink-0 z-20 rounded-t-3xl">
              {/* Brand Blue Gradient Scroll Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-white/10 overflow-hidden z-30 rounded-t-3xl">
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] origin-left shadow-[0_0_12px_rgba(72,202,228,0.7)]"
                  style={{ scaleX, transformOrigin: 'left' }}
                />
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">
                  {project.category}
                </span>
                <h2 id="modal-project-title" className="font-neutralfacebold text-lg sm:text-xl md:text-2xl uppercase tracking-wide leading-tight">
                  {project.title}
                </h2>
                {project.role && (
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    Role: <span className="text-gray-700 dark:text-gray-300">{project.role}</span>
                  </p>
                )}
              </div>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split View Container (Left: Media, Right: General Details) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/10">
              
              {/* LEFT COLUMN: Media Section (Images & Videos with full aspect preservation) */}
              <div className="lg:col-span-7 flex flex-col p-4 sm:p-6 bg-slate-950/90 dark:bg-[#06080e] min-h-[350px] lg:min-h-0 justify-between overflow-hidden relative">
                
                {/* Main Media Viewer Stage */}
                <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[320px] lg:min-h-0 bg-black/90 rounded-2xl border border-slate-800 dark:border-white/10 overflow-hidden flex items-center justify-center group shadow-2xl">
                  
                  {mediaList.length > 0 && !mediaError && currentMedia ? (
                    <>
                      {/* Ambient background glow for contained media */}
                      {currentMedia.type === 'image' && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-2xl scale-110 pointer-events-none transition-all duration-700"
                          style={{ backgroundImage: `url(${currentMedia.url})` }}
                        />
                      )}

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentMediaIndex}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full h-full flex items-center justify-center p-2 relative z-10"
                        >
                          {currentMedia.type === 'video' ? (
                            <video
                              src={currentMedia.url}
                              controls
                              autoPlay
                              muted
                              loop
                              className="w-full h-full max-h-full max-w-full object-contain rounded-lg shadow-xl"
                              onError={() => setMediaError(true)}
                            />
                          ) : (
                            <img
                              src={currentMedia.url}
                              alt={`${project.title} asset ${currentMediaIndex + 1}`}
                              className="w-full h-full max-h-full max-w-full object-contain rounded-lg shadow-xl"
                              onError={() => setMediaError(true)}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Arrow Controls */}
                      {mediaList.length > 1 && (
                        <>
                          <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/10"
                            aria-label="Previous asset"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/10"
                            aria-label="Next asset"
                          >
                            <ChevronRight size={20} />
                          </button>

                          {/* Media Counter / Indicator Badge */}
                          <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-white text-xs font-bold tracking-wider backdrop-blur-md flex items-center gap-1.5">
                            {currentMedia.type === 'video' && <Film size={12} className="text-accent" />}
                            <span>
                              {currentMediaIndex + 1} / {mediaList.length}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Fallback when no media assets available or error loading */
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="mb-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-accent">
                        <ImageOff size={32} />
                      </div>
                      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 mb-2">
                        No Preview Available
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-gray-400 max-w-xs leading-relaxed">
                        Visual assets for this project are currently unavailable.
                      </p>
                    </div>
                  )}
                </div>

                {/* Thumbnails Navigation Strip */}
                {mediaList.length > 1 && !mediaError && (
                  <div className="flex items-center gap-3 overflow-x-auto pt-4 pb-1 modal-scrollbar">
                    {mediaList.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        className={`relative w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer bg-black ${
                          idx === currentMediaIndex
                            ? 'border-accent shadow-md scale-105 ring-2 ring-accent/30'
                            : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                            <Film size={18} className="text-white z-10" />
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                              <Play size={12} className="text-white fill-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => {}}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: General Details Panel (Scrollable content) */}
              <div
                ref={modalDetailsRef}
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                tabIndex={0}
                className="lg:col-span-5 flex flex-col p-6 sm:p-8 overflow-y-auto overscroll-contain modal-scrollbar bg-white dark:bg-[#0c0f17] gap-6 outline-none"
              >
                {/* Project Overview */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                    Project Overview
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Key Features & Highlights */}
                {project.features && project.features.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                      Key Features & Highlights
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {project.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2.5 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/60 dark:border-white/5"
                        >
                          <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Used Badges */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                      Technologies & Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-slate-200 dark:border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Links / Buttons */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex flex-wrap items-center gap-3 pt-5 mt-auto border-t border-slate-200 dark:border-white/10">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
                      >
                        <span>Live Preview</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <SiGithub size={14} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
