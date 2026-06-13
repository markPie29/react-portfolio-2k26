import GradientText from './GradientText'
import AnimatedContent from './AnimatedContent.jsx'

const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'HTML5', 'CSS3']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'Firebase']
  },
  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis']
  },
  {
    title: 'Tools',
    skills: ['Figma', 'Git', 'Vite', 'VS Code', 'GitHub', 'Postman']
  },
  {
    title: 'Design',
    skills: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Webflow']
  },
  {
    title: 'Other',
    skills: ['Agile', 'Cross-functional collaboration', 'Performance optimization']
  }
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
  'Vite'
]

const placeholderItems = [
  { label: 'Featured Project 1', note: 'Coming soon — a case study of a modern responsive build.' },
  { label: 'Featured Project 2', note: 'Placeholder for project highlights and measurable impact.' }
]

const achievements = [
  { label: 'Certified UX Designer', issuer: 'Design Institute', year: '2024' },
  { label: 'React Performance Badge', issuer: 'Web Academy', year: '2024' }
]

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-8 max-w-3xl text-center mx-auto">
    <GradientText className="text-3xl md:text-4xl font-semibold mb-4" showBorder={false}>
      {title}
    </GradientText>
    <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
  </div>
)

const SkillGroup = ({ title, skills }) => (
  <div className="rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]" style={{ backgroundColor: 'rgba(8,10,15,0.44)', border: '1px solid rgba(72,202,228,0.06)' }}>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {skills.map(skill => (
        <span key={skill} className="rounded-full px-3 py-2 text-xs text-slate-200" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(72,202,228,0.04)' }}>
          {skill}
        </span>
      ))}
    </div>
  </div>
)

const ExperienceCard = ({ experience }) => (
  <div className="group relative overflow-hidden rounded-[2rem] p-6 shadow-xl transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: 'rgba(8,10,15,0.44)', border: '1px solid rgba(72,202,228,0.06)' }}>
    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, rgba(0,123,182,0.05), rgba(72,202,228,0.06))' }} />
    <div className="relative">
      <div className="text-sm uppercase tracking-[0.24em]" style={{ color: 'var(--color-accent)' }}>{experience.range}</div>
      <h3 className="mt-3 text-2xl font-semibold text-white">{experience.title}</h3>
      <p className="text-sm text-slate-400">{experience.organization}</p>
      <p className="mt-4 text-sm leading-7 text-slate-300">{experience.description}</p>
      <div className="mt-4 space-y-2">
        {experience.achievements.map((item, index) => (
          <p key={index} className="text-sm text-slate-300 before:content-['•'] before:mr-2 before:text-cyan-400">
            {item}
          </p>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {experience.technologies.map(item => (
          <span key={item} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
)

const Pill = ({ label }) => (
  <span className="rounded-full px-4 py-2 text-sm text-slate-200 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(72,202,228,0.04)' }}>
    {label}
  </span>
)

const PlaceholderCard = ({ title, description }) => (
  <div className="rounded-[2rem] p-6 text-slate-300 shadow-xl" style={{ backgroundColor: 'rgba(8,10,15,0.42)', border: '1px solid rgba(72,202,228,0.06)' }}>
    <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
    <p className="text-sm leading-7">{description}</p>
  </div>
)

const AboutSection = () => (
  <section id="about" className="relative z-10 px-6 py-16 md:px-12 lg:px-24">
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        title="About Me"
        subtitle="A modular and scalable introduction to my skills, experience, and technical interests. Designed for easy updates and clean customization."
      />

      <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'rgba(8,10,15,0.46)', border: '1px solid rgba(72,202,228,0.06)' }}>
            <p className="text-lg font-medium uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--color-accent)' }}>Hi, I’m Mark Angelo</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Crafting premium web experiences with performance and polish.</h2>
            <p className="mt-6 text-slate-300 leading-8">
              I build modern web applications and interactive design systems that balance strong visual storytelling with fast, accessible user experiences.
              My work blends frontend engineering, UX design, and animation to deliver polished results that feel both dynamic and reliable.
            </p>
          </div>
          <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'rgba(8,10,15,0.42)', border: '1px solid rgba(72,202,228,0.06)' }}>
            <p className="text-lg font-semibold text-white">Personal summary</p>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong className="text-white">Adaptable creator</strong> — I work across brand, product, and frontend development to bring ideas from concept to launch.
              </li>
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong className="text-white">Collaborative mindset</strong> — I enjoy working closely with designers, developers, and stakeholders to align delivery with goals.
              </li>
              <li className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <strong className="text-white">Growth focused</strong> — I actively refine processes and learn new tools to keep work efficient and future-ready.
              </li>
            </ul>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map(group => (
            <SkillGroup key={group.title} title={group.title} skills={group.skills} />
          ))}
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="mb-16">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-8">Experience Timeline</h3>
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
              <h3 className="text-2xl font-semibold text-white">Technologies & Tools</h3>
              <p className="text-slate-400 mt-2 max-w-2xl">A dependable stack for building scalable user interfaces, animation, and backend support.</p>
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
        <div className="rounded-[2rem] p-8 shadow-xl" style={{ backgroundColor: 'rgba(8,10,15,0.44)', border: '1px solid rgba(72,202,228,0.06)' }}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-white">Achievements & Certifications</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map(item => (
              <div key={item.label} className="rounded-3xl p-5" style={{ backgroundColor: 'rgba(8,10,15,0.42)', border: '1px solid rgba(72,202,228,0.06)' }}>
                <p className="text-lg font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-sm text-slate-400">{item.issuer} · {item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.9} ease="power3.out" className="rounded-[2rem] p-8 shadow-xl" id="contact" style={{ backgroundColor: 'rgba(8,10,15,0.44)', border: '1px solid rgba(72,202,228,0.06)' }}>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-white">Let’s build something together</h3>
            <p className="mt-3 text-slate-300 max-w-2xl">
              If you’re looking for a dependable collaborator who can help transform creative ideas into working product, I’d love to connect.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-slate-950 transition"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Contact me
          </a>
        </div>
      </AnimatedContent>
    </div>
  </section>
)

export default AboutSection
