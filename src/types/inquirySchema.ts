import { z } from 'zod';

export const SERVICES_OPTIONS = [
  { id: 'custom-software', label: 'Custom Software', icon: 'bx-code-alt' },
  { id: 'website-dev', label: 'Website Development', icon: 'bx-globe' },
  { id: 'hris', label: 'HRIS', icon: 'bx-user-check' },
  { id: 'payroll', label: 'Payroll', icon: 'bx-dollar-circle' },
  { id: 'pos', label: 'POS', icon: 'bx-cart' },
  { id: 'inventory', label: 'Inventory', icon: 'bx-package' },
  { id: 'scheduling', label: 'Scheduling', icon: 'bx-calendar' },
  { id: 'ui-ux', label: 'UI/UX', icon: 'bx-palette' },
  { id: 'web-design', label: 'Web Design', icon: 'bx-layout' },
  { id: 'graphic-design', label: 'Graphic Design', icon: 'bx-paint' },
  { id: 'motion-design', label: 'Motion Design', icon: 'bx-video' },
  { id: 'video-editing', label: 'Video Editing', icon: 'bx-movie-play' },
  { id: 'other', label: 'Other', icon: 'bx-dots-horizontal-rounded' }
] as const;

export const BUDGET_OPTIONS = [
  { id: 'under-20k', label: 'Under ₱20,000' },
  { id: '20k-50k', label: '₱20,000 – ₱50,000' },
  { id: '50k-100k', label: '₱50,000 – ₱100,000' },
  { id: '100k-250k', label: '₱100,000 – ₱250,000' },
  { id: '250k-plus', label: '₱250,000+' }
] as const;

export const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'ASAP' },
  { id: 'within-1-month', label: 'Within 1 Month' },
  { id: '1-3-months', label: '1–3 Months' },
  { id: '3-6-months', label: '3–6 Months' },
  { id: 'flexible', label: 'Flexible' }
] as const;

export const PROJECT_TYPE_OPTIONS = [
  { id: 'new-project', label: 'New Project' },
  { id: 'existing-improvements', label: 'Existing Improvements' },
  { id: 'redesign', label: 'Redesign' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'consultation', label: 'Consultation' }
] as const;

export const FEATURE_CHIPS_OPTIONS = [
  'Authentication',
  'Dashboard',
  'User Management',
  'Inventory',
  'Payroll',
  'Reports',
  'Analytics',
  'API Integration',
  'Payment Gateway',
  'Mobile Responsive',
  'AI Features',
  'Notifications',
  'QR Code',
  'Barcode',
  'Other'
] as const;

// Zod validation schema for Step 1
export const step1Schema = z.object({
  fullName: z.string().min(2, 'Full name is required (at least 2 characters)'),
  company: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().optional(),
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

// Zod validation schema for Step 2
export const step2Schema = z.object({
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  projectType: z.string().min(1, 'Please select a project type')
});

// Zod validation schema for Step 3
export const step3Schema = z.object({
  featureChips: z.array(z.string()).optional(),
  description: z.string().min(15, 'Please provide a project description (at least 15 characters)')
});

// Combined schema
export const projectInquirySchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type ProjectInquiryFormData = z.infer<typeof projectInquirySchema>;

export interface InquiryFileAttachment {
  name: string;
  size: number;
  type: string;
  content: string; // base64 payload
}
