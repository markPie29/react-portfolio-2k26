import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero';
import TaglineStrip from '../components/home/TaglineStrip';
import StatsSection from '../components/home/StatsSection';
import TechStackSection from '../components/home/TechStackSection';
import ServicesSection from '../components/home/ServicesSection';
import FeaturedWorksSection from '../components/home/FeaturedWorksSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash && location.pathname === '/') {
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
    }
  }, [location]);

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Tagline Strip (Top: Right to Left) */}
      <TaglineStrip direction="left" speed={45} />

      {/* 3. Stats Section */}
      <StatsSection />

      {/* 4. Tagline Strip (Bottom: Left to Right) */}
      <TaglineStrip direction="right" speed={45} />

      {/* 5. Tech Stack Section */}
      <TechStackSection />

      {/* 6. Services Section */}
      <ServicesSection />

      {/* 7. Featured Works Section */}
      <FeaturedWorksSection />

      {/* 8. CTA Section */}
      <CtaSection />

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
