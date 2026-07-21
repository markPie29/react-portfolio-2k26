import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
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
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Tagline Strip (Top: Right to Left) */}
      <TaglineStrip direction="left" speed={45} />

      {/* 4. Stats Section */}
      <StatsSection />

      {/* 5. Tagline Strip (Bottom: Left to Right) */}
      <TaglineStrip direction="right" speed={45} />

      {/* 6. Tech Stack Section */}
      <TechStackSection />

      {/* 7. Services Section */}
      <ServicesSection />

      {/* 8. Featured Works Section */}
      <FeaturedWorksSection />

      {/* 9. CTA Section */}
      <CtaSection />

      {/* 10. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
