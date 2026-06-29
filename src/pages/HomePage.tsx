import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from '../App';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import { ThemeProvider } from '../context/ThemeContext';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      // Slight delay to ensure the DOM is ready if we just navigated from another page
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <ThemeProvider>
        <App />
      </ThemeProvider>

      <ThemeProvider>
        <AboutSection />
      </ThemeProvider>

      <ThemeProvider>
        <ExperienceSection />
      </ThemeProvider>

      <ThemeProvider>
        <ProjectsSection />
      </ThemeProvider>

      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default HomePage;
