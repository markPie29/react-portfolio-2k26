import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollFloat from '../../../components/ScrollFloat';
import SpotlightCard from '../SpotlightCard';
import BorderGlow from '../../../components/BorderGlow';
import { GraduationCap, Award, ChevronDown, ExternalLink } from 'lucide-react';
import { certificatesData, educationData } from '../../data/credentials';
import { SiReact, SiNextdotjs, SiExpress, SiSupabase, SiCanva, SiFigma } from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from '../CustomIcons';

const Pill = ({ label, icon }: { label: string; icon?: React.ReactNode }) => (
  <span className="group w-fit flex justify-center items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
    {icon && <span className="text-[13px] text-accent">{icon}</span>}
    <span className="font-helvetica-neue-medium tracking-wider uppercase">{label}</span>
  </span>
);

const experienceItems = [
  {
    id: 1,
    role: 'Full Stack Web Developer',
    company: 'Nexvision Innovations',
    date: '2026',
    bullets: [
      'Engineered and developed a comprehensive Logistics Software system for a corporate client.',
      'Architected system structure ensuring high scalability, security, and performance.',
      'Mentored interns and established codebase best practices for seamless team collaboration.',
    ],
    tools: [
      { label: 'React', icon: <SiReact /> },
      { label: 'Next.js', icon: <SiNextdotjs /> },
      { label: 'Express', icon: <SiExpress /> },
      { label: 'Supabase', icon: <SiSupabase /> },
    ],
  },
  {
    id: 2,
    role: 'Project Based Virtual Assistant',
    company: 'Marketing Hive',
    date: '2024 - Present',
    bullets: [
      'Designed graphic assets and edited short-form promotional videos for marketing campaigns.',
      'Assisted in social media management, content planning, and engagement research.',
      'Supported clients with visual branding and creative operations across platforms.',
    ],
    tools: [
      { label: 'Photoshop', icon: <CustomPhotoshop /> },
      { label: 'Canva', icon: <SiCanva /> },
      { label: 'Capcut', icon: <CustomCapcut /> },
      { label: 'Figma', icon: <SiFigma /> },
    ],
  },
  {
    id: 3,
    role: 'Freelance Multimedia Designer',
    company: 'Independent Freelance Work',
    date: '2024 - Present',
    bullets: [
      'Created branding materials, promotional graphics, and UI/UX concepts for clients.',
      'Worked directly with clients to translate project visions into functional designs.',
      'Managed multiple design deliverables simultaneously while adhering to deadlines.',
    ],
    tools: [
      { label: 'Figma', icon: <SiFigma /> },
      { label: 'Photoshop', icon: <CustomPhotoshop /> },
      { label: 'Illustrator', icon: <CustomIllustrator /> },
      { label: 'Canva', icon: <SiCanva /> },
    ],
  },
  {
    id: 4,
    role: 'Multimedia Designer & Dev Trainee',
    company: 'AP Global IT Solutions Inc.',
    date: '2023',
    bullets: [
      'Created visual and digital assets for branding and client-facing materials.',
      'Assisted with frontend UI web development tasks using React.',
    ],
    tools: [
      { label: 'Canva', icon: <SiCanva /> },
      { label: 'Figma', icon: <SiFigma /> },
      { label: 'Capcut', icon: <CustomCapcut /> },
      { label: 'React', icon: <SiReact /> },
    ],
  },
];

const ExperienceCardItem: React.FC<{ item: typeof experienceItems[0] }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SpotlightCard
      className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all group hover:border-accent/40"
      spotlightColor="rgba(72, 202, 228, 0.12)"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4 className="font-neutralfacebold text-lg md:text-xl text-gray-900 dark:text-white uppercase">
            {item.company}
          </h4>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            {item.date}
          </span>
        </div>

        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">
          {item.role}
        </div>

        {/* Tools row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {item.tools.map((t, idx) => (
              <Pill key={idx} label={t.label} icon={t.icon} />
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Toggle details"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Expanded Bullets */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden pt-3 border-t border-slate-200/80 dark:border-white/10 mt-2"
            >
              <ul className="list-disc list-outside ml-4 space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {item.bullets.map((b, idx) => (
                  <li key={idx} className="marker:text-accent">
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SpotlightCard>
  );
};

const CredentialsSection: React.FC = () => {
  return (
    <section id="credentials" className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
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
            CREDENTIALS
          </ScrollFloat>
        </div>

        {/* Grid Split: Left = EXPERIENCE, Right = CERTIFICATES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (65%) - EXPERIENCE */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-neutralfacebold text-xl sm:text-2xl tracking-wider text-gray-900 dark:text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-accent rounded-full inline-block"></span>
              EXPERIENCE
            </h3>

            <div className="flex flex-col gap-4">
              {experienceItems.map((item) => (
                <ExperienceCardItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right Column (35%) - CERTIFICATES & EDUCATION */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-neutralfacebold text-xl sm:text-2xl tracking-wider text-gray-900 dark:text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-accent rounded-full inline-block"></span>
              CERTIFICATES
            </h3>

            {/* Education Highlight Box with BorderGlow */}
            <BorderGlow
              edgeSensitivity={30}
              glowColor="80 80 80"
              backgroundColor=""
              borderRadius={20}
              glowRadius={30}
              glowIntensity={1}
              coneSpread={25}
              animated={true}
              colors={['#0077b6', '#00b4d8', '#48cae4']}
              className="w-full"
            >
              <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-sm flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 text-accent">
                    EDUCATION
                  </span>
                  <GraduationCap className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-neutralfacebold text-base text-gray-900 dark:text-white leading-snug mt-1">
                  {educationData.institution}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                  {educationData.degree} ({educationData.period})
                </p>
                <p className="text-xs text-accent font-semibold mt-1">
                  ★ {educationData.honors}
                </p>
              </div>
            </BorderGlow>

            {/* Certificates List */}
            <div className="flex flex-col gap-3">
              {certificatesData.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-accent/40 rounded-xl p-5 shadow-sm transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {cert.badgeTag}
                      </span>
                      <span className="text-[11px] font-semibold text-accent">
                        {cert.date}
                      </span>
                    </div>
                    <h5 className="font-neutralfacebold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-accent transition-colors mt-1">
                      {cert.title}
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {cert.issuer}
                    </p>
                  </div>
                  <Award className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
