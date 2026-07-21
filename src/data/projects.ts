import { ProjectItem } from '../types/content';

export const projectsData: ProjectItem[] = [
  {
    id: 'ursac-hub',
    title: 'URSAC Hub',
    category: 'Software Development',
    description:
      'A centralized platform for university students to purchase merch and access official announcements with an admin dashboard.',
    longDescription:
      'URSAC Hub is a comprehensive web portal designed for student body organizations. It streamlines merchandise ordering, announcement distribution, and event ticketing into a unified digital experience. Built with robust back-end capabilities and automated inventory tracking.',
    techStack: ['Laravel', 'Tailwind CSS', 'MySQL'],
    image: '/assets/projects/ursac-hub.jpg',
    images: [
      '/assets/projects/ursac-hub.jpg',
      '/assets/projects/ursac-hub-2.jpg',
      '/assets/projects/sk-logistics.jpg',
    ],
    features: [
      'E-commerce order placement & tracking for student merch',
      'Role-based admin management dashboard',
      'Real-time news & announcement push system',
      'Automated inventory and payment status updates',
    ],
    role: 'Lead Full-Stack Developer & Designer',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    href: '#',
  },
  {
    id: 'ursac-hub-2',
    title: 'URSAC Hub 2.0',
    category: 'Software Development',
    description:
      'A dedicated social network platform for university students featuring real-time messaging, feeds, and campus interaction.',
    longDescription:
      'The next iteration of URSAC Hub transforms static announcements into an interactive campus social network. Students can publish post feeds, join interest groups, chat in real-time, and stay connected with campus life.',
    techStack: ['React', 'Firebase', 'Tailwind CSS'],
    image: '/assets/projects/ursac-hub-2.jpg',
    images: [
      '/assets/projects/ursac-hub-2.jpg',
      '/assets/projects/ursac-hub.jpg',
      '/assets/projects/fintech.jpg',
    ],
    features: [
      'Real-time post feed with image attachments',
      'Instant messaging powered by Firebase Realtime DB',
      'Student profile customization & badge system',
      'Interactive campus event calendar',
    ],
    role: 'Frontend Architect & UI Designer',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    href: '#',
  },
  {
    id: 'sk-logistics',
    title: 'SK Logistics Fleet Portal',
    category: 'Software Development',
    description:
      'Enterprise-grade fleet and trip management system handling operational forms, dynamic roles, and dispatch logs.',
    longDescription:
      'SK Logistics Fleet Portal is an operational dispatch web application engineered for logistics management. It automates trip authorization, vehicle maintenance logs, driver scheduling, and live tracking stats.',
    techStack: ['React', 'Next.js', 'Supabase', 'Express'],
    image: '/assets/projects/sk-logistics.jpg',
    images: [
      '/assets/projects/sk-logistics.jpg',
      '/assets/projects/ursac-hub.jpg',
      '/assets/projects/arduino.jpg',
    ],
    features: [
      'Dynamic dispatch form generator & approval workflow',
      'Vehicle maintenance alert system & odometer tracking',
      'Driver assignment & trip scheduling calendar',
      'Exportable operational & financial reporting',
    ],
    role: 'Full-Stack Software Engineer',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    href: '#',
  },
  {
    id: 'arduino-ar',
    title: 'AR-DUINO Navigation & Sim',
    category: 'Software Development',
    description:
      'Augmented reality mobile application enabling interactive 3D Arduino electronic component simulations.',
    longDescription:
      'AR-DUINO is an immersive educational mobile app built with Unity and Vuforia. It allows engineering students to point their mobile camera at circuit diagrams to visualize interactive 3D Arduino components and circuit flows in real-time.',
    techStack: ['Unity', 'Vuforia', 'ARCore', 'C#'],
    image: '/assets/projects/arduino.jpg',
    images: [
      '/assets/projects/arduino.jpg',
      '/assets/projects/access.jpg',
      '/assets/projects/sk-logistics.jpg',
    ],
    features: [
      'Target image recognition & 3D model tracking',
      'Interactive component pinout guides & electrical simulation',
      'Step-by-step augmented reality tutorial modes',
      'Cross-platform mobile optimization',
    ],
    role: 'AR Developer & 3D Specialist',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    href: '#',
  },
  {
    id: 'access-branding',
    title: 'ACCESS Visual Identity',
    category: 'Graphic Design & Video Editing',
    description:
      'Comprehensive brand identity, event posters, marketing publication materials, and merchandise graphics.',
    longDescription:
      'A complete visual identity redesign for ACCESS organization. Encompassed custom typography guidelines, logo mark system, social media promotional banners, event posters, and apparel designs.',
    techStack: ['Photoshop', 'Illustrator', 'Canva'],
    image: '/assets/projects/access.jpg',
    images: [
      '/assets/projects/access.jpg',
      '/assets/projects/fintech.jpg',
      '/assets/projects/ursac-hub-2.jpg',
    ],
    features: [
      'Brand style guide & vector asset package',
      'Custom vector typography and iconography',
      'Print-ready event banners & merchandise designs',
      'Social media promotional template kit',
    ],
    role: 'Lead Graphic Designer',
    liveUrl: 'https://example.com',
    href: '#',
  },
  {
    id: 'fintech-ui',
    title: 'Fintech Dashboard & Brand Strategy',
    category: 'Social Media Management',
    description:
      'UI/UX design and social campaign strategy for an analytics fintech dashboard with data visualization.',
    longDescription:
      'An end-to-end design project featuring modern financial data dashboard UI/UX coupled with a targeted social media marketing rollout. Includes interactive chart design, light/dark mode design tokens, and promotional carousel posts.',
    techStack: ['Figma', 'React', 'Illustrator'],
    image: '/assets/projects/fintech.jpg',
    images: [
      '/assets/projects/fintech.jpg',
      '/assets/projects/access.jpg',
      '/assets/projects/sk-logistics.jpg',
    ],
    features: [
      'High-fidelity interactive prototype in Figma',
      'Responsive design system & component library',
      'Social media content strategy & visual grid layout',
      'Data visualization UX optimization',
    ],
    role: 'UI/UX & Social Media Strategist',
    liveUrl: 'https://example.com',
    href: '#',
  },
];
