import AnimatedContent from '../../components/AnimatedContent'
import ScrollFloat from '../../components/ScrollFloat';
import LogoLoop from '../../components/LogoLoop';
import ProfileCard from '../../components/ProfileCard'
import BorderGlow from '../../components/BorderGlow'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { motion } from "framer-motion";
import { useState } from "react";

import '../index.css'

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];



const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'ReactBits','GSAP', 'Framer Motion', 'shadcdn/ui']
  },
  {
    title: 'Backend',
    skills: ['Laravel', 'Node.js', 'Express', 'REST APIs', 'MongoDB', 'MySQL', 'Firebase', 'Supabase' ]
  },
  {
    title: 'Design',
    skills: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Canva']
  },
]

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
  'Node.js',
  'GSAP',
  'Motion',
  'PostgreSQL',
  'MongoDB',
  'Figma',
  'Git',
  'Vite',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Webflow'
]

const placeholderItems = [
  { label: 'Featured Project 1', note: 'Coming soon — a case study of a modern responsive build.' },
  { label: 'Featured Project 2', note: 'Placeholder for project highlights and measurable impact.' }
]

const achievements = [
  { label: 'Certified UX Designer', issuer: 'Design Institute', year: '2024' },
  { label: 'React Performance Badge', issuer: 'Web Academy', year: '2024' }
]

const SkillGroup = ({ title, skills }) => (
  <div className="rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {skills.map(skill => (
        <span key={skill} className="rounded-full px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
          {skill}
        </span>
      ))}
    </div>
  </div>
)

const ExperienceCard = ({ experience }) => (
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

const Pill = ({ label }) => (
  <span className="rounded-full px-4 py-2 text-sm shadow-sm" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
    {label}
  </span>
)

const PlaceholderCard = ({ title, description }) => (
  <div className="rounded-[2rem] p-6 shadow-xl" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
    <h4 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
    <p className="text-sm leading-7">{description}</p>
  </div>
)


const AboutSection = () => {
  const [activeSide, setActiveSide] = useState("developer");

  return (
    <section id="about" className="relative z-10 py-16 px-10 md:px-12 lg:px-24 text-center h-lvh">
    <div className="mx-auto max-w-6xl text-center">

      <ScrollFloat
      animationDuration={1}
      ease='back.inOut(2)'
      scrollStart='center bottom+=50%'
      scrollEnd='bottom bottom-=40%'
      stagger={0.03}
      textClassName="text-center font-threat font-2xl"
      >
      About me
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
        className="order-1 lg:order-2 lg:col-span-2"
      >
        <div className="p-4 font-helvetica-neue-medium flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:px-0">
          <div className="w-full mx-auto order-2 lg:order-1 lg:max-w-none lg:col-span-1 overflow-clip">
            <img 
              src="/avatar.jpg" 
              alt="Profile Avatar"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="col-span-2">
            <div className="text-left w-full px-4 py-4">
              <h1 className="text-2xl md:text-2xl lg:text-3xl">
                The name's <span className="font-bold gradient-text">Mark</span> but you can also call me <span className="font-bold gradient-text">Marky</span>
              </h1>
              <p className="text-sm lg:text-base py-2">
                I'm a Software Engineer, Multimedia Designer, and UI/UX Designer who loves helping businesses grow. Whether it's building a fast,
                modern website, designing a seamless user experience, or crafting a brand identity that actually sticks —
                I bring the right mix of technical skill and creative thinking to make it happen.
              </p>
            </div>

            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">Make changes to your account here.</TabsContent>
              <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

            <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
              <div>
                <h2 className="mb-4 text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  What I focus on
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <button
                    onClick={() => setActiveSide("developer")}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition duration-300 ${
                      activeSide === "developer"
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white/80 hover:text-white'
                    }`}
                  >
                    💻 Developer
                  </button>
                  <button
                    onClick={() => setActiveSide("designer")}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition duration-300 ${
                      activeSide === "designer"
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white/80 hover:text-white'
                    }`}
                  >
                    🎨 Designer
                  </button>
                </div>

                <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left shadow-sm" style={{ backdropFilter: 'blur(12px)' }}>
                  {activeSide === 'developer' ? (
                    <>
                      <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
                        I build polished, high-performance web apps using React, TypeScript, and modern frontend workflows. I focus on clean code, smooth interactions, and accessible UI that works across devices.
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>React & Next.js</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>TypeScript</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Tailwind CSS</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Animation & Motion</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
                        I create thoughtful visual systems, brand direction, and user experiences that feel intuitive and memorable. I bring strong typography, layout, and storytelling to every project.
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>UI/UX Design</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Figma</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Brand Systems</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Prototype & Motion</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </AnimatedContent>
          </div>
   
        </div>
      </BorderGlow>
      </AnimatedContent>


     



      {/* <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          width="100vw"
          className="w-screen"
          logoHeight={40}
          gap={45}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="var(--color-card-bg)"
          ariaLabel="Technology partners"
        />
      </div> */}



      {/* <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
            <p className="text-lg font-medium uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--color-accent)' }}>Hi, I'm Mark Angelo</p>
            <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>Crafting premium web experiences with performance and polish.</h2>
            <p className="mt-6 leading-8" style={{ color: 'var(--color-text-secondary)' }}>
              I build modern web applications and interactive design systems that balance strong visual storytelling with fast, accessible user experiences.
              My work blends frontend engineering, UX design, and animation to deliver polished results that feel both dynamic and reliable.
            </p>
          </div>
          <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Personal summary</p>
            <ul className="mt-6 space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Adaptable creator</strong> — I work across brand, product, and frontend development to bring ideas from concept to launch.
              </li>
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Collaborative mindset</strong> — I enjoy working closely with designers, developers, and stakeholders to align delivery with goals.
              </li>
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Growth focused</strong> — I actively refine processes and learn new tools to keep work efficient and future-ready.
              </li>
            </ul>
          </div>
        </div>
      </AnimatedContent> */}


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
