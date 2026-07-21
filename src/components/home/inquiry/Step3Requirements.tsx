import React, { useState } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import {
  ProjectInquiryFormData,
  FEATURE_CHIPS_OPTIONS,
  InquiryFileAttachment
} from '../../../types/inquirySchema';
import { UploadCloud, X, FileText, Sparkles } from 'lucide-react';

interface Step3Props {
  register: UseFormRegister<ProjectInquiryFormData>;
  watch: UseFormWatch<ProjectInquiryFormData>;
  setValue: UseFormSetValue<ProjectInquiryFormData>;
  errors: FieldErrors<ProjectInquiryFormData>;
  attachments: InquiryFileAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<InquiryFileAttachment[]>>;
}

export const Step3Requirements: React.FC<Step3Props> = ({
  register,
  watch,
  setValue,
  errors,
  attachments,
  setAttachments
}) => {
  const selectedChips = watch('featureChips') || [];
  const [dragActive, setDragActive] = useState(false);

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setValue(
        'featureChips',
        selectedChips.filter((c) => c !== chip)
      );
    } else {
      setValue('featureChips', [...selectedChips, chip]);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: InquiryFileAttachment[] = [];

    Array.from(files).forEach((file) => {
      // Limit file size to 5MB per file
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content
        });

        if (newFiles.length === files.length) {
          setAttachments((prev) => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-neutralfacebold text-gray-900 dark:text-white mb-1">
          Project Requirements & Attachments
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Highlight key features, describe your goals, and share relevant design files or briefs.
        </p>
      </div>

      {/* Feature Chips */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Key Features & Capabilities (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {FEATURE_CHIPS_OPTIONS.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            return (
              <button
                type="button"
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-sky-400'
                }`}
              >
                {isSelected && <Sparkles className="w-3 h-3" />}
                <span>{chip}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Project Description & Brief <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Describe your project goals, target users, required features, or reference websites..."
          {...register('description')}
          className={`w-full p-4 bg-white/70 dark:bg-white/5 border ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
          } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y`}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Drag & Drop File Upload */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Optional Uploads (PDF, Images, Figma exports, Logos)
        </label>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-500/10'
              : 'border-gray-300 dark:border-white/15 bg-white/40 dark:bg-white/5 hover:border-sky-400'
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.svg,.zip,.fig"
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="w-8 h-8 text-sky-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Drag & drop files here, or <span className="text-sky-500 underline">browse</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Supports PDF, PNG, JPG, SVG, Figma exports up to 5MB</p>
        </div>

        {/* Uploaded File List */}
        {attachments.length > 0 && (
          <div className="space-y-2 mt-3">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white/80 dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/10 text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="truncate text-gray-800 dark:text-gray-200">{file.name}</span>
                  <span className="text-gray-400 text-[10px]">({Math.round(file.size / 1024)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-white/20 rounded-md text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
