import React from 'react';
import ScrollFloat from "../../components/ScrollFloat";
import SpotlightCard from './SpotlightCard';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { SiReact, SiNextdotjs, SiTailwindcss, SiFigma } from 'react-icons/si';

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
    title: "E-Commerce Platform Redesign",
    category: "Full Stack Development",
    date: "2025",
    description: "A complete overhaul of a modern e-commerce platform focusing on performance and user experience. Implemented a seamless checkout flow and optimized product loading times.",
    tools: [
      { label: "Next.js", icon: <SiNextdotjs /> },
      { label: "React", icon: <SiReact /> },
      { label: "Tailwind", icon: <SiTailwindcss /> }
    ]
  },
  {
    id: 2,
    title: "Logistics Dashboard",
    category: "UI/UX & Frontend",
    date: "2025",
    description: "Designed and developed an intuitive dashboard for a logistics company, providing real-time tracking, analytics, and driver management interfaces.",
    tools: [
      { label: "React", icon: <SiReact /> },
      { label: "Tailwind", icon: <SiTailwindcss /> },
      { label: "Figma", icon: <SiFigma /> }
    ]
  },
  {
    id: 3,
    title: "Creative Agency Portfolio",
    category: "Frontend Development",
    date: "2024",
    description: "A visually stunning portfolio for a creative agency featuring high-end animations, smooth scrolling, and custom interactive 3D elements.",
    tools: [
      { label: "React", icon: <SiReact /> },
      { label: "Tailwind", icon: <SiTailwindcss /> }
    ]
  }
];

const ProjectsSection = () => {
    return (
        <section id="projects" className="relative z-10 pt-12 md:pt-16 pb-24 px-6 md:px-12 lg:px-24 min-h-screen">
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
                        {"Projects"}
                    </ScrollFloat>
                </div>

                {/* Using an extra wrapper to ensure proper spacing for the scroll stack to trigger */}
                <div className="w-full relative mt-2 md:mt-4 h-[150vh]"> 
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
                            <ScrollStackItem key={project.id} itemClassName="!my-0 !p-0 !bg-transparent !h-auto !shadow-none !rounded-none pb-12">
                                <SpotlightCard 
                                    className="flex flex-col text-left rounded-[2rem] p-8 sm:p-10 shadow-2xl relative group overflow-hidden transition-all duration-300 w-full" 
                                    style={{ backgroundColor: '#080a0f', border: '1px solid var(--color-border)' }}
                                    spotlightColor="rgba(72, 202, 228, 0.15)"
                                >
                                    <div className="relative z-10 flex flex-col w-full h-full min-h-[300px]">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 w-full">
                                            <h3 className="text-3xl md:text-4xl font-bold text-white font-neutralfacebold tracking-wide leading-tight">{project.title}</h3>
                                            <div className="text-sm md:text-base text-accent font-sans font-semibold whitespace-nowrap pt-2 tracking-wide">{project.date}</div>
                                        </div>

                                        <div className="text-base text-gray-400 font-sans tracking-wide mb-8">{project.category}</div>

                                        <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-10 max-w-3xl">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-col gap-3 mt-auto">
                                            <div className="text-[11px] text-gray-400 font-neutralface tracking-widest uppercase">Tech Stack:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tools.map((tool: any, idx: number) => (
                                                    <Pill key={idx} label={tool.label} icon={tool.icon} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>
            </div>
        </section>
    )
}

export default ProjectsSection;
