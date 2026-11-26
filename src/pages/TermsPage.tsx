import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { AmbientMedicalGraphic, KineticText, StaggerContainer, StaggerItem, EASE_SMOOTH } from '../components/MotionPrimitives';

interface TermsPageProps {
  onNavigateHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigateHome }) => {
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
        <div className="p-5 sm:p-10 space-y-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#062B61] hover:text-[#0D9488] hover:underline underline-offset-4 cursor-pointer py-1 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Acquire Surgery</span>
          </button>

          <KineticText
            as="h1"
            text="Terms of Assistance"
            className="font-display text-2xl sm:text-3xl font-extrabold text-[#062B61] tracking-tight"
          />
          <p className="text-xs font-mono font-semibold text-[#0D9488]">
            Acquire Surgery – Your Surgical Decision Partner
          </p>

          <StaggerContainer className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <StaggerItem>
              <p>
                <strong className="text-[#062B61]">1. Decision Support Role:</strong> Acquire Surgery is not a hospital and does not provide medical diagnosis or perform surgery. We assist patients who have already been diagnosed and advised surgery in comparing participating surgeons, hospital facilities, and estimated treatment packages.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                <strong className="text-[#062B61]">2. Indicative Package Estimates:</strong> Treatment cost ranges shared during option exploration are indicative estimates based on standard procedures. Final billing depends on clinical evaluation by the treating surgeon, room category selection, comorbidities, consumables, and hospital/insurer approval.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                <strong className="text-[#062B61]">3. Patient Choice:</strong> You are always free to select any surgeon or hospital after directly consulting the treating doctor.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </motion.div>
    </div>
  );
};
