import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollFloat from '../../components/ScrollFloat';
import AnimatedContent from '../../components/AnimatedContent';

const dummyExperience = [
  {
    id: 1,
    role: "Senior UI/UX Designer",
    company: "Tech Innovators Inc.",
    date: "2024 - Present",
    description: "Leading the design team to create user-centric and visually stunning interfaces for web and mobile applications. Collaborating closely with developers to ensure seamless implementation of design systems.",
    side: "left",
  },
  {
    id: 2,
    role: "Frontend Developer",
    company: "Creative Web Agency",
    date: "2022 - 2024",
    description: "Developed responsive and interactive web applications using React, Tailwind CSS, and Framer Motion. Implemented complex animations and state management solutions.",
    side: "right",
  },
  {
    id: 3,
    role: "Multimedia Designer",
    company: "Studio Design",
    date: "2020 - 2022",
    description: "Created engaging motion graphics, promotional videos, and brand identities for various clients. Handled end-to-end production from storyboarding to final render.",
    side: "left",
  },
  {
    id: 4,
    role: "Junior Web Developer",
    company: "StartUp Hub",
    date: "2018 - 2020",
    description: "Assisted in building functional prototypes and maintaining existing web platforms. Gained hands-on experience in modern web development practices and version control.",
    side: "right",
  }
];

const ExperienceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative z-10 py-24 px-6 md:px-12 lg:px-24 min-h-screen" ref={containerRef}>
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center mb-16">
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
            textClassName="font-threat text-4xl md:text-5xl lg:text-6xl text-center !leading-none"
          >
            Experience
          </ScrollFloat>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* Central Line Background */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-800 rounded-full md:block hidden"></div>
          
          {/* Animated Central Line Foreground */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-accent rounded-full origin-top md:block hidden shadow-[0_0_15px_rgba(72,202,228,0.5)] z-0"
            style={{ scaleY }}
          ></motion.div>

          <div className="flex flex-col gap-12 relative z-10">
            {dummyExperience.map((exp) => (
              <div key={exp.id} className={`flex flex-col md:flex-row items-center justify-between w-full ${exp.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Empty Space for the other side */}
                <div className="hidden md:block md:w-[45%]"></div>
                
                {/* Center Node / Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-bg z-20 hidden md:block">
                  <motion.div
                    className="w-full h-full bg-white rounded-full opacity-50 animate-ping"
                  />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-[45%]">
                  <AnimatedContent
                    distance={80}
                    direction="horizontal"
                    reverse={exp.side === 'left'}
                    duration={1}
                  >
                    <div className="p-6 md:p-8 rounded-2xl bg-[#080a0f]/60 border border-accent/20 backdrop-blur-md shadow-[0_4px_20px_rgba(72,202,228,0.05)] hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(72,202,228,0.1)] transition-all duration-300">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-helvetica-neue-medium">{exp.role}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <span className="text-accent font-semibold">{exp.company}</span>
                        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full w-fit">{exp.date}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {exp.description}
                      </p>
                    </div>
                  </AnimatedContent>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
