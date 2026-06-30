import React, { useState, useEffect } from 'react';
import SideRays from '../../components/SIdeRays';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const rayColor = isDark ? '#00b4d8' : '#0077b6';

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
    </>
  );
};

export default Layout;
