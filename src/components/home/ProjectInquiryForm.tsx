import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  projectInquirySchema,
  ProjectInquiryFormData,
  InquiryFileAttachment,
} from '../../types/inquirySchema';
import { Step1PersonalInfo } from './inquiry/Step1PersonalInfo';
import { Step2ProjectInfo } from './inquiry/Step2ProjectInfo';
import { Step3Requirements } from './inquiry/Step3Requirements';
import { InquirySuccess } from './inquiry/InquirySuccess';
import { submitProjectInquiry } from '../../services/inquiryService';
import { ArrowLeft, ArrowRight, Loader2, Send, ShieldCheck } from 'lucide-react';

interface ProjectInquiryFormProps {
  initialServices?: string[];
}

export const ProjectInquiryForm: React.FC<ProjectInquiryFormProps> = ({ initialServices }) => {
  const [step, setStep] = useState<number>(1);
  const [attachments, setAttachments] = useState<InquiryFileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | undefined>(undefined);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(undefined);

  // Security refs: load timestamp & submission lock
  const mountTimeRef = useRef<number>(Date.now());
  const isSubmittingRef = useRef<boolean>(false);

  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

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
      services: initialServices || [],
      budget: '',
      timeline: '',
      projectType: '',
      featureChips: [],
      description: ''
    }
  });

  useEffect(() => {
    mountTimeRef.current = Date.now();
    if (initialServices && initialServices.length > 0) {
      setValue('services', initialServices, { shouldValidate: true });
    }
  }, [initialServices, setValue]);

  // Load Turnstile Widget script dynamically if site key configured
  useEffect(() => {
    if (!turnstileSiteKey) return;

    const existingScript = document.getElementById('cloudflare-turnstile-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      (window as any).onloadTurnstileCallback = () => {
        if ((window as any).turnstile) {
          (window as any).turnstile.render('#turnstile-container', {
            sitekey: turnstileSiteKey,
            callback: (token: string) => setTurnstileToken(token),
          });
        }
      };
    } else if ((window as any).turnstile) {
      try {
        (window as any).turnstile.render('#turnstile-container', {
          sitekey: turnstileSiteKey,
          callback: (token: string) => setTurnstileToken(token),
        });
      } catch (e) {
        // Already rendered
      }
    }
  }, [turnstileSiteKey, step]);

  const clientFullName = watch('fullName');
  const clientEmailAddress = watch('email');

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['fullName', 'email', 'website', 'phone']);
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
    // 1. Anti-bot honeypot check (Check if hidden honeypot trap field filled)
    const hpInput = (document.getElementById('hp_website_trap') as HTMLInputElement)?.value;
    if (hpInput && hpInput.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      setIsSuccess(true);
      return;
    }

    // 2. Anti-bot submission speed check (< 3 seconds total form duration)
    const timeSpentMs = Date.now() - mountTimeRef.current;
    if (timeSpentMs < 3000) {
      setSubmitError('Submission too fast. Please take a moment to review your details.');
      return;
    }

    // 3. Prevent duplicate in-flight requests
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitProjectInquiry({
        ...data,
        attachments,
        turnstileToken,
      });

      if (response.success) {
        setInquiryId(response.inquiryId);
        setIsSuccess(true);
      } else {
        setSubmitError(
          response.error
            ? `${response.message} (${response.error})`
            : response.message || 'Failed to submit inquiry.'
        );
      }
    } catch (err: any) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResetForm = () => {
    reset();
    setAttachments([]);
    setStep(1);
    setIsSuccess(false);
    setSubmitError(null);
    mountTimeRef.current = Date.now();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-[#080a0f]/40 backdrop-blur-xl border border-gray-200 dark:border-[#48cae4]/20 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300">
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
                  <div className="space-y-6">
                    <Step3Requirements
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      attachments={attachments}
                      setAttachments={setAttachments}
                    />

                    {/* Cloudflare Turnstile Container if configured */}
                    {turnstileSiteKey && (
                      <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                        <div id="turnstile-container" className="my-2" />
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-sky-500" /> Protected by Cloudflare Turnstile CAPTCHA
                        </span>
                      </div>
                    )}
                  </div>
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
