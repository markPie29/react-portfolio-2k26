import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import ScrollFloat from "../../components/ScrollFloat";
import SpotlightCard from './SpotlightCard';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { SiReact, SiNextdotjs, SiTailwindcss, SiLaravel, SiFirebase, SiExpress, SiSupabase, SiUnity, SiFigma, SiFramer, SiCanva } from 'react-icons/si';
import { Code, Palette } from 'lucide-react';
import LogoLoop from './LogoLoop';
import { CustomPhotoshop, CustomIllustrator } from './CustomIcons';

const SimpleCarousel = ({ images }: { images: string[] }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const isDown = React.useRef(false);
    const startX = React.useRef(0);
    const scrollLeftRef = React.useRef(0);
    const quickToRef = React.useRef<ReturnType<typeof gsap.quickTo> | null>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            quickToRef.current = gsap.quickTo(scrollRef.current, 'scrollLeft', {
                duration: 0.5,
                ease: 'power3.out',
            });
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDown.current = true;
        startX.current = e.pageX;
        scrollLeftRef.current = scrollRef.current.scrollLeft;
        scrollRef.current.style.scrollBehavior = 'auto';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown.current || !scrollRef.current) return;
        e.preventDefault();
        const walk = (e.pageX - startX.current) * 1.5;
        const target = gsap.utils.clamp(
            0,
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
            scrollLeftRef.current - walk
        );
        quickToRef.current?.(target);
    };

    const onMouseUp = () => {
        if (!scrollRef.current) return;
        isDown.current = false;
        scrollRef.current.style.scrollBehavior = 'smooth';
    };

    return (
        <div className="relative group w-full mb-8">
            <button 
                onClick={() => scroll('left')} 
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#080a0f]/80 hover:bg-accent/80 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div 
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="w-full flex overflow-x-auto gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth cursor-grab active:cursor-grabbing select-none"
            >
                {images.map((src, idx) => (
                    <img key={idx} src={src} className="h-[200px] md:h-[250px] w-auto snap-center rounded-xl object-contain bg-[#0a0d14] shrink-0 border border-white/5 pointer-events-none" alt={`Carousel artwork ${idx + 1}`} loading="lazy" />
                ))}
            </div>
            <button 
                onClick={() => scroll('right')} 
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#080a0f]/80 hover:bg-accent/80 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
    );
};

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

const projectsData = [
  {
    id: 1,
    title: "URSAC Hub",
    category: "University E-Commerce & Management",
    date: "2023",
    description: "A centralized platform designed for URS students to purchase organization merchandise and access official news and announcements. It includes a management dashboard for organization leaders to track and manage their sales and public announcements.",
    keyContributions: [
      "Built the core platform and integrated e-commerce features for merchandise sales.",
      "Developed the management portal for organization leaders to handle announcements and sales tracking."
    ],
    tools: [
      { label: "Laravel", icon: <SiLaravel /> },
      { label: "Tailwind CSS", icon: <SiTailwindcss /> }
    ]
  },
  {
    id: 2,
    title: "URSAC Hub 2.0",
    category: "Social Network Platform",
    date: "2024",
    description: "A social media platform designed specifically for URS students. The application provides an interactive space where students can securely interact, connect, and engage with each other within a campus-focused digital community.",
    keyContributions: [
      "Built the entire social media platform and connection infrastructure.",
      "Implemented real-time user interaction and communication features."
    ],
    tools: [
      { label: "Firebase", icon: <SiFirebase /> },
      { label: "React", icon: <SiReact /> },
      { label: "Tailwind CSS", icon: <SiTailwindcss /> }
    ]
  },
  {
    id: 3,
    title: "SK Logistics | Enterprise Fleet and Trip Management",
    category: "Enterprise Software",
    date: "2025",
    description: "An enterprise-grade logistics software system designed for comprehensive fleet and trip management. The system streamlines logistics operations by handling complex operational work forms and dynamic user roles.",
    keyContributions: [
      "Collaborated on implementing the flow for operational work forms and configuring user roles.",
      "Assisted in developing core system features and proactively resolved critical bugs."
    ],
    tools: [
      { label: "React", icon: <SiReact /> },
      { label: "Supabase", icon: <SiSupabase /> },
      { label: "Next.js", icon: <SiNextdotjs /> },
      { label: "Express", icon: <SiExpress /> }
    ]
  },
  {
    id: 4,
    title: "AR-DUINO",
    category: "Augmented Reality Application",
    date: "2024",
    description: "Augmented Reality Drive Interface for Navigation and Operation (AR-DUINO) is a mobile application that enables students to run Arduino simulations using immersive AR and 3D environments to visualize electronic and computer components.",
    keyContributions: [
      "Primarily worked on designing and developing the User Interface of the application."
    ],
    tools: [
      { label: "Unity", icon: <SiUnity /> },
      { label: "Vuforia" },
      { label: "ARCore" }
    ]
  }
];

