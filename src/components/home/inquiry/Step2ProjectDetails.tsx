import React from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import {
  ProjectInquiryFormData,
  PROJECT_TYPE_OPTIONS
} from '../../../types/inquirySchema';
import { Palette, Code2, Share2, Check } from 'lucide-react';

interface Step2Props {
  register: UseFormRegister<ProjectInquiryFormData>;
  watch: UseFormWatch<ProjectInquiryFormData>;
  setValue: UseFormSetValue<ProjectInquiryFormData>;
  errors: FieldErrors<ProjectInquiryFormData>;
}

const getIcon = (id: string) => {
  switch (id) {
    case 'graphic-design':
      return Palette;
    case 'software':
      return Code2;
    case 'social-media':
      return Share2;
    default:
      return Palette;
  }
};

export const Step2ProjectDetails: React.FC<Step2Props> = ({ register, watch, setValue, errors }) => {
  const selectedProjectType = watch('projectType');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-neutralfacebold text-gray-900 dark:text-white mb-1">
          Project Details
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Select your project domain and tell us what you would like to build or create.
        </p>
      </div>

      {/* Type of Project */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Type of Project <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROJECT_TYPE_OPTIONS.map((pt) => {
            const Icon = getIcon(pt.id);
            const isSelected = selectedProjectType === pt.label;
            return (
              <button
                type="button"
                key={pt.id}
                onClick={() => setValue('projectType', pt.label, { shouldValidate: true })}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 ring-2 ring-sky-500/30'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400'
                        : 'bg-white/50 dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="font-neutralfacebold text-sm text-gray-900 dark:text-white block mb-0.5">
                  {pt.label}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                  {pt.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.projectType && (
          <p className="text-xs text-red-500 mt-1">{errors.projectType.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={6}
          placeholder="Describe your goals, requirements, timeline expectations, or any specific details for the call..."
          {...register('description')}
          className={`w-full p-4 bg-white/70 dark:bg-white/5 border ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
          } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y`}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
