import React from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import {
  ProjectInquiryFormData,
  SERVICES_OPTIONS,
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  PROJECT_TYPE_OPTIONS
} from '../../../types/inquirySchema';
import { Check } from 'lucide-react';

interface Step2Props {
  watch: UseFormWatch<ProjectInquiryFormData>;
  setValue: UseFormSetValue<ProjectInquiryFormData>;
  errors: FieldErrors<ProjectInquiryFormData>;
}

export const Step2ProjectInfo: React.FC<Step2Props> = ({ watch, setValue, errors }) => {
  const selectedServices = watch('services') || [];
  const selectedBudget = watch('budget');
  const selectedTimeline = watch('timeline');
  const selectedProjectType = watch('projectType');

  const toggleService = (label: string) => {
    if (selectedServices.includes(label)) {
      setValue(
        'services',
        selectedServices.filter((s) => s !== label),
        { shouldValidate: true }
      );
    } else {
      setValue('services', [...selectedServices, label], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-neutralfacebold text-gray-900 dark:text-white mb-1">
          Services & Project Scope
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Select the capabilities you need and specify your budget and timeline.
        </p>
      </div>

      {/* Services Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Services Needed <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {SERVICES_OPTIONS.map((service) => {
            const isSelected = selectedServices.includes(service.label);
            return (
              <button
                type="button"
                key={service.id}
                onClick={() => toggleService(service.label)}
                className={`flex items-center gap-2 p-3 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : 'border-gray-400 dark:border-white/30'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{service.label}</span>
              </button>
            );
          })}
        </div>
        {errors.services && (
          <p className="text-xs text-red-500 mt-1">{errors.services.message}</p>
        )}
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Estimated Budget (PHP) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {BUDGET_OPTIONS.map((b) => {
            const isSelected = selectedBudget === b.label;
            return (
              <button
                type="button"
                key={b.id}
                onClick={() => setValue('budget', b.label, { shouldValidate: true })}
                className={`p-3 rounded-xl text-center border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-300 ring-2 ring-sky-500/30'
                    : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
        {errors.budget && (
          <p className="text-xs text-red-500 mt-1">{errors.budget.message}</p>
        )}
      </div>

      {/* Timeline & Project Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Target Timeline <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIMELINE_OPTIONS.map((t) => {
              const isSelected = selectedTimeline === t.label;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setValue('timeline', t.label, { shouldValidate: true })}
                  className={`p-2.5 rounded-lg text-center border text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-300'
                      : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          {errors.timeline && (
            <p className="text-xs text-red-500 mt-1">{errors.timeline.message}</p>
          )}
        </div>

        {/* Project Type */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Project Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROJECT_TYPE_OPTIONS.map((pt) => {
              const isSelected = selectedProjectType === pt.label;
              return (
                <button
                  type="button"
                  key={pt.id}
                  onClick={() => setValue('projectType', pt.label, { shouldValidate: true })}
                  className={`p-2.5 rounded-lg text-center border text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-300'
                      : 'bg-white/70 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20'
                  }`}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
          {errors.projectType && (
            <p className="text-xs text-red-500 mt-1">{errors.projectType.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
