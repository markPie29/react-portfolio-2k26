import React, { useState } from 'react'
import AnimatedContent from '../../components/AnimatedContent'
import { GraduationCap } from 'lucide-react'
import ScrollFloat from '../../components/ScrollFloat';
import BorderGlow from '../../components/BorderGlow'
import TiltedCard from '../../components/TiltedCard'
import FadeContent from '../../components/FadeContent'
import '../index.css'
import LogoLoop from './LogoLoop'
import { SiReact, SiNextdotjs, SiTailwindcss, SiExpress, SiLaravel, SiFirebase, SiSupabase, SiCanva, SiFigma, SiTypescript, SiJavascript, SiHtml5, SiCss, SiFramer, SiWebflow, SiSketch, SiMiro, SiMysql, SiUnity, SiPython, SiPhp, SiGit, SiGithub, SiDocker, SiShadcnui } from 'react-icons/si'
import { FaJava, FaDatabase, FaCode, FaVrCardboard } from 'react-icons/fa'
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from './CustomIcons'

const techLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiExpress />, title: "Express" },
  { node: <SiLaravel />, title: "Laravel" },
  { node: <SiFirebase />, title: "Firebase" },
  { node: <SiSupabase />, title: "Supabase" },
  { node: <CustomPhotoshop />, title: "Adobe Photoshop" },
  { node: <CustomIllustrator />, title: "Adobe Illustrator" },
  { node: <SiCanva />, title: "Canva" },
  { node: <SiFigma />, title: "Figma" },
  { node: <CustomCapcut />, title: "Capcut" },
];

const developerCategories = [
  {
    title: "Frontend",
    skills: [
      { label: "REACT", icon: <SiReact /> },
      { label: "NEXT.JS", icon: <SiNextdotjs /> },
      { label: "TAILWIND CSS", icon: <SiTailwindcss /> },
      { label: "SHADCN/UI", icon: <SiShadcnui /> },
      { label: "FRAMER MOTION", icon: <SiFramer /> },
      { label: "REACT BITS", icon: <FaCode /> }
    ]
  },
  {
    title: "Backend Frameworks",
    skills: [
      { label: "EXPRESS.JS", icon: <SiExpress /> },
      { label: "LARAVEL", icon: <SiLaravel /> }
    ]
  },
  {
    title: "Backend Services",
    skills: [
      { label: "SUPABASE", icon: <SiSupabase /> },
      { label: "FIREBASE", icon: <SiFirebase /> }
    ]
  },
  {
    title: "Databases",
    skills: [
      { label: "MYSQL", icon: <SiMysql /> },
      { label: "SQL SERVER", icon: <FaDatabase /> }
    ]
  },
  {
    title: "Game Development",
    skills: [
      { label: "UNITY", icon: <SiUnity /> },
      { label: "PYGAME", icon: <SiPython /> },
      { label: "AR DEV", icon: <FaVrCardboard /> }
    ]
  },
  {
    title: "Programming Languages",
    skills: [
      { label: "JAVA", icon: <FaJava /> },
      { label: "PYTHON", icon: <SiPython /> },
      { label: "PHP", icon: <SiPhp /> },
      { label: "TYPESCRIPT", icon: <SiTypescript /> },
      { label: "VISUAL BASIC", icon: <FaCode /> },
      { label: "C#", icon: <FaCode /> }
    ]
  },
  {
    title: "Tools & Technologies",
    skills: [
      { label: "GIT", icon: <SiGit /> },
      { label: "GITHUB", icon: <SiGithub /> },
      { label: "DOCKER", icon: <SiDocker /> }
    ]
  }
];

const experiences = [
  {
    title: 'Software Engineer',
    organization: 'Creative Studio Co.',
    range: '2023 - Present',
    description:
      'Leading frontend development for highly interactive experiences, building reusable component systems and polished landing pages.',
    achievements: [
      'Delivered accessible responsive interfaces using React and Tailwind CSS.',
      'Reduced page load time by 25% through code splitting and asset optimization.'
    ],
    technologies: ['React', 'GSAP', 'Tailwind', 'Vite']
  },
  {
    title: 'UI/UX Designer',
    organization: 'Freelance Projects',
    range: '2021 - 2023',
    description:
      'Designed interfaces and brand systems for startups, artists, and digital products with an emphasis on visual storytelling.',
    achievements: [
      'Crafted wireframes and high-fidelity prototypes for mobile and desktop experiences.',
      'Collaborated with developers to launch projects on schedule.'
    ],
    technologies: ['Figma', 'Adobe XD', 'Illustrator']
  }
]

