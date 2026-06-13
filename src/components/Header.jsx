import StaggeredMenu from './StaggeredMenu';

const Header = () => {
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

  // return (
  //   <StaggeredMenu
  //     position="right"
  //     items={menuItems}
  //     socialItems={socialItems}
  //     displaySocials
  //     displayItemNumbering={true}
  //     menuButtonColor="#48cae4"
  //     openMenuButtonColor="#000000"
  //     changeMenuColorOnOpen={true}
  //     colors={['#B497CF', '#5227FF']}
  //     logoUrl="/public/main-icon.svg"
  //     accentColor="#48cae4"
  //     onMenuOpen={() => console.log('Menu opened')}
  //     onMenuClose={() => console.log('Menu closed')}
  //     isFixed
  //   />
  // )
}

export default Header
