import React from 'react';
import App from '../App';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import { ThemeProvider } from '../context/ThemeContext';

const HomePage = () => {
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
