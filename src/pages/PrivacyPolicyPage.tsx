import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LANDING_IMAGES } from '../data/landingAssets';
import { ResilientImage } from '../components/ResilientImage';
import {
  StaggerContainer,
  StaggerItem,
  AmbientMedicalGraphic,
  KineticText,
  EASE_SMOOTH,
} from '../components/MotionPrimitives';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#0F2958] via-[#0B5577] to-[#0D7A6E] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AmbientMedicalGraphic variant="dark" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE_SMOOTH }}
        className="relative z-10 max-w-3xl mx-auto bg-gradient-to-b from-white via-[#F8FAFF] to-[#F0FDFA] border border-cyan-200/80 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/30"
      >
        <div className="h-2 bg-gradient-to-r from-[#2563EB] via-[#06B6D4] via-[#10B981] to-[#F59E0B]" />
        <div className="p-5 sm:p-10 space-y-8">
          <div className="space-y-4 pb-6 border-b border-sky-200/80">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#062B61] hover:text-[#0D9488] hover:underline underline-offset-4 cursor-pointer py-1 min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Acquire Surgery</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Patient Data Confidentiality</span>
                </div>
                <KineticText
                  as="h1"
                  text="Privacy Policy"
                  className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight"
                />
                <p className="text-xs font-mono text-slate-600">
                  Last Updated: November 2026 · Acquire Surgery – Your Surgical Decision Partner
                </p>
              </div>
              <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden border border-sky-200 shrink-0 shadow-xs">
                <ResilientImage
                  src={LANDING_IMAGES.patientFamilyClarity}
                  alt="Acquire Surgery patient privacy and family data confidentiality"
                  loading="eager"
                  decoding="async"
                  fallbackLabel="Confidential Patient Care"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <StaggerContainer className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  1. Who We Are
                </h2>
                <p>
                  Acquire Surgery (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates as an independent Surgical Decision Partner that helps patients explore and compare experienced surgeons, hospital facilities, and estimated treatment packages. Acquire Surgery is not a hospital and does not directly perform surgical procedures.
                </p>
              </section>
            </StaggerItem>

            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  2. Information We Collect
                </h2>
                <p>
                  When you submit an enquiry on Acquire Surgery, we collect only the details necessary to help you explore suitable surgical options:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>Patient or contact person name and 10-digit Indian mobile number</li>
                  <li>Selected surgical condition and optional doctor-recommended treatment plan</li>
                  <li>Health insurance status and optional Insurance Company / TPA name</li>
                  <li>Optional expected surgery date and affordable treatment budget range</li>
                  <li>Campaign attribution parameters (UTM tags and landing URL) for internal enquiry routing</li>
                </ul>
              </section>
            </StaggerItem>

            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  3. How We Use &amp; Protect Your Data
                </h2>
                <p>
                  Your enquiry details are used solely by our care coordination team to identify suitable participating surgeons, hospital facilities, and treatment package estimates matching your clinical requirements and budget. We share details with participating hospitals or treating surgeons only when assisting you with consultations or cashless TPA coordination.
                </p>
              </section>
            </StaggerItem>

            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  4. Advertising Pixels &amp; Health Privacy Compliance
                </h2>
                <p>
                  We use privacy-safe conversion analytics (Meta Pixel, Google Analytics 4, and Google Ads conversion events) to measure campaign performance. <strong>We never transmit identifiable personal or patient health information</strong>—such as your name, mobile number, medical condition, treatment plan, or insurance details—to third-party advertising platforms.
                </p>
              </section>
            </StaggerItem>

            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  5. WhatsApp, SMS &amp; Phone Acknowledgements
                </h2>
                <p>
                  Subject to your consent on the enquiry form, we send a confirmation acknowledgement and surgical option updates via WhatsApp, SMS, or phone call. You may opt out at any time by replying STOP or emailing us.
                </p>
              </section>
            </StaggerItem>

            <StaggerItem>
              <section className="space-y-2">
                <h2 className="font-display text-lg font-bold text-[#062B61]">
                  6. Contact &amp; Data Deletion Requests
                </h2>
                <p>
                  To request access, correction, or deletion of your submitted enquiry records, contact our privacy desk at{' '}
                  <a href="mailto:acquireopd@gmail.com" className="text-[#062B61] font-semibold underline break-all hover:text-[#0D9488]">
                    acquireopd@gmail.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+919429693887" className="text-[#062B61] font-semibold underline whitespace-nowrap hover:text-[#0D9488]">
                    +91 94296 93887
                  </a>
                  .
                </p>
              </section>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </motion.div>
    </div>
  );
};
