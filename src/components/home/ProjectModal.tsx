import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ProjectItem } from '../../types/content';
import { X, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { SiGithub } from 'react-icons/si';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Motion scroll progress tracking using useMotionValue and useSpring
  const scrollProgress = useMotionValue(0);

  const scaleX = useSpring(scrollProgress, {
    stiffness: 250,
    damping: 28,
    restDelta: 0.001,
  });

  const updateScrollProgress = useCallback(() => {
    const el = modalContainerRef.current;
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

  // Track scroll position & observe height changes dynamically
  useEffect(() => {
    const el = modalContainerRef.current;
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

  // Reset image index & scroll position when modal opens with a new project
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTop = 0;
      }
      scrollProgress.set(0);
      // Set focus to close button for proper screen focus alignment & accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [project, scrollProgress]);

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

  const imagesList = project?.images && project.images.length > 0
    ? project.images
    : project?.image
    ? [project.image]
    : [];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <AnimatePresence>
      {project && (
        <div
          key="project-modal-backdrop-wrapper"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden pointer-events-auto"
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

          {/* Modal Window Container */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="relative z-10 w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] my-auto bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col text-gray-900 dark:text-white outline-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (Fixed at top of modal frame) */}
            <div className="relative p-5 sm:p-7 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md flex-shrink-0 z-20 rounded-t-3xl">
              {/* Brand Blue Gradient Scroll Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-white/10 overflow-hidden z-30 rounded-t-3xl">
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] origin-left shadow-[0_0_12px_rgba(72,202,228,0.7)]"
                  style={{ scaleX, transformOrigin: 'left' }}
                />
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-1 block">
                  {project.category}
                </span>
                <h2 id="modal-project-title" className="font-neutralfacebold text-xl sm:text-2xl md:text-3xl uppercase tracking-wide leading-tight">
                  {project.title}
                </h2>
                {project.role && (
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
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

            {/* Modal Content Scrollable Body (Dedicated scroll container) */}
            <div
              ref={modalContainerRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              tabIndex={0}
              className="flex-1 overflow-y-auto overscroll-contain modal-scrollbar p-5 sm:p-8 flex flex-col gap-8 outline-none"
            >
              {/* Image Carousel Section */}
              {imagesList.length > 0 && (
                <div className="flex flex-col gap-3">
                  {/* Main Carousel Display Box */}
                  <div className="relative w-full aspect-[16/9] max-h-[380px] sm:max-h-[440px] bg-slate-900 rounded-2xl overflow-hidden group shadow-inner border border-slate-200/50 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={imagesList[currentImageIndex]}
                        alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </AnimatePresence>

                    {/* Previous / Next Arrow Controls */}
                    {imagesList.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Index Counter Badge */}
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 text-white text-xs font-bold tracking-wider backdrop-blur-md">
                          {currentImageIndex + 1} / {imagesList.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails Navigation */}
                  {imagesList.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 modal-scrollbar">
                      {imagesList.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                            idx === currentImageIndex
                              ? 'border-accent shadow-md scale-105'
                              : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Details */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Project Overview
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Key Features List */}
                {project.features && project.features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Key Features & Highlights
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
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

                {/* External Links / Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
                    >
                      <span>Live Preview</span>
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <SiGithub size={15} />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
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
