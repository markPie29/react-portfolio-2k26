import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ScrollFloat from '../../components/ScrollFloat';
import SpotlightCard from './SpotlightCard';
import ProjectModal from './home/ProjectModal';
import { fetchProjects } from '../services/projectService';
import { projectsData } from '../data/projects';
import { ProjectItem } from '../types/content';
import { Search, X, ImageOff, ExternalLink, ArrowLeft } from 'lucide-react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiLaravel, 
  SiFirebase, 
  SiExpress, 
  SiSupabase, 
  SiUnity, 
  SiFigma, 
  SiFramer, 
  SiCanva
} from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from './CustomIcons';
import { Film, Video } from 'lucide-react';

const getTechIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('react')) return <SiReact className="text-[#61DAFB]" />;
  if (lower.includes('next')) return <SiNextdotjs className="text-white" />;
  if (lower.includes('tailwind')) return <SiTailwindcss className="text-[#38BDF8]" />;
  if (lower.includes('laravel')) return <SiLaravel className="text-[#FF2D20]" />;
  if (lower.includes('firebase')) return <SiFirebase className="text-[#FFCA28]" />;
  if (lower.includes('express')) return <SiExpress className="text-gray-300" />;
  if (lower.includes('supabase')) return <SiSupabase className="text-[#3ECF8E]" />;
  if (lower.includes('unity')) return <SiUnity className="text-white text-xs" />;
  if (lower.includes('figma')) return <SiFigma className="text-[#F24E1E]" />;
  if (lower.includes('framer')) return <SiFramer className="text-[#0055FF]" />;
  if (lower.includes('canva')) return <SiCanva className="text-[#00C4CC]" />;
  if (lower.includes('photoshop')) return <CustomPhotoshop className="w-3.5 h-3.5" />;
  if (lower.includes('illustrator')) return <CustomIllustrator className="w-3.5 h-3.5" />;
  if (lower.includes('capcut')) return <CustomCapcut className="w-3.5 h-3.5" />;
  if (lower.includes('premiere')) return <Film className="w-3.5 h-3.5 text-[#9999FF]" />;
  if (lower.includes('after effects')) return <Video className="w-3.5 h-3.5 text-[#9999FF]" />;
  return null;
};

const ProjectCardImage: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  if (!project.image || imageError) {
    return (
      <div className="w-full h-full bg-[#0d111a] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden border border-white/5">
        <div className="p-3 rounded-2xl bg-white/5 text-accent mb-2 border border-white/10 shadow-md">
          <ImageOff size={24} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-sans">
          Preview Coming Soon
        </span>
      </div>
    );
  }

  return (
    <>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-90 group-hover/card:opacity-100 filter grayscale group-hover/card:grayscale-0"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-neutralfacebold text-xs uppercase tracking-widest backdrop-blur-[2px]">
        <span>View Project</span>
        <ExternalLink size={14} className="text-accent" />
      </div>
    </>
  );
};

const FILTER_CATEGORIES = [
  'ALL',
  'GRAPHIC DESIGN',
  'VIDEO EDITING',
  'SOCIAL MEDIA MANAGEMENT',
  'SOFTWARE DEVELOPMENT',
];

interface ProjectsSectionProps {
  hideViewMore?: boolean;
  isProjectsPage?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isProjectsPage = true }) => {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(projectsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchProjects().then((data) => {
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    });
  }, []);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      // Category check
      const matchCategory =
        selectedCategory === 'ALL' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'GRAPHIC DESIGN' && project.category.toLowerCase().includes('graphic design'));

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchTitle = project.title.toLowerCase().includes(query);
      const matchCategoryText = project.category.toLowerCase().includes(query);
      const matchDesc = project.description.toLowerCase().includes(query);
      const matchTech = project.techStack.some((tech) => tech.toLowerCase().includes(query));

      return matchCategory && (matchTitle || matchCategoryText || matchDesc || matchTech);
    });
  }, [projectsList, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="relative z-10 pt-8 md:pt-12 pb-24 px-4 sm:px-6 md:px-12 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Header Navigation & Subtitle */}
        <div className="w-full flex flex-col items-center gap-2 mb-4 relative">
          {isProjectsPage && (
            <div className="self-start mb-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-[#080a0f] hover:bg-accent/10 hover:border-accent text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(72,202,228,0.08)]"
              >
                <ArrowLeft size={16} className="text-accent" />
                <span>Back to Home</span>
              </Link>
            </div>
          )}

          {/* ALL WORKS Label */}
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-accent/90 font-sans">
            ALL WORKS
          </span>

          {/* Headline DESIGNED, DEVELOPED, DEPLOYED */}
          <div className="mt-1 mb-4 w-full">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              textClassName="font-neutralfacebold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase !leading-tight text-center"
              containerClassName="text-center w-full justify-center !my-0"
            >
              {"DESIGNED, DEVELOPED, DEPLOYED"}
            </ScrollFloat>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8 relative px-2">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-5 text-gray-400 pointer-events-none" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH"
              className="w-full pl-13 pr-12 py-3.5 sm:py-4 rounded-full bg-[#0e121d]/90 border border-white/15 focus:border-accent focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-400 text-sm sm:text-base font-sans tracking-widest uppercase outline-none transition-all shadow-[0_4px_20px_0_rgba(0,0,0,0.4)] backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="w-full flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-12 max-w-5xl px-2">
          {FILTER_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 select-none cursor-pointer ${
                  isActive
                    ? 'text-[#080a0f] font-bold shadow-[0_0_20px_rgba(72,202,228,0.4)]'
                    : 'text-gray-300 hover:text-white bg-[#080a0f]/80 border border-white/10 hover:border-accent/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 gradient-bg rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Column Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                  className="group/card cursor-pointer h-full flex"
                >
                  <SpotlightCard
                    className="flex flex-col justify-between rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 w-full border border-white/10 hover:border-accent/50 bg-[#090c13]"
                    spotlightColor="rgba(72, 202, 228, 0.12)"
                  >
                    <div className="flex flex-col w-full h-full">
                      
                      {/* Project Thumbnail */}
                      <div className="w-full aspect-[16/10] bg-[#05070c] rounded-2xl relative overflow-hidden mb-5 border border-white/5 flex items-center justify-center">
                        <ProjectCardImage project={project} />
                      </div>

                      {/* Category Subtitle */}
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-accent mb-1.5 block font-sans">
                        {project.category}
                      </span>

                      {/* Project Title */}
                      <h3 className="font-neutralfacebold text-lg sm:text-xl text-white uppercase tracking-wide leading-snug mb-2 group-hover/card:text-accent transition-colors">
                        {project.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {project.techStack.map((tech, tIdx) => {
                          const icon = getTechIcon(tech);
                          return (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300"
                            >
                              {icon && <span className="text-xs">{icon}</span>}
                              <span>{tech}</span>
                            </span>
                          );
                        })}
                      </div>

                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-[#090c13] rounded-3xl border border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 text-gray-400 mb-4 border border-white/10">
              <Search size={32} />
            </div>
            <h3 className="font-neutralfacebold text-xl uppercase tracking-wide text-white mb-2">
              No Projects Found
            </h3>
            <p className="text-sm text-gray-400 max-w-md mb-6 font-sans">
              We couldn't find any projects matching "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-6 py-2.5 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Interactive Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;
