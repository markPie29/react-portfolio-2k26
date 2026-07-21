import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  developerTopSkills,
  designerTopSkills,
  developerCategories,
  designerCategories,
} from '../../data/techStack';
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
  SiPython,
  SiPhp,
  SiGit,
  SiGithub,
  SiDocker,
  SiShadcnui,
  SiFramer,
  SiMysql,
  SiUnity,
} from 'react-icons/si';
import { FaJava, FaDatabase, FaCode, FaVrCardboard } from 'react-icons/fa';
import {
  ImageIcon,
  PenTool,
  Wand2,
  Mail,
  Shirt,
  Layout,
  PlaySquare,
  Film,
} from 'lucide-react';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from '../CustomIcons';

const getIcon = (name: string) => {
  switch (name) {
    case 'react':
      return <SiReact />;
    case 'nextjs':
      return <SiNextdotjs />;
    case 'supabase':
      return <SiSupabase />;
    case 'laravel':
      return <SiLaravel />;
    case 'firebase':
      return <SiFirebase />;
    case 'tailwindcss':
      return <SiTailwindcss />;
    case 'photoshop':
      return <CustomPhotoshop />;
    case 'illustrator':
      return <CustomIllustrator />;
    case 'canva':
      return <SiCanva />;
    case 'figma':
      return <SiFigma />;
    case 'capcut':
      return <CustomCapcut />;
    case 'shadcn':
      return <SiShadcnui />;
    case 'framer':
      return <SiFramer />;
    case 'code':
      return <FaCode />;
    case 'express':
      return <SiExpress />;
    case 'mysql':
      return <SiMysql />;
    case 'database':
      return <FaDatabase />;
    case 'unity':
      return <SiUnity />;
    case 'python':
      return <SiPython />;
    case 'vr':
      return <FaVrCardboard />;
    case 'java':
      return <FaJava />;
    case 'php':
      return <SiPhp />;
    case 'typescript':
      return <SiTypescript />;
    case 'git':
      return <SiGit />;
    case 'github':
      return <SiGithub />;
    case 'docker':
      return <SiDocker />;
    case 'image':
      return <ImageIcon size={14} />;
    case 'pentool':
      return <PenTool size={14} />;
    case 'wand':
      return <Wand2 size={14} />;
    case 'mail':
      return <Mail size={14} />;
    case 'shirt':
      return <Shirt size={14} />;
    case 'layout':
      return <Layout size={14} />;
    case 'playsquare':
      return <PlaySquare size={14} />;
    case 'film':
      return <Film size={14} />;
    default:
      return null;
  }
};

const SkillPill: React.FC<{ label: string; iconName: string }> = ({
  label,
  iconName,
}) => (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-accent/50 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-200 hover:text-white transition-all shadow-sm">
    <span className="text-accent text-sm">{getIcon(iconName)}</span>
    <span>{label}</span>
  </div>
);

const TechStackSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="tech-stack" className="w-full bg-[#080A0F] text-white py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          layout
          className="bg-[#0B0E14] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl"
        >
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {/* Developer Column */}
            <motion.div layout className="flex flex-col gap-6">
              <h2 className="font-neutralfacebold text-2xl md:text-3xl tracking-wider text-accent uppercase">
                DEVELOPER
              </h2>

              <div className="flex flex-wrap gap-3">
                {developerTopSkills.map((s) => (
                  <SkillPill key={s.name} label={s.label} iconName={s.name} />
                ))}
              </div>

              {/* Expanded Developer Skill Breakdown */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded-dev"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-6 pt-4 border-t border-white/10 overflow-hidden"
                  >
                    {developerCategories.map((cat, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                          {cat.title}
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((skill, sIdx) => (
                            <SkillPill
                              key={sIdx}
                              label={skill.label}
                              iconName={skill.name}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Designer Column */}
            <motion.div layout className="flex flex-col gap-6">
              <h2 className="font-neutralfacebold text-2xl md:text-3xl tracking-wider text-accent uppercase">
                DESIGNER
              </h2>

              <div className="flex flex-wrap gap-3">
                {designerTopSkills.map((s) => (
                  <SkillPill key={s.name} label={s.label} iconName={s.name} />
                ))}
              </div>

              {/* Expanded Designer Skill Breakdown */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded-designer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-6 pt-4 border-t border-white/10 overflow-hidden"
                  >
                    {designerCategories.map((cat, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                          {cat.title}
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map((skill, sIdx) => (
                            <SkillPill
                              key={sIdx}
                              label={skill.label}
                              iconName={skill.name}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* View All / Close Button */}
          <motion.div layout className="flex justify-end mt-8 relative z-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold tracking-wider text-gray-400 hover:text-white uppercase transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Close' : 'View All'}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
