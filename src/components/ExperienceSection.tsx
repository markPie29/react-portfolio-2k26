import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from '../../components/ScrollFloat';
import AnimatedContent from '../../components/AnimatedContent';
import { ChevronDown } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import { SiReact, SiNextdotjs, SiTailwindcss, SiFigma, SiCanva, SiExpress, SiSupabase } from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from './CustomIcons';

const Pill = ({ label, icon }: { label: string, icon?: React.ReactNode }) => (
  <span className="group w-fit flex justify-center items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-[10.5px] sm:text-[12px] font-bold shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
    style={{
      backgroundColor: 'rgba(8, 10, 15, 0.4)',
      border: '1px solid rgba(72, 202, 228, 0.3)',
      boxShadow: '0 4px 14px 0 rgba(72, 202, 228, 0.08)'
    }}>
    {icon && <span className="text-[14px] sm:text-[16px] transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--color-accent)' }}>{icon}</span>}
    <span className="font-helvetica-neue-medium tracking-wider text-gray-300 group-hover:text-white transition-colors uppercase">{label}</span>
  </span>
);

const experienceData = [
  {
    id: 1,
    role: "Full Stack Web Developer",
    company: "Nexvision Innovations",
    date: "2026",
    bullets: [
      "Engineered and developed a comprehensive Logistics Software system for a corporate client.",
      "Architected and optimized the system structure to ensure scalability, security, and maintainability.",
      "Implemented key features across the full stack and proactively resolved bugs to ensure system stability.",
      "Mentored and led a team of interns, establishing best practices for codebase handling and collaboration."
    ],
    tools: [
      { label: "React", icon: <SiReact /> },
      { label: "Next.js", icon: <SiNextdotjs /> },
      { label: "Express", icon: <SiExpress /> },
      { label: "Supabase", icon: <SiSupabase /> }
    ]
  },
  {
    id: 2,
    role: "Project Based Virtual Assistant",
    company: "Marketing Hive",
    date: "2024 - Present",
    bullets: [
      "Designed graphic assets and edited short-form promotional videos for digital marketing campaigns and social media content.",
      "Assisted in social media management, including content planning, scheduling, engagement support, and audience-focused content research.",
      "Conducted trend and content research to improve audience reach, engagement, and overall brand visibility across platforms.",
      "Supported clients with creative and operational tasks while maintaining consistent visual branding and content quality."
    ],
    tools: [
      { label: "Photoshop", icon: <CustomPhotoshop /> },
      { label: "Canva", icon: <SiCanva /> },
      { label: "Capcut", icon: <CustomCapcut /> },
      { label: "Figma", icon: <SiFigma /> }
    ]
  },
  {
    id: 3,
    role: "Freelance Multimedia Designer",
    company: "Independent Freelance Work",
    date: "2024 - Present",
    bullets: [
      "Worked with multiple clients to create publication materials, branding assets, promotional graphics, and digital content.",
      "Designed UI/UX concepts and interface layouts for websites, applications, and creative projects.",
      "Collaborated directly with clients to transform ideas into visually engaging and user-centered designs while meeting project deadlines.",
      "Managed multiple projects simultaneously, strengthening communication, adaptability, and creative problem-solving skills."
    ],
    tools: [
      { label: "Figma", icon: <SiFigma /> },
      { label: "Photoshop", icon: <CustomPhotoshop /> },
      { label: "Illustrator", icon: <CustomIllustrator /> },
      { label: "Canva", icon: <SiCanva /> },
      { label: "Capcut", icon: <CustomCapcut /> }
    ]
  },
  {
    id: 4,
    role: "Multimedia Designer and Developer Trainee",
    company: "AP Global IT Solutions Inc.",
    date: "2023",
    bullets: [
      "Created visual and digital assets for branding, marketing, and client-facing materials.",
      "Assisted with development-related tasks involving software systems and UI improvements.",
      "Collaborated in fast-paced project environments, balancing technical implementation with creative design solutions.",
      "Learned the basics of React and applied it to frontend web development tasks."
    ],
    tools: [
      { label: "Canva", icon: <SiCanva /> },
      { label: "Figma", icon: <SiFigma /> },
      { label: "Capcut", icon: <CustomCapcut /> },
      { label: "React", icon: <SiReact /> }
    ]
  }
];

const ExperienceCard = ({ exp }: { exp: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Refresh ScrollTrigger after the Framer Motion layout animation completes (0.3s)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
    
    // Also trigger an immediate refresh
    ScrollTrigger.refresh();

    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <div className="relative w-full">
      {/* Node / Dot */}
      <div className="absolute -left-10 md:-left-20 top-8 w-8 md:w-12 flex justify-center z-20">
        <div className="w-4 h-4 rounded-full bg-accent border-4 border-bg relative">
          <motion.div
            className="w-full h-full bg-white rounded-full opacity-50 animate-ping"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="w-full">
        <AnimatedContent
          distance={80}
          direction="horizontal"
          reverse={false}
          duration={1}
        >
          <SpotlightCard 
            className="flex flex-col text-left rounded-[2rem] p-6 sm:p-8 shadow-xl relative group overflow-hidden transition-all duration-300 w-full" 
            style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}
            spotlightColor="rgba(72, 202, 228, 0.15)"
          >
            <motion.div layout className="relative z-10 flex flex-col w-full">
              
              {/* Header: Company and Date */}
              <motion.div layout className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 w-full">
                <motion.h3 layout className="text-2xl md:text-3xl font-bold text-white font-neutralfacebold tracking-wide">{exp.company}</motion.h3>
                <motion.div layout className="text-sm md:text-base text-accent font-sans font-semibold whitespace-nowrap pt-1 tracking-wide">{exp.date}</motion.div>
              </motion.div>

              {/* Position */}
              <motion.div layout className="text-sm text-gray-400 font-sans tracking-wide mb-8">{exp.role}</motion.div>

              {/* Tools and View More Row */}
              <motion.div layout className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 w-full">
                <motion.div layout className="flex flex-col gap-3">
                  <motion.div layout className="text-[10px] sm:text-[11px] text-gray-400 font-neutralface tracking-widest">Tools and Technology:</motion.div>
                  <motion.div layout className="flex flex-wrap gap-2">
                    {exp.tools.map((tool: any, idx: number) => (
                      <motion.div layout key={idx}>
                        <Pill label={tool.label} icon={tool.icon} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div layout className="shrink-0 pb-1">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-white/5"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 opacity-70 hover:opacity-100" />
                    </motion.div>
                  </button>
                </motion.div>
              </motion.div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col w-full overflow-hidden"
                  >
                    <div className="w-full h-[1px] bg-[var(--color-border)] opacity-30 mb-6"></div>
                    <ul className="text-gray-300 leading-relaxed text-sm md:text-base list-disc list-outside ml-4 space-y-3">
                      {exp.bullets.map((bullet: string, idx: number) => (
                        <li key={idx} className="pl-2 marker:text-accent/70">{bullet}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </motion.div>
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative z-10 pt-12 md:pt-16 pb-24 px-6 md:px-12 lg:px-24 min-h-screen" ref={containerRef}>
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-start mb-10 md:mb-12">
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
            textClassName="font-threat !leading-none"
            containerClassName="text-left w-fit !my-0 pb-4"
          >
            Experience
          </ScrollFloat>
        </div>

        <div className="relative w-full">
          
          {/* Timeline Container */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-8 md:w-12">
            {/* Timeline Line Background */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-800 rounded-full"></div>

            {/* Animated Timeline Line Foreground */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-accent rounded-full origin-top shadow-[0_0_15px_#48cae4,0_0_30px_#48cae4] z-10 animate-pulse"
              style={{ scaleY }}
            ></motion.div>
          </div>

          <div className="flex flex-col gap-10 relative z-10 w-full pl-10 md:pl-24">
            {experienceData.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
