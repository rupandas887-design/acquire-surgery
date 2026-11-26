import React from 'react';
import { motion } from 'motion/react';
import { ConditionPageInfo, Lead } from '../types';
import { EnquiryForm } from '../components/EnquiryForm';
import { CONDITION_PAGES } from '../data/conditionsData';
import { CONDITION_IMAGES, LANDING_IMAGES } from '../data/landingAssets';
import { ResilientImage } from '../components/ResilientImage';
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
  AmbientMedicalGraphic,
  KineticText,
  ParallaxFrame,
  InteractiveTiltCard,
  EASE_SMOOTH,
} from '../components/MotionPrimitives';
import {
  ConditionVectorEmblem,
  SurgicalApproachTrajectoryGraphic,
} from '../components/SurgicalMotionGraphics';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ConditionLandingPageProps {
  conditionInfo: ConditionPageInfo;
  onLeadSubmitted: (lead: Lead) => void;
  onNavigate: (path: string) => void;
}

export const ConditionLandingPage: React.FC<ConditionLandingPageProps> = ({
  conditionInfo,
  onLeadSubmitted,
  onNavigate,
}) => {
  const scrollToForm = () => {
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroVisual = CONDITION_IMAGES[conditionInfo.slug];

  return (
    <div className="bg-[#EFF6FF] text-slate-800 overflow-x-clip">
      {/* Condition Deep Oceanic-Royal Split Hero */}
      <section className="relative bg-gradient-to-br from-[#041B42] via-[#073B7A] to-[#0B6E78] text-white overflow-hidden">
        <AmbientMedicalGraphic variant="dark" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 space-y-6">
          <motion.a
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: EASE_SMOOTH }}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sky-200 hover:text-white py-1 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All Surgical Options</span>
          </motion.a>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                className="flex items-center gap-3.5"
              >
                <ConditionVectorEmblem slug={conditionInfo.slug} size="lg" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                  {conditionInfo.condition} · Surgical Decision Guide
                </p>
              </motion.div>
              <KineticText
                as="h1"
                text={conditionInfo.headline}
                className="font-display text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]"
                style={{ textWrap: 'balance' }}
                delay={0.06}
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.46, delay: 0.12, ease: EASE_SMOOTH }}
                className="text-sm sm:text-lg text-sky-100 leading-relaxed"
              >
                {conditionInfo.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.46, delay: 0.18, ease: EASE_SMOOTH }}
                className="pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  onClick={scrollToForm}
                  className="group relative overflow-hidden w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#34D399] via-[#2DD4BF] to-[#38BDF8] hover:from-[#6EE7B7] hover:to-[#7DD3FC] text-[#041B42] text-sm font-extrabold px-6 py-3 rounded-xl shadow-xl shadow-teal-950/30 transition-all cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  />
                  <span className="relative">EXPLORE {conditionInfo.condition.toUpperCase()} OPTIONS</span>
                  <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.button>
                <div className="text-sm text-sky-100">
                  Indicative Package Range:{' '}
                  <strong className="font-mono text-[#FDE68A] tabular-nums">
                    {conditionInfo.estimatedRange}
                  </strong>
                </div>
              </motion.div>
            </div>

            {heroVisual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.16, ease: EASE_SMOOTH }}
                className="lg:col-span-5"
              >
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute inset-0 rounded-2xl bg-gradient-to-br from-[#38BDF8]/40 via-[#2DD4BF]/35 to-[#F59E0B]/30 translate-x-2.5 translate-y-2.5"
                  />
                  <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/45 bg-slate-900 aspect-[4/3] shadow-2xl shadow-slate-950/50">
                    <ParallaxFrame offset={10} className="w-full h-full">
                      <ResilientImage
                        src={heroVisual.src}
                        alt={heroVisual.alt}
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        fallbackLabel={`${conditionInfo.condition} Care Options`}
                        className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.09]"
                      />
                    </ParallaxFrame>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/55 to-transparent p-4">
                      <p className="text-xs font-semibold text-white">
                        {conditionInfo.condition} · Compare Specialists, Hospitals &amp; Estimates
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Condition Medical & Package Details */}
      <section className="relative py-10 sm:py-16 bg-gradient-to-br from-[#EFF6FF] via-[#F5F3FF]/70 to-[#ECFEFF] border-b border-indigo-200/70 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl opacity-35 bg-gradient-to-br from-cyan-200 to-indigo-200"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <FadeInView>
              <div className="bg-gradient-to-br from-white via-[#F8FAFF] to-[#EFF6FF] border border-blue-200/80 rounded-2xl overflow-hidden shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-[#1D4ED8] via-[#0284C7] to-[#0D9488]" />
                <div className="p-5 sm:p-8 space-y-4">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#062B61]">
                    Understanding {conditionInfo.condition} Surgery Decisions
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {conditionInfo.overview}
                  </p>

                  <div className="pt-2 space-y-2.5">
                    <h3 className="text-sm font-bold text-[#0E7490]">
                      Common Reasons Surgery Is Advised
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {conditionInfo.whenAdvised.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Surgical Approaches */}
            <div className="space-y-4">
              <FadeInView>
                <h2 className="font-display text-xl font-extrabold text-[#062B61]">
                  Common Surgical Approaches Compared
                </h2>
              </FadeInView>
              <FadeInView delay={0.04}>
                <SurgicalApproachTrajectoryGraphic conditionName={conditionInfo.condition} />
              </FadeInView>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {conditionInfo.surgicalApproaches.map((approach, idx) => (
                  <StaggerItem key={idx} className="h-full">
                    <InteractiveTiltCard maxTilt={2.5}>
                      <div
                        className={`h-full border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                          idx % 2 === 0
                            ? 'bg-gradient-to-br from-white via-[#EFF6FF] to-[#DBEAFE]/70 border-blue-200 hover:border-blue-400'
                            : 'bg-gradient-to-br from-white via-[#ECFEFF] to-[#CFFAFE]/70 border-cyan-200 hover:border-cyan-400'
                        }`}
                      >
                        <div
                          className={`h-1 bg-gradient-to-r ${
                            idx % 2 === 0 ? 'from-[#1D4ED8] to-[#0284C7]' : 'from-[#0891B2] to-[#10B981]'
                          }`}
                        />
                        <div className="p-5 space-y-2.5">
                          <h3 className="font-display text-base font-bold text-slate-900">
                            {approach.name}
                          </h3>
                          <div className="text-xs font-mono font-semibold text-[#0E7490] flex flex-wrap items-center gap-2">
                            <span>Stay: {approach.stay}</span>
                            <span aria-hidden="true">·</span>
                            <span>Recovery: {approach.recovery}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {approach.note}
                          </p>
                        </div>
                      </div>
                    </InteractiveTiltCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* Insurance, Lifestyle Recovery & Questions Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <FadeInView delay={0.08}>
              <div className="bg-gradient-to-br from-[#062B61] via-[#0E7490] to-[#047857] text-white rounded-2xl p-6 space-y-3 shadow-lg shadow-cyan-950/15">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-[#6EE7B7]">
                  <ShieldCheck className="w-5 h-5 text-[#6EE7B7]" />
                  <span>Insurance &amp; Payment Clarity</span>
                </h2>
                <p className="text-sm text-sky-50 leading-relaxed">
                  {conditionInfo.insuranceNote}
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.14}>
              <div className="bg-gradient-to-br from-white via-[#FFFBEB] to-[#FEF3C7]/70 border border-amber-200/90 rounded-2xl overflow-hidden shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#0D9488]" />
                <div className="p-5 sm:p-6 space-y-3">
                  <h2 className="font-display text-base font-bold text-[#062B61]">
                    Questions We Help You Clarify
                  </h2>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {conditionInfo.questionsToAsk.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#D97706] mt-0.5 shrink-0">
                          0{idx + 1}.
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.18}>
              <div className="group rounded-2xl overflow-hidden border border-cyan-200 shadow-md bg-slate-900 relative aspect-video">
                <ResilientImage
                  src={LANDING_IMAGES.surgicalRecoveryLifestyle}
                  alt={`Healthy life after planned ${conditionInfo.condition} surgical care`}
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Smooth Surgical Recovery"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/50 to-transparent p-4">
                  <p className="text-xs font-semibold text-[#6EE7B7]">
                    Return to Everyday Comfort
                  </p>
                  <p className="text-xs text-white/95 mt-0.5">
                    Compare suitable day-care and minimally invasive {conditionInfo.condition.toLowerCase()} options first.
                  </p>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Pre-Populated Central Enquiry Form with Coordinator Visual */}
      <section
        id="enquiry-form"
        className="relative py-12 sm:py-16 bg-gradient-to-br from-[#0F2958] via-[#0B5577] to-[#0D7A6E] scroll-mt-16 overflow-hidden"
      >
        <AmbientMedicalGraphic variant="dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <FadeInView className="lg:col-span-5 space-y-5 text-white">
              <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/35 bg-slate-900 aspect-[4/3] shadow-2xl shadow-slate-950/40">
                <ResilientImage
                  src={LANDING_IMAGES.careCoordinatorSupport}
                  alt={`Dedicated surgical coordinator helping compare ${conditionInfo.condition} options across partner hospitals`}
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Care Coordinator Assistance"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/60 to-transparent p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                    {conditionInfo.condition} Option Review
                  </p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    Share your preferences for customized surgeon and hospital recommendations.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-[#6EE7B7] shrink-0 mt-0.5" />
                  <span>Compare qualified general &amp; laparoscopic surgeons</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>Check insurance TPA coverage &amp; room-category pricing</span>
                </div>
              </div>
            </FadeInView>

            <div className="lg:col-span-7">
              <FadeInView delay={0.08}>
                <EnquiryForm
                  initialCondition={conditionInfo.condition}
                  onSuccess={onLeadSubmitted}
                  onNavigatePrivacy={() => onNavigate('/privacy-policy')}
                />
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Other Condition Pages */}
      <section className="py-8 sm:py-10 bg-gradient-to-r from-[#EFF6FF] via-[#F0F9FF] to-[#ECFDF5] border-t border-sky-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Other Surgical Guides
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CONDITION_PAGES.filter((c) => c.slug !== conditionInfo.slug).map((c) => (
              <a
                key={c.slug}
                href={`/conditions/${c.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/conditions/${c.slug}`);
                }}
                className="text-sm font-semibold text-[#062B61] hover:text-[#0D9488] hover:underline underline-offset-4 py-1 min-h-[36px] inline-flex items-center transition-colors"
              >
                {c.condition}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
