import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ScrollFloat from '../../components/ScrollFloat';
import ProjectModal from './home/ProjectModal';
import ProjectCard from './ProjectCard';
import { fetchProjects } from '../services/projectService';
import { projectsData } from '../data/projects';
import { ProjectItem } from '../types/content';
import { getProjectCategories, projectMatchesCategory, PROJECT_CATEGORIES } from '../utils/categoryFilter';
import { Search, X, ArrowLeft, ChevronDown, Check } from 'lucide-react';

const FILTER_CATEGORIES = ['ALL', ...PROJECT_CATEGORIES.map((c) => c.toUpperCase())];

interface ProjectsSectionProps {
  hideViewMore?: boolean;
  isProjectsPage?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isProjectsPage = true }) => {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(projectsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      const lower = categoryParam.toLowerCase().replace(/[-_]+/g, ' ');
      if (lower.includes('graphic')) {
        setSelectedCategory('GRAPHIC DESIGN');
      } else if (lower.includes('software')) {
        setSelectedCategory('SOFTWARE DEVELOPMENT');
      } else if (lower.includes('social') || lower.includes('media')) {
        setSelectedCategory('SOCIAL MEDIA MANAGEMENT');
      } else if (lower === 'all') {
        setSelectedCategory('ALL');
      }
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      const projectCats = getProjectCategories(project);

      // Category check
      const matchCategory = projectMatchesCategory(project, selectedCategory);

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchTitle = project.title.toLowerCase().includes(query);
      const matchCategoryText = projectCats.some((cat) => cat.toLowerCase().includes(query));
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
            <div className="self-start mb-2 hidden md:block">
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
            {/* Desktop View */}
            <div className="hidden md:block">
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
            {/* Mobile View */}
            <div className="md:hidden flex flex-col items-center gap-1">
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                textClassName="font-neutralfacebold text-3xl text-white tracking-tight uppercase !leading-tight text-center"
                containerClassName="text-center w-full justify-center !my-0"
              >
                {"DESIGNED,"}
              </ScrollFloat>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                textClassName="font-neutralfacebold text-3xl text-white tracking-tight uppercase !leading-tight text-center"
                containerClassName="text-center w-full justify-center !my-0"
              >
                {"DEVELOPED,"}
              </ScrollFloat>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                textClassName="font-neutralfacebold text-3xl text-white tracking-tight uppercase !leading-tight text-center"
                containerClassName="text-center w-full justify-center !my-0"
              >
                {"DEPLOYED"}
              </ScrollFloat>
            </div>
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

        {/* Category Filter Pills (Desktop View) */}
        <div className="hidden md:flex w-full items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-12 max-w-5xl px-2">
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

        {/* Category Filter Dropdown (Mobile View) */}
        <div ref={dropdownRef} className="md:hidden w-full mb-12 px-2 relative max-w-2xl z-30">
          {/* Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full py-3.5 px-6 rounded-full bg-[#0e121d]/90 border text-white text-xs font-bold uppercase tracking-widest outline-none transition-all duration-300 shadow-[0_4px_20px_0_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-between font-sans ${
              isDropdownOpen ? 'border-accent ring-2 ring-accent/20' : 'border-white/15 hover:border-accent/40'
            }`}
          >
            <span>{selectedCategory}</span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="text-gray-400 w-4 h-4" />
            </motion.div>
          </button>

          {/* Animated Floating Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-2 right-2 mt-2 bg-[#0d111a]/95 border border-white/15 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden z-50 p-1.5"
              >
                <div className="flex flex-col gap-1">
                  {FILTER_CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between font-sans ${
                          isSelected
                            ? 'bg-accent/15 text-accent border border-accent/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span>{category}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3-Column Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
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