const technologies = [
  'React',
  'Tailwind CSS',
  'JavaScript',
  'TypeScript',

]

const placeholderItems = [
  { label: 'Featured Project 1', note: 'Coming soon — a case study of a modern responsive build.' },
  { label: 'Featured Project 2', note: 'Placeholder for project highlights and measurable impact.' }
]

const achievements = [
  { label: 'Certified UX Designer', issuer: 'Design Institute', year: '2024' },
  { label: 'React Performance Badge', issuer: 'Web Academy', year: '2024' }
]



interface Experience {
  title: string;
  organization: string;
  range: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const ExperienceCard = ({ experience }: { experience: Experience }) => (
  <div className="group relative overflow-hidden rounded-[2rem] p-6 shadow-xl transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, rgba(0,119,182,0.05), var(--color-border))' }} />
    <div className="relative">
      <div className="text-sm uppercase tracking-[0.24em]" style={{ color: 'var(--color-accent)' }}>{experience.range}</div>
      <h3 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{experience.title}</h3>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{experience.organization}</p>
      <p className="mt-4 text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>{experience.description}</p>
      <div className="mt-4 space-y-2">
        {experience.achievements.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-block', marginRight: '8px', color: 'var(--color-accent)' }}>•</span>
            {item}
          </p>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {experience.technologies.map(item => (
          <span key={item} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
)

const Pill = ({ label, icon }: { label: string, icon?: React.ReactNode }) => (
  <span className="group w-fit flex justify-center items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-[10.5px] sm:text-[12px] font-bold shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
    style={{
      backgroundColor: 'rgba(8, 10, 15, 0.4)',
      border: '1px solid rgba(72, 202, 228, 0.3)',
      boxShadow: '0 4px 14px 0 rgba(72, 202, 228, 0.08)'
    }}>
    {icon && <span className="text-[14px] sm:text-[16px] transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--color-accent)' }}>{icon}</span>}
    <span className="font-helvetica-neue-medium tracking-wider">{label}</span>
  </span>
)

const PlaceholderCard = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-[2rem] p-6 shadow-xl" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
    <h4 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
    <p className="text-sm leading-7">{description}</p>
  </div>
)


const AboutSection = () => {
  const [expandedCard, setExpandedCard] = useState<'developer' | 'designer' | null>(null);

  return (
    <section id="about" className="relative z-10 py-16 px-10 md:px-12 lg:px-24 text-center min-h-screen">
      <div className="mx-auto max-w-6xl text-center">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full mb-8 mt-8 items-center">
          <div className="lg:col-span-2 w-full">

            <ScrollFloat
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
              textClassName="font-threat !leading-none"
              containerClassName="text-left w-fit !my-0 pb-4"
            >
              About Me
            </ScrollFloat>

            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              duration={3}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.1}
              delay={0}
            >

              <div className='flex flex-col gap-4 text-[15px] sm:text-base text-left text-gray-300/90 leading-relaxed mb-10'>
                <p>
                  I am a Computer Engineering student at the University of Rizal System and an aspiring Software Engineer. My journey is driven by a passion for building functional, beautiful, and user-centered digital experiences.
                </p>
                <p>
                  With hands-on experience in full-stack web development, UI/UX design, and AR/mobile game development, I thrive at the intersection of technical implementation and creative problem-solving.
                </p>
              </div>

              <BorderGlow
                edgeSensitivity={30}
                glowColor="80 80 80"
                backgroundColor=""
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={true}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between gap-5 p-5 sm:p-6 rounded-[28px] bg-transparent w-full relative z-10">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-white font-bold text-base sm:text-lg leading-tight">Education</h4>
                    <div className="text-gray-200 font-medium text-[14px] sm:text-[15px] leading-tight">University of Rizal System - Antipolo Campus</div>
                    <div className="text-gray-400 text-[13px] sm:text-sm leading-tight">BS in Computer Engineering (2023 – Present)</div>
                    <div className="text-[#38bdf8] text-[13px] sm:text-sm font-semibold mt-0.5 leading-tight">DOST-SEI S&T Undergraduate Scholar</div>
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#1e293b]/50 border border-white/5 text-[#38bdf8]">
                    <GraduationCap size={28} strokeWidth={1.5} />
                  </div>
                </div>

              </BorderGlow>
            </AnimatedContent>
          </div>

          <div className="lg:col-span-1 flex justify-center">
            <FadeContent blur={true} duration={1} ease="power3.out" delay={0.2}>
              <TiltedCard
                imageSrc="/avatar.jpg"
                altText="Profile Avatar"
                captionText="Profile Avatar"
                containerHeight="400px"
                containerWidth="40px"
                imageHeight="400px"
                imageWidth="400px"
                rotateAmplitude={1}
                scaleOnHover={1.02}
                showMobileWarning={false}
                showTooltip
                displayOverlayContent
                overlayContent={
                  <p className="tilted-card-demo-text">

                  </p>
                }
              />
            </FadeContent>
          </div>
        </div>

        {/* Skills Logo Loop */}
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.2}
        >
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8 overflow-hidden" style={{ color: 'var(--color-text-secondary)' }}>
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={40}
              gap={60}
              hoverSpeed={0}
              scaleOnHover
            />
          </div>
        </AnimatedContent>

        {/* Bottom Content: Developer & Designer Cards */}
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.4}
        >
          <div className="flex flex-col text-left rounded-[2rem] p-6 sm:p-8 shadow-xl relative group overflow-hidden mb-16" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(192, 132, 252, 0.05))' }} />



            {/* Split Layout Container */}
            <div className="flex flex-col md:flex-row w-full gap-6 md:gap-0 relative z-10">

              {/* Developer Section */}
              <div className="w-full md:w-1/2 flex flex-col md:pr-4 lg:pr-8">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-wide gradient-text uppercase font-neutralfacebold shrink-0 mb-6">Developer</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full mt-auto">
                  <Pill label="REACT" icon={<SiReact />} />
                  <Pill label="NEXT.JS" icon={<SiNextdotjs />} />
                  <Pill label="SUPABASE" icon={<SiSupabase />} />
                  <Pill label="LARAVEL" icon={<SiLaravel />} />
                  <Pill label="FIREBASE" icon={<SiFirebase />} />
                  <Pill label="TAILWIND CSS" icon={<SiTailwindcss />} />
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden md:block w-[1px] bg-[var(--color-border)] opacity-30 shrink-0 self-stretch mx-4"></div>

              {/* Mobile Separator */}
              <div className="md:hidden h-[1px] w-full bg-[var(--color-border)] opacity-30 shrink-0 my-2"></div>

              {/* Designer Section */}
              <div className="w-full md:w-1/2 flex flex-col md:pl-4 lg:pl-8">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-wide gradient-text uppercase font-neutralfacebold shrink-0 mb-6">Designer</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full mt-auto">
                  <Pill label="PHOTOSHOP" icon={<CustomPhotoshop />} />
                  <Pill label="ILLUSTRATOR" icon={<CustomIllustrator />} />
                  <Pill label="CANVA" icon={<SiCanva />} />
                  <Pill label="FIGMA" icon={<SiFigma />} />
                  <Pill label="CAPCUT" icon={<CustomCapcut />} />
                </div>
              </div>

            </div>

            {/* Bottom Bar with View All */}
            <div className="flex justify-end mt-8 w-full z-10 relative">
              <a href="#" className="text-[11px] sm:text-xs font-normal opacity-60 hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                View All
              </a>
            </div>
          </div>
        </AnimatedContent>



        <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-8" style={{ color: 'var(--color-text-primary)' }}>Experience Timeline</h3>
            <div className="space-y-8">
              {experiences.map(exp => (
                <ExperienceCard key={exp.title} experience={exp} />
              ))}
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
          <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Technologies & Tools</h3>
                <p className="mt-2 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>A dependable stack for building scalable user interfaces, animation, and backend support.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {technologies.map(tool => (
                <Pill key={tool} label={tool} />
              ))}
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
          <div id="projects" className="grid gap-6 lg:grid-cols-2">
            {placeholderItems.map(item => (
              <PlaceholderCard key={item.label} title={item.label} description={item.note} />
            ))}
          </div>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
          <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Achievements & Certifications</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map(item => (
                <div key={item.label} className="rounded-3xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.label}</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.issuer} · {item.year}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="rounded-[2rem] p-8 shadow-xl" id="contact" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Let's build something together</h3>
              <p className="mt-3 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
                If you're looking for a dependable collaborator who can help transform creative ideas into working product, I'd love to connect.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Contact me
            </a>
          </div>
        </AnimatedContent>
      </div>
    </section>
  )
}

export default AboutSection
