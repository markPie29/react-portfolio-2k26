import React from 'react';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/layout/Footer';

const ProjectsPage = () => {
  return (
    <div className="relative z-10 pt-20 bg-transparent text-foreground flex flex-col min-h-screen">
      <ProjectsSection isProjectsPage={true} />
      <Footer />
    </div>
  );
};

export default ProjectsPage;
