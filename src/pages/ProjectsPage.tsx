import React, { useState, useEffect } from 'react';
import SideRays from '../../components/SIdeRays';
import Header from '../components/Header';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { ThemeProvider } from '../context/ThemeContext';

const ProjectsPageContent = () => {
  const [showHeader, setShowHeader] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const rayColor = isDark ? '#00b4d8' : '#0077b6';

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      setShowHeader(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed background — stays behind everything while scrolling */}
      <div className="fixed inset-0 z-0 bg-bg">
        <SideRays
          speed={2.5}
          rayColor1={rayColor}
          rayColor2={rayColor}
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1}
        />
        {/* Gradient overlay to ensure the bottom always fades to the background color */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent pointer-events-none" />
      </div>

      {/* Header */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <Header />
      </div>

      {/* Content wrapper to match the padding from App structure if needed,
          ProjectsSection handles its own padding. We'll just push it down slightly 
          so it's not hidden behind the header if scrolled. 
          Actually ProjectsSection already has pt-12 md:pt-16. Let's increase it a bit for the standalone page. */}
      <div className="relative z-10 pt-20">
        <ProjectsSection hideViewMore={true} />
        <Footer />
      </div>
    </>
  );
};

const ProjectsPage = () => {
  return (
    <ThemeProvider>
      <ProjectsPageContent />
    </ThemeProvider>
  );
};

export default ProjectsPage;
