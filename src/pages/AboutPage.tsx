import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutHeroHeader from '../components/about/AboutHeroHeader';
import StatsSection from '../components/home/StatsSection';
import TechStackSection from '../components/home/TechStackSection';
import CredentialsSection from '../components/about/CredentialsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';

const AboutPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(element, { immediate: true, offset: -headerOffset });
          } else {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'instant' as ScrollBehavior,
            });
          }
        }
      });
    } else {
      window.scrollTo(0, 0);
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [location]);

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col">
      {/* 1. Hero Header with Resume / Works Buttons & Infinite Logo Loop Strip */}
      <AboutHeroHeader />

      {/* 2. Tech Stack Box (Developer & Designer Skills Pills) */}
      <TechStackSection />

      {/* 3. Credentials Section (Experience & Certificates Split) */}
      <CredentialsSection />

      {/* 4. Testimonials Section */}
      <TestimonialsSection />

      {/* 5. Stats Grid (10+ Brands, 20+ Clients, 5+ Software Shipped, 3yr+ Experience) - Moved below Testimonials */}
      <StatsSection />

      {/* 6. Let's Work Together CTA */}
      <CtaSection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
