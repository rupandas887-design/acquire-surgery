import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PATIENT_CONDITIONS,
  AFFORDABLE_BUDGETS,
  InsuranceStatus,
  Lead,
} from '../types';
import { api } from '../services/api';
import { getAttributionData, trackLeadConversion } from '../utils/tracking';
import { ShieldCheck, ArrowRight, AlertCircle, Calendar, Lock } from 'lucide-react';
import { EASE_SMOOTH } from './MotionPrimitives';

interface EnquiryFormProps {
  idPrefix?: string;
  initialCondition?: string;
  initialBudget?: string;
  ctaLabel?: string;
  onSuccess: (lead: Lead) => void;
  onNavigatePrivacy: () => void;
  compactHeader?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  idPrefix = 'enquiry',
  initialCondition,
  initialBudget,
  ctaLabel = 'FIND HOSPITALS WITHIN MY BUDGET',
  onSuccess,
  onNavigatePrivacy,
  compactHeader = false,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [condition, setCondition] = useState<string>(initialCondition || '');
  const [insuranceStatus, setInsuranceStatus] = useState<'Yes' | 'No' | ''>('');
  const [budget, setBudget] = useState<string>(initialBudget || '');
  const [suggestedTreatmentPlan, setSuggestedTreatmentPlan] = useState('');
  const [expectedSurgeryDate, setExpectedSurgeryDate] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCondition) {
      setCondition(initialCondition);
      setErrors((prev) => ({ ...prev, condition: '' }));
    }
  }, [initialCondition]);

  useEffect(() => {
    if (initialBudget) {
      setBudget(initialBudget);
      setErrors((prev) => ({ ...prev, budget: '' }));
    }
  }, [initialBudget]);

  const todayISO = new Date().toISOString().split('T')[0];

  const showBudgetField = insuranceStatus === 'No';

  const completedRequiredCount =
    (name.trim().length >= 2 ? 1 : 0) +
    (/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, '')) ? 1 : 0) +
    (condition ? 1 : 0) +
    (insuranceStatus ? 1 : 0) +
    (showBudgetField && budget ? 1 : 0);
  const totalRequiredCount = showBudgetField ? 5 : 4;
  const completionRatio = Math.min(1, completedRequiredCount / totalRequiredCount);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter the patient or contact person name.';
    }
    const cleanDigits = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
      nextErrors.mobile = 'Please enter a valid 10-digit Indian mobile number (starting with 6–9).';
    }
    if (!condition) {
      nextErrors.condition = 'Please select your surgical condition.';
    }
    if (!insuranceStatus) {
      nextErrors.insuranceStatus = 'Please select Yes or No for health insurance.';
    }
    if (insuranceStatus === 'No' && !budget) {
      nextErrors.budget = 'Please select your affordable treatment budget range.';
    }
    if (expectedSurgeryDate && expectedSurgeryDate < todayISO) {
      nextErrors.expectedSurgeryDate = 'Please select today or a future date, or leave blank if undecided.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInsuranceChange = (option: 'Yes' | 'No') => {
    setInsuranceStatus(option);
    setErrors((prev) => ({
      ...prev,
      insuranceStatus: '',
      ...(option === 'Yes' ? { budget: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const attribution = getAttributionData();
      const effectiveBudget =
        insuranceStatus === 'Yes' ? 'Covered by Health Insurance' : budget;

      const { lead } = await api.createLead({
        name: name.trim(),
        mobile: mobile.replace(/\D/g, '').slice(-10),
        condition,
        insuranceStatus: insuranceStatus as InsuranceStatus,
        insuranceCompany: '',
        budget: effectiveBudget,
        suggestedTreatmentPlan: suggestedTreatmentPlan.trim(),
        expectedSurgeryDate: expectedSurgeryDate || '',
        whatsappConsent,
        attribution,
        source: attribution.sourceCampaign || 'Acquire Surgery Landing Page',
      });

      trackLeadConversion(lead.leadCode || lead.id, attribution);
      onSuccess(lead);
    } catch (err: any) {
      setSubmitError(err?.message || 'Unable to submit your enquiry right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-200/80 shadow-2xl shadow-slate-950/25 overflow-hidden">
      {/* Header */}
      <div className="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-sky-200/60 bg-gradient-to-r from-[#062B61] via-[#1D4ED8] via-[#0284C7] to-[#0D9488] text-white">
        {!compactHeader && (
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <p className="text-xs font-semibold text-[#6EE7B7]">
              Confidential Requirement Review
            </p>
            <span className="text-[11px] font-mono text-sky-100 tabular-nums">
              {completedRequiredCount}/{totalRequiredCount} Required
            </span>
          </div>
        )}
        <h2 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-white">
          Let&apos;s Understand Your Surgery Requirements.
        </h2>
        <p className="text-sm sm:text-base text-sky-100 mt-1.5">
          Share your surgery requirement and preferences. Our team will help you explore suitable hospital options.
        </p>

        {/* Smooth completion progress indicator */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#FBBF24] via-[#34D399] to-[#38BDF8] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: completionRatio }}
            transition={{ duration: 0.35, ease: EASE_SMOOTH }}
          />
        </div>
      </div>

      {/* Form Body */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-5 sm:p-8 space-y-5 bg-gradient-to-b from-[#F8FAFF] via-white to-[#F0FDFA]/80"
      >
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Field 1: Patient / Contact Person Name & Field 2: Mobile Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${idPrefix}-name`} className="block text-sm font-semibold text-slate-800 mb-1.5">
              Patient / Contact Person Name <span className="text-rose-600">*</span>
            </label>
            <input
              id={`${idPrefix}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Enter full name"
              className={`w-full min-h-[46px] px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61] ${
                errors.name ? 'border-rose-400' : 'border-slate-300'
              }`}
              required
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-mobile`} className="block text-sm font-semibold text-slate-800 mb-1.5">
              Mobile Number <span className="text-rose-600">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gradient-to-b from-sky-50 to-cyan-50 border border-r-0 border-slate-300 rounded-l-xl text-sm font-bold text-[#062B61] font-mono shrink-0">
                +91
              </span>
              <input
                id={`${idPrefix}-mobile`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={mobile}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobile(digits);
                  if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                }}
                placeholder="10-digit mobile number"
                className={`min-w-0 flex-1 w-full min-h-[46px] px-3.5 py-2.5 text-sm rounded-r-xl border bg-white text-slate-900 font-mono tabular-nums placeholder:font-sans placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61] ${
                  errors.mobile ? 'border-rose-400' : 'border-slate-300'
                }`}
                required
              />
            </div>
            {errors.mobile && (
              <p className="text-xs text-rose-600 mt-1">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Field 3: Patient Condition & Field 4: Do You Have Health Insurance? */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${idPrefix}-condition`} className="block text-sm font-semibold text-slate-800 mb-1.5">
              Patient Condition <span className="text-rose-600">*</span>
            </label>
            <select
              id={`${idPrefix}-condition`}
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                if (errors.condition) setErrors((prev) => ({ ...prev, condition: '' }));
              }}
              className={`w-full min-h-[46px] px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61] ${
                errors.condition ? 'border-rose-400' : 'border-slate-300'
              }`}
              required
            >
              <option value="">Select condition...</option>
              {PATIENT_CONDITIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-xs text-rose-600 mt-1">{errors.condition}</p>
            )}
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-semibold text-slate-800 mb-1.5">
                Do You Have Health Insurance? <span className="text-rose-600">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {(['Yes', 'No'] as const).map((option) => {
                  const selected = insuranceStatus === option;
                  return (
                    <motion.label
                      key={option}
                      whileTap={{ scale: 0.97 }}
                      className={`min-h-[46px] flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                        selected
                          ? 'bg-gradient-to-r from-[#1D4ED8] via-[#0284C7] to-[#0D9488] text-white border-[#0284C7] shadow-sm'
                          : errors.insuranceStatus
                          ? 'bg-white text-slate-700 border-rose-400 hover:bg-sky-50/70'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-[#0284C7] hover:bg-sky-50/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${idPrefix}-insuranceStatus`}
                        value={option}
                        checked={selected}
                        onChange={() => handleInsuranceChange(option)}
                        className="sr-only"
                      />
                      <span>{option}</span>
                    </motion.label>
                  );
                })}
              </div>
              {errors.insuranceStatus && (
                <p className="text-xs text-rose-600 mt-1">{errors.insuranceStatus}</p>
              )}
            </fieldset>
          </div>
        </div>

        {/* Field 5: Affordable Treatment Budget (shown ONLY when Health Insurance === 'No') */}
        <AnimatePresence initial={false}>
          {showBudgetField && (
            <motion.div
              key="budget-field-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="overflow-hidden"
            >
              <div className="pt-0.5">
                <label htmlFor={`${idPrefix}-budget`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Affordable Treatment Budget <span className="text-rose-600">*</span>
                </label>
                <select
                  id={`${idPrefix}-budget`}
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (errors.budget) setErrors((prev) => ({ ...prev, budget: '' }));
                  }}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61] ${
                    errors.budget ? 'border-rose-400' : 'border-slate-300'
                  }`}
                  required
                >
                  <option value="">Select budget range...</option>
                  {AFFORDABLE_BUDGETS.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-xs text-rose-600 mt-1">{errors.budget}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Field 6: Suggested Treatment Plan & Field 7: Expected Surgery Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${idPrefix}-treatment-plan`} className="block text-sm font-semibold text-slate-800 mb-1.5">
              Suggested Treatment Plan <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <input
              id={`${idPrefix}-treatment-plan`}
              type="text"
              value={suggestedTreatmentPlan}
              onChange={(e) => setSuggestedTreatmentPlan(e.target.value)}
              placeholder="e.g. Laser Piles, Laparoscopic Hernia"
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61]"
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-surgery-date`} className="block text-sm font-semibold text-slate-800 mb-1.5">
              Expected Surgery Date <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id={`${idPrefix}-surgery-date`}
                type="date"
                min={todayISO}
                value={expectedSurgeryDate}
                onChange={(e) => {
                  setExpectedSurgeryDate(e.target.value);
                  if (errors.expectedSurgeryDate) {
                    setErrors((prev) => ({ ...prev, expectedSurgeryDate: '' }));
                  }
                }}
                className={`w-full min-w-0 max-w-full min-h-[46px] pl-10 pr-3 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#062B61] ${
                  errors.expectedSurgeryDate ? 'border-rose-400' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.expectedSurgeryDate && (
              <p className="text-xs text-rose-600 mt-1">{errors.expectedSurgeryDate}</p>
            )}
          </div>
        </div>

        {/* Consent & Privacy Assurance */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#062B61] focus:ring-[#062B61] shrink-0"
            />
            <span className="min-w-0 leading-relaxed">
              I agree to receive an acknowledgement and surgical option updates from Acquire Surgery via WhatsApp, SMS, or phone call, in accordance with the{' '}
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onNavigatePrivacy();
                }}
                className="text-[#062B61] font-semibold underline underline-offset-2 hover:text-[#0D9488] cursor-pointer"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <motion.button
            id={`${idPrefix}-submit-btn`}
            type="submit"
            disabled={isSubmitting}
            whileHover={isSubmitting ? undefined : { scale: 1.01 }}
            whileTap={isSubmitting ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.16, ease: EASE_SMOOTH }}
            className="group relative overflow-hidden w-full min-h-[54px] inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#062B61] via-[#0284C7] to-[#059669] hover:from-[#05234E] hover:via-[#0369A1] hover:to-[#047857] text-white text-xs sm:text-base font-bold tracking-wide px-4 sm:px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-900/20 transition-all cursor-pointer disabled:opacity-60 text-center leading-snug"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />
            {isSubmitting ? (
              <span className="relative">SUBMITTING YOUR REQUIREMENTS...</span>
            ) : (
              <>
                <span className="relative">{ctaLabel}</span>
                <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>100% Confidential Patient Data</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Zero-Obligation Decision Support</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
