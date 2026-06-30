import React from 'react';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';

const ProjectsPage = () => {
  return (
    <>
      {/* Content wrapper to match the padding from App structure if needed,
          ProjectsSection handles its own padding. We'll just push it down slightly 
          so it's not hidden behind the header if scrolled. 
          Actually ProjectsSection already has pt-12 md:pt-16. Let's increase it a bit for the standalone page. */}
      <div className="relative z-10 pt-20">
        <ProjectsSection hideViewMore={true} isProjectsPage={true} />
        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage;
