import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { navigationData } from '../../data/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAdminPage) return;

    const handleScroll = () => {
      const scrollPos = (window as any).lenis?.scroll ?? window.scrollY;
      setScrolled(scrollPos > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    if ((window as any).lenis) {
      (window as any).lenis.on('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if ((window as any).lenis) {
        (window as any).lenis.off('scroll', handleScroll);
      }
    };
  }, [isAdminPage]);

  if (isAdminPage) {
    return null;
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (href.startsWith('/')) {
      const [pathname, hash] = href.split('#');
      const targetPath = pathname || '/';

      if (location.pathname !== targetPath) {
        navigate(href);
      } else if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(element, { offset: -80 });
          } else {
            const top = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      } else {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(element, { offset: -80 });
        } else {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'opacity-100 translate-y-0 pointer-events-auto bg-white/85 dark:bg-[#080A0F]/85 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm dark:shadow-md py-4'
          : 'opacity-0 -translate-y-full pointer-events-none py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="font-neutralfacebold text-xl md:text-2xl tracking-tight gradient-text hover:opacity-85 transition-opacity"
        >
          MARKY
        </a>

        {/* Center Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationData.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs md:text-sm font-semibold tracking-wider text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-accent transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Button & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="#cta"
            onClick={(e) => handleNavClick(e, '#cta')}
            className="gradient-bg text-white hover:brightness-110 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-sky-500/20"
          >
            LETS WORK
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-900 dark:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#080A0F] border-b border-gray-200 dark:border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navigationData.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-neutralfacebold text-gray-800 dark:text-gray-200 hover:text-accent tracking-wider uppercase py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={(e) => handleNavClick(e, '#cta')}
                className="mt-2 text-center gradient-bg text-white hover:brightness-110 font-bold py-3 rounded-full uppercase tracking-wider text-xs shadow-md shadow-sky-500/20 transition-all"
              >
                LETS WORK
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