const designerProjectsData = [
  {
    id: 1,
    title: "ACCESS",
    category: "School Organization",
    date: "2024",
    description: "",
    useLogoLoop: true,
    keyContributions: [
      "Designed marketing materials, event posters, and social media graphics.",
      "Developed comprehensive brand identity and visual variations."
    ],
    tools: [
      { label: "Canva", icon: <SiCanva /> },
      { label: "Illustrator", icon: <CustomIllustrator /> },
      { label: "Photoshop", icon: <CustomPhotoshop /> }
    ]
  },
  {
    id: 2,
    title: "Mobile App UI/UX",
    category: "Product Design",
    date: "2023",
    description: "User interface and user experience design for a fitness tracking mobile application. The focus was on creating an intuitive, engaging, and motivating experience for users tracking their daily workouts.",
    keyContributions: [
      "Created wireframes, interactive prototypes, and high-fidelity mockups.",
      "Conducted user research to refine the navigation flow."
    ],
    tools: [
      { label: "Figma", icon: <SiFigma /> },
      { label: "Framer", icon: <SiFramer /> }
    ]
  },
  {
    id: 3,
    title: "E-Commerce Web Redesign",
    category: "Web Design",
    date: "2025",
    description: "A complete visual overhaul for an online retail store. The goal was to improve conversion rates by creating a cleaner, more accessible layout with an emphasis on high-quality product imagery and seamless checkout flow.",
    keyContributions: [
      "Redesigned the homepage and product detail pages.",
      "Developed a cohesive component library for the development team."
    ],
    tools: [
      { label: "Figma", icon: <SiFigma /> }
    ]
  },
  {
    id: 4,
    title: "Fintech Dashboard",
    category: "UI/UX Design",
    date: "2024",
    description: "Designed a comprehensive analytics dashboard for a financial technology platform. Focus was placed on data visualization, ensuring complex financial metrics were easy to read and understand at a glance.",
    keyContributions: [
      "Created data-rich interface layouts and widget components.",
      "Conducted user testing with financial analysts to refine usability."
    ],
    tools: [
      { label: "Figma", icon: <SiFigma /> },
      { label: "React", icon: <SiReact /> }
    ]
  }
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 1
    }),
    center: {
        x: 0,
        opacity: 1,
        zIndex: 1
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
        zIndex: 0
    })
};

