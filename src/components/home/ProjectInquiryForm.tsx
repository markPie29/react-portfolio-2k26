import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  projectInquirySchema,
  ProjectInquiryFormData,
} from '../../types/inquirySchema';
import { Step1PersonalInfo } from './inquiry/Step1PersonalInfo';
import { Step2ProjectDetails } from './inquiry/Step2ProjectDetails';
import { Step3BookingSlot } from './inquiry/Step3BookingSlot';
import { InquirySuccess } from './inquiry/InquirySuccess';
import {
  submitProjectInquiry,
  triggerNotification,
  deleteProjectInquiry,
} from '../../services/inquiryService';
import { createBooking } from '../../services/bookingService';
import { ArrowLeft, ArrowRight, Loader2, Send, ShieldCheck } from 'lucide-react';

export const ProjectInquiryForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
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
      projectType: '',
      description: '',
      bookedDate: '',
      bookedTime: ''
    }
  });

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

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
  const selectedDate = watch('bookedDate');
  const selectedTime = watch('bookedTime');

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['fullName', 'email', 'website', 'phone']);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await trigger(['projectType', 'description']);
      if (isValid) {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: ProjectInquiryFormData) => {
    // 1. Anti-bot honeypot check
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
      // Step A: Insert Inquiry into DB without sending notification yet
      const inquiryRes = await submitProjectInquiry(
        {
          ...data,
          turnstileToken,
        },
        { skipNotification: true }
      );

      if (!inquiryRes.success || !inquiryRes.inquiryId) {
        setSubmitError(
          inquiryRes.error
            ? `${inquiryRes.message} (${inquiryRes.error})`
            : inquiryRes.message || 'Failed to record inquiry.'
        );
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }

      const activeInquiryId = inquiryRes.inquiryId;
      setInquiryId(activeInquiryId);

      // Step B: Create Booking tied to the inquiry
      const bookingRes = await createBooking({
        inquiryId: activeInquiryId,
        clientName: data.fullName,
        clientEmail: data.email,
        bookedDate: data.bookedDate,
        bookedTime: data.bookedTime,
        duration: 30,
        meetingType: 'discovery',
      });

      if (!bookingRes.success) {
        // Step C: Rollback (Delete inquiry) if booking fails so database remains clean
        await deleteProjectInquiry(activeInquiryId);
        setInquiryId(undefined);
        setSubmitError(
          bookingRes.message || 'Selected time slot could not be reserved. Please select another time slot.'
        );
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }

      // Step D: Trigger Discord Notification ONLY AFTER both inquiry and booking succeed
      await triggerNotification(
        {
          ...data,
          bookedDate: data.bookedDate,
          bookedTime: data.bookedTime,
        },
        activeInquiryId
      );

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResetForm = () => {
    reset();
    setStep(1);
    setIsSuccess(false);
    setSubmitError(null);
    setInquiryId(undefined);
    mountTimeRef.current = Date.now();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-[#080a0f]/40 backdrop-blur-xl border border-gray-200 dark:border-[#48cae4]/20 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300">
      {!isSuccess ? (
        <>
          {/* Top Progress Bar & Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-neutralfacebold uppercase tracking-wider mb-3">
              <span className={step >= 1 ? 'text-sky-500' : 'text-gray-400'}>
                01. Contact
              </span>
              <span className={step >= 2 ? 'text-sky-500' : 'text-gray-400'}>
                02. Project
              </span>
              <span className={step >= 3 ? 'text-sky-500' : 'text-gray-400'}>
                03. Schedule
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <Step1PersonalInfo register={register} errors={errors} />
                )}
                {step === 2 && (
                  <div className="space-y-6">
                    <Step2ProjectDetails
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
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
                {step === 3 && (
                  <Step3BookingSlot
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={(date) => setValue('bookedDate', date, { shouldValidate: true })}
                    onSelectTime={(time) => setValue('bookedTime', time, { shouldValidate: true })}
                    errors={errors}
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
                  disabled={isSubmitting || !selectedTime}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white text-xs font-neutralfacebold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/30 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Completing Booking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Book Call</span>
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
          bookedDate={selectedDate}
          bookedTime={selectedTime}
        />
      )}
    </div>
  );
};
