import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Lead } from '../types';
import { LANDING_IMAGES } from '../data/landingAssets';
import { ResilientImage } from '../components/ResilientImage';
import { trackThankYouPageView, trackWhatsAppClick } from '../utils/tracking';
import { EASE_SMOOTH, AmbientMedicalGraphic } from '../components/MotionPrimitives';
import { MessageCircle, ArrowLeft, Phone, Clock } from 'lucide-react';

interface ThankYouPageProps {
  lead: Lead | null;
  onNavigateHome: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ lead, onNavigateHome }) => {
  useEffect(() => {
    trackThankYouPageView(lead?.leadCode || lead?.id);
  }, [lead]);

  const leadRef = lead?.leadCode || (lead?.id ? `AS-${lead.id.slice(-6).toUpperCase()}` : 'RECEIVED');
  const submittedTime = lead?.createdAt
    ? new Date(lead.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const whatsappText = encodeURIComponent(
    `Hi Acquire Surgery, I just submitted my surgical decision enquiry (Lead ID: ${leadRef}). I would like to review suitable options.`
  );

  return (
    <div className="relative bg-gradient-to-br from-[#0F2958] via-[#0B5577] to-[#0D7A6E] py-10 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AmbientMedicalGraphic variant="dark" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: EASE_SMOOTH }}
        className="relative z-10 max-w-2xl mx-auto bg-gradient-to-b from-white via-[#F8FAFF] to-[#F0FDFA] border border-cyan-200/80 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/30"
      >
        <div className="h-2 bg-gradient-to-r from-[#2563EB] via-[#06B6D4] via-[#10B981] to-[#F59E0B]" />
        <div className="p-5 sm:p-10 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="relative inline-flex items-center justify-center w-14 h-14">
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-teal-400/60"
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1.35, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: EASE_SMOOTH }}
              />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CCFBF1] to-[#CFFAFE] border border-teal-300 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#0D9488"
                    strokeWidth="2.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: EASE_SMOOTH }}
                  />
                  <motion.path
                    d="M12 18.5L16.2 22.5L24.5 14"
                    stroke="#062B61"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.45, ease: EASE_SMOOTH }}
                  />
                </svg>
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#062B61] tracking-tight">
              Requirements Received
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Thank you for choosing Acquire Surgery. Your requirements have been received. Our team will connect with you to help explore suitable surgical options.
            </p>
          </div>

          {/* Care Coordinator Visual Welcome Strip */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#EFF6FF] to-[#ECFEFF] border border-sky-200 rounded-xl p-4">
            <div className="w-full sm:w-28 h-24 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-sky-200">
              <ResilientImage
                src={LANDING_IMAGES.careCoordinatorSupport}
                alt="Acquire Surgery care coordinator ready to assist with surgical options"
                loading="eager"
                decoding="async"
                fallbackLabel="Care Coordinator Team"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-[#062B61]">Your Dedicated Care Coordinator Team</p>
              <p className="mt-0.5">
                We compare specialist credentials, accredited hospitals, and indicative packages before calling you back.
              </p>
            </div>
          </div>

          {/* Submission Reference Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16, ease: EASE_SMOOTH }}
            className="bg-gradient-to-br from-[#EFF6FF] via-white to-[#ECFEFF] border border-sky-200 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-sm shadow-xs"
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#0E7490] block">Reference Lead ID</span>
              <span className="font-mono font-bold text-[#062B61] tabular-nums mt-0.5 block break-all">
                {leadRef}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#0E7490] block">Submitted On</span>
              <span className="font-mono text-slate-800 tabular-nums mt-0.5 block">
                {submittedTime}
              </span>
            </div>
            {lead?.condition && (
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#0E7490] block">Condition</span>
                <span className="font-semibold text-slate-900 mt-0.5 block break-words">
                  {lead.condition}
                </span>
              </div>
            )}
            {lead?.budget && (
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#0E7490] block">Affordable Budget</span>
                <span className="font-semibold text-slate-900 mt-0.5 block break-words">
                  {lead.budget}
                </span>
              </div>
            )}
          </motion.div>

          {/* Next Steps */}
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
              <p>
                A dedicated surgical decision coordinator will review your condition, budget, and insurance details and call you shortly.
              </p>
            </div>
            {lead?.whatsappConsent && (
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <p>
                  An acknowledgement has been queued to your mobile number subject to WhatsApp / SMS delivery.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <motion.a
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: EASE_SMOOTH }}
              href={`https://wa.me/919429693887?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(`thank_you_${leadRef}`)}
              className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#059669] to-[#0D9488] hover:from-[#047857] hover:to-[#0F766E] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-3 rounded-xl shadow-md shadow-emerald-900/15 transition-all text-center leading-snug"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Message Coordinator on WhatsApp</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: EASE_SMOOTH }}
              href="tel:+919429693887"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 border border-blue-200 bg-gradient-to-r from-[#EFF6FF] to-[#E0F2FE] hover:from-[#DBEAFE] hover:to-[#BAE6FD] text-[#062B61] text-xs sm:text-sm font-bold px-4 sm:px-5 py-3 rounded-xl transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <span>+91 94296 93887</span>
            </motion.a>
          </div>

          <div className="pt-4 border-t border-sky-100">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#062B61] hover:text-[#0D9488] hover:underline underline-offset-4 cursor-pointer py-1 min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Acquire Surgery Home</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
