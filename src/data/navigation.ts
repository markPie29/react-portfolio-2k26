import { NavLink } from '../types/content';

export const navigationData: NavLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'WORKS', href: '/projects' },
  {
    label: 'SERVICES',
    href: '/#services',
    sublinks: [
      { label: 'GRAPHIC DESIGN', href: '/services/graphic-design' },
      { label: 'SOFTWARE DEVELOPMENT', href: '/services/software-development' },
      { label: 'SOCIAL MEDIA MANAGEMENT', href: '/services/social-media-management' }
    ]
  },
  { label: 'INQUIRY', href: '/#cta' }
];
