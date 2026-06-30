import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from '../App';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const id = location.hash.substring(1);
      // Use requestAnimationFrame to ensure the DOM is painted
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80; // Approximate header height to avoid overlap
          
          if ((window as any).lenis) {
            // If Lenis is available, use it for immediate offset scroll
            (window as any).lenis.scrollTo(element, { immediate: true, offset: -headerOffset });
          } else {
            // Fallback for native immediate scrolling
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'instant' as ScrollBehavior // 'instant' or 'auto'
            });
          }
        }
      });
    }
  }, [location]);

  return (
    <>
      <App />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <Footer />
    </>
  );
};

export default HomePage;
