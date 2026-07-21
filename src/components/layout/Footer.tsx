import React from 'react';
import { socialsData } from '../../data/socials';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="w-full bg-transparent text-white py-12 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-neutralfacebold text-2xl md:text-3xl text-white tracking-wide">
            Marky Isulat
          </h3>
          <p className="text-xs md:text-sm text-gray-400 tracking-wider mt-1 uppercase font-helvetica-neue-medium">
            GRAPHIC DESIGN & VIDEO EDITING - SOFTWARE DEVELOPMENT - SOCIAL MEDIA MANAGEMENT
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialsData.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent text-xl transition-colors"
              aria-label={s.label}
            >
              <i className={s.iconClass}></i>
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Mark Angelo Isulat. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed & Engineered with React + Tailwind + GSAP</p>
      </div>
    </footer>
  );
};

export default Footer;
