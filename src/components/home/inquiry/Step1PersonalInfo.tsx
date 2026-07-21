import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProjectInquiryFormData } from '../../../types/inquirySchema';
import { User, Building2, Mail, Phone, Globe } from 'lucide-react';

interface Step1Props {
  register: UseFormRegister<ProjectInquiryFormData>;
  errors: FieldErrors<ProjectInquiryFormData>;
}

export const Step1PersonalInfo: React.FC<Step1Props> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-neutralfacebold text-gray-900 dark:text-white mb-1">
          Personal & Business Details
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Tell us about yourself and your organization so we can get in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Mark Isulat"
              {...register('fullName')}
              className={`w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-white/5 border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
              } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Company / Business */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Company / Business
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Acme Corp / Startup"
              {...register('company')}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="e.g. mark@example.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-white/5 border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
              } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="e.g. +63 912 345 6789"
              {...register('phone')}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Website */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Current Website / Reference Link (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. mycompany.com (leave blank if none)"
              {...register('website')}
              className={`w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-white/5 border ${
                errors.website ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
              } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all`}
            />
          </div>
          {errors.website && (
            <p className="text-xs text-red-500 mt-1">{errors.website.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