const ProjectsSection = ({ hideViewMore = false, isProjectsPage = false }: { hideViewMore?: boolean, isProjectsPage?: boolean }) => {
    const [activeTab, setActiveTab] = useState('developer');
    const [direction, setDirection] = useState(0);

    const handleTabChange = (newTab: string) => {
        if (newTab === activeTab) return;
        const tabOrder = ['developer', 'designer'];
        const currentIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(newTab);
        setDirection(newIndex > currentIndex ? 1 : -1);
        setActiveTab(newTab);
    };

    const tabs = [
        { id: 'developer', label: 'Developer', icon: <Code className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
        { id: 'designer', label: 'Designer', icon: <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" /> }
    ];

    return (
        <section id="projects" className="relative z-10 pt-12 md:pt-16 pb-24 px-6 md:px-12 lg:px-24 min-h-screen overflow-x-clip">
            <div className="mx-auto max-w-5xl">
                {/* Title and Tabs Header */}
                <div className={`flex flex-col gap-4 md:gap-6 ${isProjectsPage ? 'mb-6 md:mb-8' : 'mb-10 md:mb-12 md:flex-row md:justify-between md:items-center'}`}>
                    {/* Title Area */}
                    <div className="flex items-center gap-4">
                        {isProjectsPage && (
                            <Link 
                                to="/#projects" 
                                className="group/backbtn flex items-center justify-center p-2 md:p-3 border border-accent/20 rounded-full bg-[#080a0f] hover:bg-accent/10 hover:border-accent transition-all duration-300 shadow-[0_4px_14px_0_rgba(72,202,228,0.08)]"
                                aria-label="Go back to Home Projects Section"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-accent transition-colors"><path d="m15 18-6-6 6-6"/></svg>
                            </Link>
                        )}
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.inOut(2)'
                            scrollStart='center bottom+=50%'
                            scrollEnd='bottom bottom-=40%'
                            stagger={0.03}
                            textClassName="font-threat !leading-none"
                            containerClassName="text-left w-fit !my-0"
                        >
                            {"Projects"}
                        </ScrollFloat>
                    </div>

                    {/* Tabs Selector */}
                    <div className={`flex bg-[#080a0f] border border-accent/20 rounded-full p-1.5 shadow-[0_4px_14px_0_rgba(72,202,228,0.08)] ${isProjectsPage ? 'w-full' : 'w-fit'}`}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative py-3 md:py-3.5 rounded-full text-xs md:text-sm font-sans tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 md:gap-2.5 ${isProjectsPage ? 'flex-1' : 'px-5 md:px-6'} ${
                                    activeTab === tab.id ? 'text-[#080a0f] font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId={`active-tab-${isProjectsPage ? 'page' : 'section'}`}
                                        className="absolute inset-0 gradient-bg rounded-full"
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-2.5">
                                    {tab.icon}
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full relative mt-2 md:mt-4 min-h-[60vh] grid overflow-x-clip"> 
                    <AnimatePresence custom={direction}>
                        {activeTab === 'developer' ? (
                            <motion.div
                                key="developer"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="col-start-1 row-start-1 w-full"
                            >
                                <ScrollStack 
                                    useWindowScroll={true} 
                                    itemDistance={20} 
                                    itemScale={0.03} 
                                    baseScale={0.9} 
                                    stackPosition="15%" 
                                    scaleEndPosition="5%"
                                    itemStackDistance={30}
                                >
                                    {projectsData.map((project) => (
                                        <ScrollStackItem key={project.id} itemClassName="pb-4 sm:pb-8">
                                            <SpotlightCard 
                                                className="flex flex-col text-left rounded-[2rem] p-8 sm:p-10 shadow-2xl relative group overflow-hidden transition-all duration-300 w-full" 
                                                style={{ backgroundColor: '#080a0f', border: '1px solid var(--color-border)' }}
                                                spotlightColor="rgba(72, 202, 228, 0.15)"
                                            >
                                                <div className="relative z-10 flex flex-col w-full h-full min-h-[300px]">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 w-full">
                                                        <h3 className="text-3xl md:text-4xl font-bold text-white font-neutralfacebold tracking-wide leading-tight">{project.title}</h3>
                                                    </div>

                                                    <div className="text-base text-gray-400 font-sans tracking-wide mb-8">{project.category}</div>

                                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8 w-full">
                                                        {project.description}
                                                    </p>

                                                    <div className="mt-auto">
                                                        <div className="text-[12px] md:text-[13px] text-accent font-neutralface tracking-widest mb-4 uppercase">Tech Stack:</div>
                                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                            {project.tools.map((tech: any, idx: number) => (
                                                                <Pill key={idx} label={tech.label} icon={tech.icon} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SpotlightCard>
                                        </ScrollStackItem>
                                    ))}
                                </ScrollStack>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="designer"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="col-start-1 row-start-1 w-full"
                            >
                                <div className="flex flex-col gap-4 sm:gap-8 w-full pt-4">
                                    {designerProjectsData.map((project) => (
                                        <div key={project.id} className="pb-4 sm:pb-8 w-full">
                                            <SpotlightCard 
                                                className="flex flex-col text-left rounded-[2rem] p-8 sm:p-10 shadow-2xl relative group overflow-hidden transition-all duration-300 w-full" 
                                                style={{ backgroundColor: '#080a0f', border: '1px solid var(--color-border)' }}
                                                spotlightColor="rgba(72, 202, 228, 0.15)"
                                            >
                                                <div className="relative z-10 flex flex-col w-full h-full min-h-[300px]">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 w-full">
                                                        <h3 className="text-3xl md:text-4xl font-bold text-white font-neutralfacebold tracking-wide leading-tight">{project.title}</h3>
                                                    </div>

                                                    <div className="text-base text-gray-400 font-sans tracking-wide mb-8">{project.category}</div>

                                                    {(project as any).useLogoLoop ? (
                                                        <SimpleCarousel images={[
                                                            '/graphics/access/1.png',
                                                            '/graphics/access/2.png',
                                                            '/graphics/access/3.png',
                                                            '/graphics/access/4.png',
                                                            '/graphics/access/5.png',
                                                            '/graphics/access/6.png',
                                                            '/graphics/access/7.png',
                                                            '/graphics/access/8.png',
                                                            '/graphics/access/access mockups.png',
                                                            '/graphics/access/access variations.png',
                                                            '/graphics/access/access logo.png'
                                                        ]} />
                                                    ) : (
                                                        <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8 w-full">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="mt-auto">
                                                        <div className="text-[12px] md:text-[13px] text-accent font-neutralface tracking-widest mb-4 uppercase">Tech Stack:</div>
                                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                            {project.tools.map((tech: any, idx: number) => (
                                                                <Pill key={idx} label={tech.label} icon={tech.icon} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SpotlightCard>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {!hideViewMore && (
                    <div className="w-full flex justify-center pb-12 -mt-4 md:-mt-8 relative z-20 px-4 md:px-0">
                        <Link 
                            to="/projects" 
                            className="group/btn relative overflow-hidden rounded-[2rem] bg-[#080a0f] border border-accent/40 py-6 md:py-8 flex items-center justify-center transition-all duration-300 hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_40px_rgba(72,202,228,0.2)] w-full"
                        >
                            <span className="text-white font-semibold tracking-wider uppercase text-sm md:text-base z-10 relative font-sans">View More of my Projects</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProjectsSection;
