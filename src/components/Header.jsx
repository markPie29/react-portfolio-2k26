import StaggeredMenu from '../../components/StaggeredMenu';

import { useTheme } from '../context/ThemeContext.jsx';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home section', link: '#home' },
    { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
    { label: 'Projects', ariaLabel: 'View featured projects', link: '#projects' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  const isDark = theme === 'dark';
  const menuButtonColor = isDark ? '#48cae4' : '#0077b6';
  const accentColor = isDark ? '#48cae4' : '#0077b6';

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 left-6 z-50 p-2 rounded-full transition-all duration-300"
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
      <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering={true}
        menuButtonColor={menuButtonColor}
      openMenuButtonColor="#000000"
      changeMenuColorOnOpen={true}
      colors={['#B497CF', '#5227FF']}
      logoUrl="/public/main-icon.svg"
        accentColor={accentColor}
      onMenuOpen={() => console.log('Menu opened')}
      onMenuClose={() => console.log('Menu closed')}
      isFixed
    />
    </div>
  )
}

export default Header
