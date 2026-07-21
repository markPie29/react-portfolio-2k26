export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating: number;
  projectType: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'CEO & Founder',
    company: 'Vanguard Tech',
    quote:
      'Marky transformed our brand identity and web platform into something truly extraordinary. His eye for detail in design and seamless frontend code exceeded all our expectations.',
    rating: 5,
    projectType: 'Web App & Branding',
  },
  {
    id: '2',
    name: 'Sophia Chen',
    role: 'Product Lead',
    company: 'Nexus Creative Studio',
    quote:
      'Working with Marky was an absolute breeze. He delivered a fast, highly interactive UI ahead of deadline with exceptional animation polish.',
    rating: 5,
    projectType: 'Frontend Development',
  },
  {
    id: '3',
    name: 'Marcus Brody',
    role: 'Marketing Director',
    company: 'Elevate Media',
    quote:
      'The graphics and UI redesign Marky crafted drastically increased our user engagement and conversion rates. Truly a top-tier designer and developer.',
    rating: 5,
    projectType: 'Graphic Design & Social Media',
  },
];
