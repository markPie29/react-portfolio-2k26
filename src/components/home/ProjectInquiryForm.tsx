import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  projectInquirySchema,
  ProjectInquiryFormData,
  InquiryFileAttachment,
  step1Schema,
  step2Schema
} from '../../types/inquirySchema';
import { Step1PersonalInfo } from './inquiry/Step1PersonalInfo';
import { Step2ProjectInfo } from './inquiry/Step2ProjectInfo';
import { Step3Requirements } from './inquiry/Step3Requirements';
import { InquirySuccess } from './inquiry/InquirySuccess';
import { submitProjectInquiry } from '../../services/inquiryService';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';

export const ProjectInquiryForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [attachments, setAttachments] = useState<InquiryFileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProjectInquiryFormData>({
    resolver: zodResolver(projectInquirySchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      services: [],
      budget: '',
      timeline: '',
      projectType: '',
      featureChips: [],
      description: ''
    }
  });

  const clientFullName = watch('fullName');
  const clientEmailAddress = watch('email');

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['fullName', 'email', 'website']);
    } else if (step === 2) {
      isValid = await trigger(['services', 'budget', 'timeline', 'projectType']);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: ProjectInquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitProjectInquiry({
        ...data,
        attachments
      });

      if (response.success) {
        setInquiryId(response.inquiryId);
        setIsSuccess(true);
      } else {
        setSubmitError(response.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    reset();
    setAttachments([]);
    setStep(1);
    setIsSuccess(false);
    setSubmitError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-[#0c1017]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300">
      {!isSuccess ? (
        <>
          {/* Top Progress Bar & Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-neutralfacebold uppercase tracking-wider mb-3">
              <span className={step >= 1 ? 'text-sky-500' : 'text-gray-400'}>
                01. Contact Details
              </span>
              <span className={step >= 2 ? 'text-sky-500' : 'text-gray-400'}>
                02. Scope & Budget
              </span>
              <span className={step >= 3 ? 'text-sky-500' : 'text-gray-400'}>
                03. Brief & Files
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
                initial={{ width: '33.3%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500">
              {submitError}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 1 ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <Step1PersonalInfo register={register} errors={errors} />
                )}
                {step === 2 && (
                  <Step2ProjectInfo
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                  />
                )}
                {step === 3 && (
                  <Step3Requirements
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                    attachments={attachments}
                    setAttachments={setAttachments}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Form Action Controls */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-neutralfacebold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-neutralfacebold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white text-xs font-neutralfacebold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/30 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <InquirySuccess
          onReset={handleResetForm}
          inquiryId={inquiryId}
          clientName={clientFullName}
          clientEmail={clientEmailAddress}
        />
      )}
    </div>
  );
};
