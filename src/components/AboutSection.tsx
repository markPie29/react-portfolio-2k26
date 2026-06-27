import AnimatedContent from '../../components/AnimatedContent'
import { GraduationCap } from 'lucide-react'
import ScrollFloat from '../../components/ScrollFloat';
import BorderGlow from '../../components/BorderGlow'
import TiltedCard from '../../components/TiltedCard'
import FadeContent from '../../components/FadeContent'
import '../index.css'



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

const Pill = ({ label }: { label: string }) => (
  <span className="rounded-full px-4 py-2 text-sm shadow-sm" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
    {label}
  </span>
)

const PlaceholderCard = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-[2rem] p-6 shadow-xl" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
    <h4 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
    <p className="text-sm leading-7">{description}</p>
  </div>
)


const AboutSection = () => {

  return (
    <section id="about" className="relative z-10 py-16 px-10 md:px-12 lg:px-24 text-center min-h-screen">
      <div className="mx-auto max-w-6xl text-center">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full mb-16 mt-8 items-center">
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
                    <div className="text-gray-200 font-medium text-[14px] sm:text-[15px] leading-tight">University of Rizal System</div>
                    <div className="text-gray-400 text-[13px] sm:text-sm leading-tight">BS in Computer Engineering (2023 – Present)</div>
                    <div className="text-[#38bdf8] text-[13px] sm:text-sm font-semibold mt-0.5 leading-tight">DOST Scholar</div>
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
