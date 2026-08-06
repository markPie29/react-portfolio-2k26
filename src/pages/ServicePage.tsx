import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import FadeContent from '../../components/FadeContent';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';
import GraphicsBento from '../components/services/GraphicsBento';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/home/ProjectModal';
import { fetchProjects } from '../services/projectService';
import { ProjectItem } from '../types/content';
import { serviceSlugToCategory, projectMatchesCategory } from '../utils/categoryFilter';
import { ArrowLeft, CheckCircle2, Send, ArrowRight } from 'lucide-react';

const ServicePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchProjects().then((data) => {
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    });
  }, []);

  const service = servicesData.find(
    (s) =>
      s.slug === slug ||
      (slug === 'graphic-design-video-editing' && s.slug === 'graphic-design')
  );

  const serviceProjects = useMemo(() => {
    if (!service) return [];
    const filterCategory = serviceSlugToCategory(service.slug);
    const matches = projectsList.filter((p) => projectMatchesCategory(p, filterCategory));

    const featured = matches.filter((p) => p.isFeatured);
    const nonFeatured = matches.filter((p) => !p.isFeatured);

    return [...featured, ...nonFeatured].slice(0, 3);
  }, [projectsList, service]);

  const scrollToInquiry = () => {
    const element = document.getElementById('inquiry');
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -80 });
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (location.hash === '#inquiry' || location.hash === '#cta') {
      const element = document.getElementById('inquiry');
      if (element) {
        setTimeout(() => {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(element, { offset: -80 });
          } else {
            const top = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [slug, location.hash]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-transparent text-foreground">
        <div className="max-w-4xl mx-auto px-6 pt-40 pb-20 text-center flex-grow flex flex-col items-center justify-center">
          <h1 className="font-neutralfacebold text-3xl sm:text-4xl mb-4">SERVICE NOT FOUND</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The requested service does not exist.</p>
          <button
            onClick={() => navigate('/')}
            className="gradient-bg text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col pt-28">
      <main className="flex-grow w-full px-6 md:px-12 lg:px-24 py-12">
        {/* Service Details */}
        <FadeContent blur duration={1} ease="power3.out" delay={0.1} once>
          <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
            {/* Header: Sub-label & Title with Top CTA Button */}
            <div className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="font-mono text-xs sm:text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">
                  SERVICES
                </p>
                <h1 className="font-neutralfacebold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.95] text-gray-900 dark:text-white">
                  {service.title}
                </h1>
              </div>

              {/* Centered Action CTA Button in Header Container */}
              <div className="flex items-center justify-center shrink-0 self-center">
                <button
                  onClick={scrollToInquiry}
                  className="gradient-bg text-white font-neutralfacebold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-lg shadow-sky-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>INQUIRE</span>
                </button>
              </div>
            </div>

            {/* Vertical Stacked Content */}
            <div className="flex flex-col gap-8 sm:gap-10">
              {/* 1. Description Text */}
              <div>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-normal max-w-4xl">
                  {service.description}
                </p>
              </div>

              {/* 2. Key Capabilities & Scope Block */}
              <div className="bg-white/80 dark:bg-[#080a0f]/40 border border-slate-200 dark:border-[#48cae4]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                  KEY CAPABILITIES & SCOPE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {service.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Featured Projects Showcase Section (Max 3 projects for this service) */}
              {serviceProjects.length > 0 && (
                <div className="flex flex-col gap-6 pt-4 pb-2">
                  <div className="flex flex-row items-center justify-between gap-4">
                    <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      FEATURED PROJECTS ({serviceProjects.length})
                    </h3>
                    <Link
                      to={`/projects?category=${service.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider group"
                    >
                      <span>VIEW MORE</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => setSelectedProject(project)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeContent>

        {/* Project Detail Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Graphics Bento Gallery (only for graphic design service) */}
        {service.slug === 'graphic-design' && <GraphicsBento />}

        {/* CTA section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
