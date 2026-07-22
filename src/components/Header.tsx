import { useTheme } from '../context/ThemeContext';

import StaggeredMenu from './StaggeredMenu';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about me', link: '/about' },
  { label: 'Experience', ariaLabel: 'View my experience', link: '/about#credentials' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '/projects' },
  { label: 'Inquiry', ariaLabel: 'Project inquiry & discovery', link: '/#cta' }
];

const socialItems = [
  { label: 'Facebook', link: 'https://facebook.com/markPie29' },
  { label: 'GitHub', link: 'https://github.com/markPie29' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/mark-angelo-isulat-1954a2335/?skipRedirect=true' },
  { label: 'Discord', link: 'https://discordapp.com/users/399221201383325706' }
];

const Header = ({ isHidden = false }: { isHidden?: boolean }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative pointer-events-none">
      <button
        onClick={toggleTheme}
        className={`absolute top-6 left-6 z-50 p-2 rounded-full transition-all duration-300 ${isHidden ? '' : 'pointer-events-auto'}`}
        style={{
          backgroundColor: isDark ? 'rgba(72, 202, 228, 0.1)' : 'rgba(0, 119, 182, 0.1)',
          color: isDark ? '#48cae4' : '#0077b6'
        }}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Staggered Menu */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor={isDark ? "#48cae4" : "#0077b6"}
        openMenuButtonColor={isDark ? "#48cae4" : "#0077b6"}
        changeMenuColorOnOpen={true}
        colors={isDark ? ['#0077b6', '#0096c7', '#00b4d8', '#48cae4'] : ['#90e0ef', '#48cae4', '#00b4d8', '#0096c7']}
        accentColor={isDark ? "#48cae4" : "#0077b6"}
        isFixed={true}
        isHidden={isHidden}
        onMenuOpen={() => {
          document.body.style.overflow = 'hidden';
          if ((window as any).lenis) (window as any).lenis.stop();
        }}
        onMenuClose={() => {
          document.body.style.overflow = '';
          if ((window as any).lenis) (window as any).lenis.start();
        }}
      />
    </div>
  )
}

export default Header
