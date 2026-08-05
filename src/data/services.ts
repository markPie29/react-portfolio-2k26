import { ServiceItem } from '../types/content';

export const servicesData: ServiceItem[] = [
  {
    slug: 'graphic-design',
    title: 'GRAPHIC DESIGN',
    description:
      'Crafting compelling visual identities, marketing collateral, motion graphics, video editing, and digital media assets that elevate brand presence and resonate with target audiences.',
    bullets: [
      'Logo and Branding',
      'Video Editing & Motion Graphics',
      'Publication Materials',
      'Apparel Design',
      'Product & Email Ads',
    ],
    href: '/services/graphic-design',
  },
  {
    slug: 'software-development',
    title: 'SOFTWARE DEVELOPMENT',
    description:
      'Engineering robust, scalable web and mobile applications using modern frameworks, clean software architecture, and seamless user experiences.',
    bullets: [
      'Web and Mobile Applications',
      'Landing Pages',
      'POS and Inventory Systems',
      'HR Information Systems',
      'Custom Systems',
    ],
    href: '/services/software-development',
  },
  {
    slug: 'social-media-management',
    title: 'SOCIAL MEDIA MANAGEMENT',
    description:
      'Strategic brand growth, engaging multimedia content creation, and data-backed campaign management across digital platforms.',
    bullets: [
      'Content Strategy & Planning',
      'Visual Assets & Copywriting',
      'Audience Engagement',
      'Analytics & Reporting',
      'Campaign Execution',
    ],
    href: '/services/social-media-management',
  },
];
