import React from 'react';
import ScrollFloat from "../../components/ScrollFloat";
import SpotlightCard from './SpotlightCard';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { SiReact, SiNextdotjs, SiTailwindcss, SiLaravel, SiFirebase, SiExpress, SiSupabase, SiUnity } from 'react-icons/si';

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
                <div className="w-full relative mt-2 md:mt-4"> 
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
                                        </div>

                                        <div className="text-base text-gray-400 font-sans tracking-wide mb-8">{project.category}</div>

                                        <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8 w-full">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-col gap-3 mb-10 w-full">
                                            <div className="text-[12px] md:text-[13px] text-accent font-neutralface tracking-widest uppercase">Key Contributions:</div>
                                            <ul className="text-gray-300 leading-relaxed text-sm md:text-base list-disc list-outside ml-4 space-y-2">
                                                {project.keyContributions.map((contribution, idx) => (
                                                    <li key={idx} className="pl-2 marker:text-accent/70">{contribution}</li>
                                                ))}
                                            </ul>
                                        </div>

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

                <div className="-mt-[18vh] md:-mt-[24vh] w-full flex justify-center pb-12 relative z-20 px-4 md:px-0">
                    <a 
                        href="#" 
                        className="group/btn relative overflow-hidden rounded-[2rem] bg-[#080a0f] border border-accent/40 py-6 md:py-8 flex items-center justify-center transition-all duration-300 hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_40px_rgba(72,202,228,0.2)] w-full"
                    >
                        <span className="text-white font-semibold tracking-wider uppercase text-sm md:text-base z-10 relative font-sans">View More of my Projects</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ProjectsSection;
