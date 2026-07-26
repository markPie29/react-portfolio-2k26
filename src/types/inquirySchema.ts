import { z } from 'zod';

export const PROJECT_TYPE_OPTIONS = [
  { id: 'graphic-design', label: 'Graphic Design', icon: 'bx-paint', description: 'Branding, marketing graphics, video editing & visual media' },
  { id: 'software', label: 'Software', icon: 'bx-code-alt', description: 'Web apps, custom software, dashboards & UI/UX engineering' },
  { id: 'social-media', label: 'Social Media', icon: 'bx-share-alt', description: 'Content management, social graphics & online strategy' }
] as const;

// Zod validation schema for Step 1 (Contact Info)
export const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name is required (at least 2 characters)')
    .max(100, 'Full name cannot exceed 100 characters'),
  company: z.string().max(200, 'Company name cannot exceed 200 characters').optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(150, 'Email address is too long'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === '' || /^[\d\s+\-()]{7,25}$/.test(val),
      { message: 'Invalid phone number format (e.g. +63 912 345 6789)' }
    ),
  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          const urlToTest = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
          new URL(urlToTest);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid URL format (e.g. example.com or https://example.com)' }
    )
});

// Zod validation schema for Step 2 (Project Type & Description)
export const step2Schema = z.object({
  projectType: z.string().min(1, 'Please select a type of project'),
  description: z
    .string()
    .min(15, 'Please provide a project description (at least 15 characters)')
    .max(5000, 'Description exceeds 5,000 character limit')
});

// Combined 2-step schema
export const projectInquirySchema = step1Schema.merge(step2Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type ProjectInquiryFormData = z.infer<typeof projectInquirySchema>;
