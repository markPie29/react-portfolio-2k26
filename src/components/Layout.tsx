import React, { useState, useEffect } from 'react';
import SideRays from '../../components/SIdeRays';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'motion/react';
import LoadingScreen from './LoadingScreen';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const rayColor = isDark ? '#00b4d8' : '#0077b6';

  useEffect(() => {
    // Wait for fonts to be ready
    document.fonts.ready.then(() => {
      // Artificial delay for premium feel
      setTimeout(() => {
        setIsLoaded(true);
      }, 800);
    });
  }, []);

  useEffect(() => {
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

      <AnimatePresence>
        {!isLoaded && <LoadingScreen />}
      </AnimatePresence>

      {/* Render Header and Page Content only when loaded */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Header */}
          <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
              showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
            }`}
          >
            <Header isHidden={!showHeader} />
          </div>

          {/* Page Content */}
          <div className="relative z-10 w-full">
            {children}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Layout;
