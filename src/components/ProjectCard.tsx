import React, { useState } from 'react';
import { motion } from 'motion/react';
import SpotlightCard from './SpotlightCard';
import { ProjectItem } from '../types/content';
import { ImageOff, ExternalLink, Film, Video } from 'lucide-react';
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
  SiCanva,
} from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from './CustomIcons';

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

interface ProjectCardProps {
  project: ProjectItem;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
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
  );
};

export default ProjectCard;
