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
    liveUrl: '',
    githubUrl: '',
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
    liveUrl: '',
    githubUrl: '',
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
    liveUrl: '',
    githubUrl: '',
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
    liveUrl: '',
    githubUrl: '',
    href: '#',
  },
  {
    id: 'access-branding',
    title: 'ACCESS Visual Identity',
    category: 'Graphic Design',
    description:
      'Comprehensive brand identity, event posters, publication graphics, and merchandise artwork for campus organizations.',
    longDescription:
      'A complete visual identity redesign for ACCESS organization. Encompassed custom vector typography guidelines, logo mark system, social media promotional banners, event posters, and apparel designs.',
    techStack: ['Canva', 'Illustrator', 'Photoshop'],
    image: '/graphics/access/1.png',
    images: [
      '/graphics/access/1.png',
      '/graphics/access/2.png',
      '/graphics/access/3.png',
      '/graphics/access/4.png',
      '/graphics/access/5.png',
      '/graphics/access/6.png',
      '/graphics/access/7.png',
      '/graphics/access/8.png',
      '/graphics/access/access mockups.png',
      '/graphics/access/access variations.png',
      '/graphics/access/access logo.png',
    ],
    features: [
      'Brand style guide & vector asset package',
      'Custom vector typography and iconography',
      'Print-ready event banners & merchandise designs',
      'Social media promotional template kit',
    ],
    role: 'Lead Graphic Designer',
    liveUrl: '',
    href: '#',
  },
  {
    id: 'access-video',
    title: 'Campaign Reels & Motion Edits',
    category: 'Video Editing',
    description:
      'High-impact event trailers, promotional video edits, motion graphic intros, and social media reels.',
    longDescription:
      'Dynamic video production and post-processing for campus events and organization campaigns. Includes color grading, custom motion graphic transitions, kinetic typography, and synchronized sound design.',
    techStack: ['Premiere Pro', 'After Effects', 'Photoshop'],
    image: '/graphics/access/access mockups.png',
    images: [
      '/graphics/access/access mockups.png',
      '/graphics/access/4.png',
      '/graphics/access/5.png',
    ],
    features: [
      'High-tempo promotional event teaser trailers',
      'Custom kinetic typography & title graphics',
      'Audio mixing & beat-synced video editing',
      'Multi-platform video export presets (IG Reels, TikTok, FB Video)',
    ],
    role: 'Video Editor & Motion Designer',
    liveUrl: '',
    href: '#',
  },
  {
    id: 'fintech-social',
    title: 'Fintech Social Campaign',
    category: 'Social Media Management',
    description:
      'End-to-end digital social media marketing campaigns, visual grid planning, content scheduling, and engagement strategy.',
    longDescription:
      'An integrated social media strategy and visual content management project for financial technology initiatives. Designed carousel infographics, engagement posts, and brand launch announcement schedules.',
    techStack: ['Figma', 'Illustrator', 'Canva', 'Buffer'],
    image: '/graphics/access/access variations.png',
    images: [
      '/graphics/access/access variations.png',
      '/graphics/access/2.png',
      '/graphics/access/3.png',
    ],
    features: [
      'Cohesive Instagram/FB grid design & content layout',
      'Data-driven engagement tracking & audience insights',
      'Carousel infographics & promotional slide decks',
      'Brand launch strategy & editorial calendar',
    ],
    role: 'Social Media Manager & Strategist',
    liveUrl: '',
    href: '#',
  },
  {
    id: 'mobile-app-design',
    title: 'Mobile App UI/UX Design',
    category: 'Graphic Design',
    description:
      'User interface and user experience design for modern mobile applications with interactive Figma prototypes.',
    longDescription:
      'End-to-end UI/UX design project for a mobile application focusing on intuitive user journeys, high-contrast dark theme components, micro-interactions, and comprehensive design tokens.',
    techStack: ['Figma', 'Framer', 'Illustrator'],
    image: '/graphics/access/7.png',
    images: [
      '/graphics/access/7.png',
      '/graphics/access/8.png',
    ],
    features: [
      'Wireframing & interactive clickable prototypes',
      'Atomic design component library in Figma',
      'Usability testing & navigation flow optimization',
    ],
    role: 'UI/UX Designer',
    liveUrl: '',
    href: '#',
  }
];
