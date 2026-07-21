import React, { useState } from 'react';
import ScrollFloat from '../../../components/ScrollFloat';
import FadeContent from '../../../components/FadeContent';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types/content';
import ProjectModal from './ProjectModal';
import { ExternalLink, ImageOff } from 'lucide-react';

const ProjectCardImage: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  if (!project.image || imageError) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-white/5 text-accent mb-1.5 border border-slate-300 dark:border-white/10 shadow-sm">
          <ImageOff size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-helvetica-neue-medium">
          No Image Available
        </span>
      </div>
    );
  }

  return (
    <>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 filter grayscale group-hover:grayscale-0"
        onError={() => setImageError(true)}
      />
      {/* Hover Overlay Affordance */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-neutralfacebold text-xs uppercase tracking-widest backdrop-blur-[2px]">
        <span>View Project</span>
        <ExternalLink size={14} />
      </div>
    </>
  );
};

const FeaturedWorksSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="works" className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            textClassName="font-neutralfacebold text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase !leading-none text-gray-900 dark:text-white"
            containerClassName="text-left w-fit !my-0"
          >
            FEATURED WORKS
          </ScrollFloat>
        </div>

        <FadeContent blur duration={1} ease="power3.out" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projectsData.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-accent/50 transition-all duration-300 group shadow-sm backdrop-blur-sm cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Thumbnail Container */}
                <div className="w-full aspect-[16/10] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <ProjectCardImage project={project} />
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block font-helvetica-neue-medium">
                      {project.category}
                    </span>

                    <h3 className="font-neutralfacebold text-lg sm:text-xl uppercase tracking-wide mb-2 text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-white/5">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeContent>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default FeaturedWorksSection;
