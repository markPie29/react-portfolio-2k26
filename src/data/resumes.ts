export interface ResumeOption {
  id: string;
  title: string;
  roleSubtitle: string;
  icon: string; // Boxicons class name
  filePath: string;
  fileName: string;
}

export const RESUME_OPTIONS: ResumeOption[] = [
  {
    id: 'developer',
    title: 'Full-Stack Developer',
    roleSubtitle: 'Software Engineering & Web Apps',
    icon: 'bx-code-alt',
    filePath: '/Mark_Isulat_Developer_Resume.pdf',
    fileName: 'Mark_Isulat_Developer_Resume.pdf',
  },
  {
    id: 'designer',
    title: 'Multimedia Designer & SMM',
    roleSubtitle: 'UI/UX, Visual Branding & Social Media',
    icon: 'bx-palette',
    filePath: '/Mark_Isulat_Designer_Resume.pdf',
    fileName: 'Mark_Isulat_Designer_Resume.pdf',
  },
];
