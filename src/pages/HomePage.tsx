import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Lead } from '../types';
import { LANDING_IMAGES, CONDITION_IMAGES } from '../data/landingAssets';
import { CONDITION_PAGES } from '../data/conditionsData';
import { EnquiryForm } from '../components/EnquiryForm';
import { Logo } from '../components/Logo';
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
  HeroDecisionOrbitOverlay,
  SurgicalDecisionCompassGraphic,
  DecisionFactorVectorAccent,
  AnimatedStepIcon,
  ConditionVectorEmblem,
} from '../components/SurgicalMotionGraphics';
import {
  ArrowRight,
  Stethoscope,
  Building2,
  IndianRupee,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onLeadSubmitted: (lead: Lead) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onLeadSubmitted,
  onNavigate,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start 80%', 'end 55%'],
  });
  const smoothStepsBeam = useSpring(stepsProgress, { stiffness: 160, damping: 28 });

  const scrollToForm = () => {
    const el = document.getElementById('enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const patientQuestions = [
    {
      text: 'Am I consulting the right surgeon?',
      cardSurface: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/90 border-blue-200 hover:border-blue-400',
      activeSurface: 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] border-blue-700 text-white shadow-lg shadow-blue-500/20',
      iconTile: 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'Are there other hospitals with equally good facilities?',
      cardSurface: 'bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]/90 border-cyan-200 hover:border-cyan-400',
      activeSurface: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] border-cyan-700 text-white shadow-lg shadow-cyan-500/20',
      iconTile: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'Am I paying the right price for this procedure?',
      cardSurface: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]/90 border-amber-200 hover:border-amber-400',
      activeSurface: 'bg-gradient-to-br from-[#D97706] to-[#EA580C] border-amber-700 text-white shadow-lg shadow-amber-500/20',
      iconTile: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'Can I get quality treatment within my budget?',
      cardSurface: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]/90 border-emerald-200 hover:border-emerald-400',
      activeSurface: 'bg-gradient-to-br from-[#059669] to-[#0D9488] border-emerald-700 text-white shadow-lg shadow-emerald-500/20',
      iconTile: 'bg-gradient-to-br from-[#059669] to-[#10B981] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
  ];

  const decisionFactors = [
    {
      index: '01',
      title: 'Experienced Surgeon',
      description:
        'Explore surgeon qualifications, experience and expertise in the recommended procedure.',
      image: LANDING_IMAGES.experiencedSurgeon,
      alt: 'Experienced Indian surgical specialist reviewing procedural suitability inside a modern hospital consultation suite',
      icon: Stethoscope,
      topBar: 'from-[#1D4ED8] via-[#2563EB] to-[#0284C7]',
      cardBg: 'bg-gradient-to-b from-white via-[#EFF6FF] to-[#DBEAFE]/80 border-blue-200/90 hover:border-blue-400',
      iconBadge: 'bg-gradient-to-br from-[#1D4ED8] to-[#0284C7] text-white shadow-sm',
      indexText: 'text-[#1D4ED8]',
    },
    {
      index: '02',
      title: 'Excellent Hospital Facility',
      description:
        'Explore hospital infrastructure, technology, safety standards and post-operative care.',
      image: LANDING_IMAGES.hospitalFacility,
      alt: 'Modern NABH-accredited Indian hospital surgical wing, sterile operating theater corridor, and post-operative care facility',
      icon: Building2,
      topBar: 'from-[#0891B2] via-[#06B6D4] to-[#0D9488]',
      cardBg: 'bg-gradient-to-b from-white via-[#ECFEFF] to-[#CFFAFE]/80 border-cyan-200/90 hover:border-cyan-400',
      iconBadge: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] text-white shadow-sm',
      indexText: 'text-[#0E7490]',
    },
    {
      index: '03',
      title: 'Affordable Treatment',
      description:
        'Understand estimated surgery packages, inclusions, insurance eligibility and treatment costs.',
      image: LANDING_IMAGES.affordableTreatment,
      alt: 'Healthcare counselor explaining transparent surgical package estimates and cashless health insurance eligibility to an Indian family',
      icon: IndianRupee,
      topBar: 'from-[#059669] via-[#10B981] to-[#F59E0B]',
      cardBg: 'bg-gradient-to-b from-white via-[#ECFDF5] to-[#D1FAE5]/80 border-emerald-200/90 hover:border-emerald-400',
      iconBadge: 'bg-gradient-to-br from-[#059669] to-[#10B981] text-white shadow-sm',
      indexText: 'text-[#047857]',
    },
  ];

  const nextSteps = [
    {
      step: '01',
      title: 'Understand',
      desc: 'Our team reviews your treatment requirements and budget.',
      accentTop: 'from-[#1D4ED8] to-[#0284C7]',
      cardSurface: 'bg-gradient-to-br from-white via-[#EFF6FF] to-[#DBEAFE]/80 border-blue-200 hover:border-blue-400',
      badgeText: 'text-[#1D4ED8]',
    },
    {
      step: '02',
      title: 'Explore',
      desc: 'We identify suitable surgeon and hospital options.',
      accentTop: 'from-[#0891B2] to-[#0D9488]',
      cardSurface: 'bg-gradient-to-br from-white via-[#ECFEFF] to-[#CFFAFE]/80 border-cyan-200 hover:border-cyan-400',
      badgeText: 'text-[#0E7490]',
    },
    {
      step: '03',
      title: 'Compare',
      desc: 'We help you understand experience, facilities and estimated package costs.',
      accentTop: 'from-[#D97706] to-[#F59E0B]',
      cardSurface: 'bg-gradient-to-br from-white via-[#FFFBEB] to-[#FEF3C7]/80 border-amber-200 hover:border-amber-400',
      badgeText: 'text-[#B45309]',
    },
    {
      step: '04',
      title: 'Decide',
      desc: 'You choose the suitable option after consulting the treating surgeon.',
      accentTop: 'from-[#059669] to-[#10B981]',
      cardSurface: 'bg-gradient-to-br from-white via-[#ECFDF5] to-[#D1FAE5]/80 border-emerald-200 hover:border-emerald-400',
      badgeText: 'text-[#047857]',
    },
  ];

  const conditionCardStyles: Record<
    string,
    { surface: string; topBar: string; ctaText: string }
  > = {
    hernia: {
      surface: 'bg-gradient-to-br from-white via-[#EFF6FF] to-[#DBEAFE]/85 border-blue-200 hover:border-blue-400',
      topBar: 'from-[#1D4ED8] to-[#0284C7]',
      ctaText: 'text-[#1D4ED8]',
    },
    'gallbladder-stones': {
      surface: 'bg-gradient-to-br from-white via-[#ECFEFF] to-[#CFFAFE]/85 border-cyan-200 hover:border-cyan-400',
      topBar: 'from-[#0891B2] to-[#06B6D4]',
      ctaText: 'text-[#0E7490]',
    },
    piles: {
      surface: 'bg-gradient-to-br from-white via-[#F0FDFA] to-[#CCFBF1]/85 border-teal-200 hover:border-teal-400',
      topBar: 'from-[#0D9488] to-[#14B8A6]',
      ctaText: 'text-[#0F766E]',
    },
    fissure: {
      surface: 'bg-gradient-to-br from-white via-[#EEF2FF] to-[#E0E7FF]/85 border-indigo-200 hover:border-indigo-400',
      topBar: 'from-[#4F46E5] to-[#6366F1]',
      ctaText: 'text-[#4338CA]',
    },
    fistula: {
      surface: 'bg-gradient-to-br from-white via-[#ECFDF5] to-[#D1FAE5]/85 border-emerald-200 hover:border-emerald-400',
      topBar: 'from-[#059669] to-[#10B981]',
      ctaText: 'text-[#047857]',
    },
  };

  return (
    <div className="bg-[#EFF6FF] text-slate-800 overflow-x-clip">
      {/* SECTION 1 – PREMIUM COLOURFUL MULTI-LAYERED HERO BANNER */}
      <section className="relative bg-[#031636] text-white overflow-hidden">
        {/* Full-Width High-Resolution Hospital Atrium Architectural Backdrop */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.img
            src={LANDING_IMAGES.heroHospitalAtrium}
            alt=""
            loading="eager"
            decoding="sync"
            referrerPolicy="no-referrer"
            initial={{ scale: 1.06, opacity: 0.72 }}
            animate={{ scale: [1.04, 1.08, 1.04], opacity: 0.85 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full object-cover object-center will-change-transform"
          />
          {/* Rich Colourful Oceanic-Royal-Teal Gradient Overlay for Crisp WCAG Contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#031636]/94 via-[#063269]/88 to-[#0B6E78]/82" />
          <div
            className="absolute inset-0 opacity-75"
            style={{
              backgroundImage:
                'radial-gradient(circle at 14% 22%, rgba(56, 189, 248, 0.24), transparent 45%), radial-gradient(circle at 86% 24%, rgba(45, 212, 191, 0.24), transparent 44%), radial-gradient(circle at 72% 88%, rgba(245, 158, 11, 0.14), transparent 40%)',
            }}
          />
        </div>

        <AmbientMedicalGraphic variant="dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-22 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: EASE_SMOOTH }}
                className="space-y-2"
              >
                <Logo size="sm" variant="white" showTagline={false} />
                <p className="text-sm font-semibold text-[#6EE7B7] tracking-tight">
                  Your Surgical Decision Partner
                </p>
              </motion.div>

              <div className="space-y-3">
                <KineticText
                  as="h1"
                  text="Before You Decide on Surgery, Explore Your Options."
                  className="font-display font-extrabold text-white tracking-tight leading-[1.11]"
                  style={{ fontSize: 'clamp(1.95rem, 3.9vw, 3.35rem)', textWrap: 'balance' }}
                  delay={0.05}
                />
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, delay: 0.28, ease: EASE_SMOOTH }}
                  className="font-display text-base sm:text-xl font-bold bg-gradient-to-r from-[#38BDF8] via-[#2DD4BF] to-[#FDE68A] bg-clip-text text-transparent"
                >
                  The Right Surgeon. The Right Hospital. The Right Price.
                </motion.p>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.34, ease: EASE_SMOOTH }}
                className="text-sm sm:text-base text-sky-100/95 leading-relaxed max-w-xl"
              >
                Have you been advised to undergo surgery? You don&apos;t have to settle for the first option you find. Discover suitable surgical options based on your treatment needs and affordability.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.4, ease: EASE_SMOOTH }}
                className="pt-1 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5">
                  <motion.button
                    id="hero-explore-options-btn"
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                    onClick={scrollToForm}
                    className="group relative overflow-hidden w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#34D399] via-[#2DD4BF] to-[#38BDF8] hover:from-[#6EE7B7] hover:to-[#7DD3FC] text-[#041B42] text-sm sm:text-base font-extrabold tracking-wide px-7 sm:px-8 py-3.5 rounded-xl shadow-xl shadow-teal-950/35 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                    <span className="relative">EXPLORE MY SURGICAL OPTIONS</span>
                    <ArrowRight className="relative w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </motion.button>

                  <a
                    href="#decision-factors"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('decision-factors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-sky-100 hover:text-[#6EE7B7] underline underline-offset-4 decoration-cyan-400/50 hover:decoration-[#6EE7B7] transition-colors whitespace-nowrap shrink-0 py-2"
                  >
                    <span>Compare 3 Decision Factors</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-sky-200/90 leading-relaxed max-w-lg">
                  Acquire Surgery is not a hospital — we are an independent Surgical Decision Partner helping patients compare suitable options across participating surgeons and hospitals.
                </p>
              </motion.div>
            </div>

            {/* Hero Right Column: Layered Multi-Image Composition with Parallax & Overlapping Lifestyle Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.16, ease: EASE_SMOOTH }}
              className="lg:col-span-6 sm:px-3 lg:px-4 sm:py-4"
            >
              <div className="relative sm:pb-6">
                <HeroDecisionOrbitOverlay />

                {/* Primary Hero Frame */}
                <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/50 bg-[#06224F] aspect-[16/10] shadow-2xl shadow-slate-950/60">
                  <ParallaxFrame offset={10} className="w-full h-full">
                    <ResilientImage
                      src={LANDING_IMAGES.heroConsultation}
                      alt="Indian senior surgeon explaining surgical options on a tablet to a patient and spouse during an informed hospital consultation"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      fallbackLabel="Informed Surgical Consultation"
                      className="w-full h-full object-cover object-[center_20%] scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                  </ParallaxFrame>

                  {/* Measured Contrast Scrim Aligned Bottom-Left so Overlapping Inset Frame Never Covers Quote */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/95 via-[#031636]/65 to-transparent p-4 sm:p-5">
                    <p className="text-xs sm:text-sm font-medium text-white sm:max-w-[54%] leading-snug">
                      &ldquo;Don&apos;t make a blind surgical decision. Explore your options before choosing your surgeon, hospital and treatment package.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Desktop & Tablet Overlapping Secondary Lifestyle Frame (Bottom-Right) */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.34, ease: EASE_SMOOTH }}
                  className="hidden sm:block absolute -bottom-1 -right-2 lg:-right-3 w-[42%] z-20"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="group rounded-xl overflow-hidden border-2 border-white/90 bg-[#06224F] aspect-[4/3] shadow-2xl shadow-slate-950/60"
                  >
                    <ResilientImage
                      src={LANDING_IMAGES.heroFamilyCare}
                      alt="Indian patient couple walking alongside a smiling senior surgeon and care coordinator in a modern hospital wing"
                      loading="eager"
                      decoding="sync"
                      fallbackLabel="Guided Surgical Support"
                      className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/95 via-[#031636]/55 to-transparent px-3 py-2.5">
                      <span className="block text-[11px] font-bold text-[#6EE7B7] leading-tight">
                        Guided Care Navigation
                      </span>
                      <span className="block text-[11px] font-medium text-white/95 leading-tight">
                        Explore before committing
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Mobile Companion Card Strip (Shown Cleanly Below Main Image Without Tight Cropping) */}
                <div className="mt-3.5 grid grid-cols-2 gap-3 sm:hidden">
                  <div className="relative rounded-xl overflow-hidden border border-cyan-300/40 aspect-[4/3] bg-[#06224F]">
                    <ResilientImage
                      src={LANDING_IMAGES.heroFamilyCare}
                      alt="Indian patient couple consulting with senior surgeon and care advisor"
                      loading="eager"
                      fallbackLabel="Patient Care"
                      className="w-full h-full object-cover object-[center_18%]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/90 to-transparent px-2.5 py-2">
                      <span className="block text-[11px] font-semibold text-white">Personal Guidance</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-[#6EE7B7] leading-tight">
                      3 Key Comparison Factors
                    </span>
                    <div className="space-y-1 text-xs font-semibold text-white/95">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span className="truncate">Surgeon Fit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                        <span className="truncate">Hospital Facility</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
                        <span className="truncate">Package Clarity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-Width 3-Pillar Bottom Anchor Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease: EASE_SMOOTH }}
            className="mt-10 sm:mt-14 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0284C7] flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">01. Experienced Surgeons</p>
                <p className="text-xs text-sky-100/85 mt-0.5 truncate">Qualifications &amp; clinical track record</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#0D9488] flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">02. Hospital Facilities</p>
                <p className="text-xs text-sky-100/85 mt-0.5 truncate">NABH safety, OT suites &amp; post-op care</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-sm">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">03. Affordable Packages</p>
                <p className="text-xs text-sky-100/85 mt-0.5 truncate">Clear estimates &amp; cashless TPA support</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Organic Smooth Wave Transition Into Section 2 */}
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-7 sm:h-12">
            <path
              d="M0 32C240 64 480 64 720 34C960 4 1200 4 1440 32V60H0V32Z"
              fill="#EFF6FF"
            />
          </svg>
        </div>
      </section>

      {/* SECTION 2 – PATIENT STORY / PROBLEM (LIFESTYLE IMAGE + QUESTION CARDS + COMPASS) */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-br from-[#EFF6FF] via-[#F5F3FF] to-[#FFF1F2] border-b border-indigo-200/70 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-45 bg-gradient-to-br from-cyan-200 to-indigo-200"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-amber-200 to-rose-200"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeInView className="space-y-3 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Why Exploring Matters
            </p>
            <KineticText
              as="h2"
              inView
              text="You've Been Told What Surgery You Need. But Do You Know Where to Get It Done?"
              className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            />
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              After a diagnosis, patients and families often have several unanswered questions:
            </p>
          </FadeInView>

          {/* Creative Split: Warm Family Lifestyle Image + Interactive Question Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <FadeInView className="lg:col-span-5">
              <div className="relative h-full min-h-[260px] rounded-2xl overflow-hidden border border-indigo-200/90 shadow-lg group bg-slate-900">
                <ParallaxFrame offset={10} className="w-full h-full">
                  <ResilientImage
                    src={LANDING_IMAGES.patientFamilyClarity}
                    alt="Indian couple comparing surgical hospital options and treatment packages calmly from home on a laptop"
                    loading="lazy"
                    decoding="async"
                    fallbackLabel="Compare Surgical Options Calmly"
                    className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </ParallaxFrame>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/65 to-transparent p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                    Informed Family Decisions
                  </p>
                  <p className="text-sm font-medium text-white mt-1 leading-snug">
                    Take a moment to compare qualified surgeons, hospital wings, and transparent package estimates before finalizing your surgery.
                  </p>
                </div>
              </div>
            </FadeInView>

            <StaggerContainer className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patientQuestions.map((item, idx) => {
                const isSelected = activeQuestionIdx === idx;
                return (
                  <StaggerItem key={idx} className="h-full">
                    <motion.button
                      type="button"
                      onMouseEnter={() => setActiveQuestionIdx(idx)}
                      onMouseLeave={() => setActiveQuestionIdx(null)}
                      onFocus={() => setActiveQuestionIdx(idx)}
                      onBlur={() => setActiveQuestionIdx(null)}
                      onClick={() => setActiveQuestionIdx(isSelected ? null : idx)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                      className={`w-full h-full text-left border rounded-2xl p-5 flex items-start gap-3.5 shadow-sm transition-all cursor-pointer ${
                        isSelected ? item.activeSurface : item.cardSurface
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? item.activeIconTile : item.iconTile
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-sm sm:text-base font-semibold leading-snug pt-1 ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.text}
                      </p>
                    </motion.button>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Animated Surgical Decision Compass Visual Diagram */}
          <FadeInView delay={0.08}>
            <SurgicalDecisionCompassGraphic activeIndex={activeQuestionIdx} />
          </FadeInView>

          <FadeInView delay={0.12}>
            <div className="bg-gradient-to-r from-[#062B61] via-[#0E7490] to-[#047857] text-white rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl shadow-cyan-950/15">
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                Patients often lack the time, information and connections to explore multiple options.
              </p>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                Acquire Surgery understands your treatment requirements and affordability. We help you explore suitable surgeons, hospitals and treatment packages so you can make an informed decision.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* SECTION 3 – OUR THREE DECISION FACTORS (OCEAN-MINT & VIBRANT PHOTO CARDS) */}
      <section
        id="decision-factors"
        className="relative py-12 sm:py-20 bg-gradient-to-b from-[#ECFEFF] via-[#E0F2FE]/80 to-[#F0FDFA] border-b border-cyan-200/80 scroll-mt-16 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full blur-3xl opacity-35 bg-gradient-to-tr from-sky-200 via-teal-200 to-emerald-200"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeInView className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
              Our Three Decision Factors
            </p>
            <KineticText
              as="h2"
              inView
              text="Every Option Evaluated on Three Pillars"
              className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight"
            />
            <p className="text-sm sm:text-base text-slate-700">
              We help patients who have already been diagnosed and advised to undergo surgery compare options across participating surgeons and hospitals.
            </p>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {decisionFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <StaggerItem key={factor.index} className="h-full">
                  <InteractiveTiltCard>
                    <article
                      className={`group h-full border rounded-2xl overflow-hidden flex flex-col transition-all shadow-md hover:shadow-xl ${factor.cardBg}`}
                    >
                      <div className={`h-2 bg-gradient-to-r ${factor.topBar}`} />
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-white/60 relative">
                        <ResilientImage
                          src={factor.image}
                          alt={factor.alt}
                          loading="lazy"
                          decoding="async"
                          fallbackLabel={factor.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062B61]/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="inline-flex items-center gap-2.5">
                            <span className={`w-8 h-8 rounded-lg inline-flex items-center justify-center ${factor.iconBadge}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className={`font-bold ${factor.indexText}`}>
                              {factor.index}. Decision Factor
                            </span>
                          </span>
                          <DecisionFactorVectorAccent index={factor.index} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {factor.title}
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {factor.description}
                        </p>
                      </div>
                    </article>
                  </InteractiveTiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 4 – ENQUIRY FORM + CARE COORDINATOR VISUAL COMPANION */}
      <section
        id="enquiry-form"
        className="relative py-12 sm:py-20 bg-gradient-to-br from-[#0F2958] via-[#0B5577] to-[#0D7A6E] scroll-mt-16 overflow-hidden"
      >
        <AmbientMedicalGraphic variant="dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Companion Visual Showcase */}
            <FadeInView className="lg:col-span-5 space-y-5 text-white">
              <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/35 bg-slate-900 aspect-[4/3] shadow-2xl shadow-slate-950/40">
                <ResilientImage
                  src={LANDING_IMAGES.careCoordinatorSupport}
                  alt="Acquire Surgery patient care coordinator holding a tablet inside a bright modern coordination lounge"
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Dedicated Care Coordination"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/65 to-transparent p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                    Dedicated Care Coordination
                  </p>
                  <p className="text-sm font-medium text-white mt-1 leading-snug">
                    Personalized guidance to match your diagnosis, insurance coverage, and preferred budget.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 space-y-3.5">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#6EE7B7] shrink-0" />
                  <span>What You Receive After Enquiring</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-sky-100">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#6EE7B7] shrink-0 mt-0.5" />
                    <span>Profiles of experienced specialist surgeons matched to your procedure</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Accredited hospital options with safety &amp; room-category transparency</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FDE68A] shrink-0 mt-0.5" />
                    <span>Indicative package estimates &amp; cashless TPA insurance clarity</span>
                  </li>
                </ul>
              </div>
            </FadeInView>

            {/* Right Conversion Form */}
            <div className="lg:col-span-7">
              <FadeInView delay={0.08}>
                <EnquiryForm
                  onSuccess={onLeadSubmitted}
                  onNavigatePrivacy={() => onNavigate('/privacy-policy')}
                />
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 – WHAT HAPPENS NEXT? (LIFESTYLE BANNER + 4 COLOURFUL STEP CARDS) */}
      <section
        id="what-happens-next"
        className="relative py-12 sm:py-20 bg-gradient-to-br from-[#FFFBEB] via-[#F0F9FF] to-[#ECFDF5] border-y border-amber-200/60 scroll-mt-16 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-45 bg-gradient-to-br from-amber-200 to-orange-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-45 bg-gradient-to-br from-emerald-200 to-cyan-200"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Lifestyle Image + Process Intro Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <FadeInView className="lg:col-span-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                Simple 4-Step Process
              </p>
              <KineticText
                as="h2"
                inView
                text="What Happens Next?"
                className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight"
              />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
                From understanding your medical plan to stepping confidently into recovery, our coordination steps keep you and your family fully informed without pressure.
              </p>
            </FadeInView>

            <FadeInView delay={0.08} className="lg:col-span-6">
              <div className="group relative rounded-2xl overflow-hidden border border-emerald-200/90 aspect-video shadow-lg bg-slate-900">
                <ResilientImage
                  src={LANDING_IMAGES.surgicalRecoveryLifestyle}
                  alt="Healthy recovered Indian couple walking happily along a sunlit green park pathway after successful planned surgery"
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Confident Surgical Recovery"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/90 via-[#041B42]/45 to-transparent p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Better decisions lead to smoother surgical journeys and peace of mind.
                  </p>
                </div>
              </div>
            </FadeInView>
          </div>

          <div ref={stepsContainerRef} className="relative">
            {/* Scroll-driven connecting multi-colour progress beam on desktop */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-11 left-12 right-12 h-[3px] bg-slate-200/90 rounded-full overflow-hidden"
            >
              <motion.div
                style={{ scaleX: smoothStepsBeam }}
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#06B6D4] via-[#F59E0B] to-[#10B981] origin-left"
              />
            </div>

            <StaggerContainer className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {nextSteps.map((item) => (
                <StaggerItem key={item.step} className="h-full">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                    className={`h-full border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col ${item.cardSurface}`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${item.accentTop}`} />
                    <div className="p-5 sm:p-6 space-y-3.5 flex-1">
                      <div className="flex items-center justify-between">
                        <AnimatedStepIcon step={item.step} />
                        <span className={`font-mono text-xs font-bold tabular-nums ${item.badgeText}`}>
                          STEP {item.step}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CONDITION GUIDES (COLOURFUL PHOTO-BACKED PROCEDURE DIRECTORY) */}
      <section
        id="condition-guides"
        className="relative py-12 sm:py-16 bg-gradient-to-br from-[#EEF2FF] via-[#E0F2FE]/80 to-[#ECFDF5] border-b border-indigo-200/70 scroll-mt-16 overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <FadeInView className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                Procedure Guides
              </p>
              <KineticText
                as="h2"
                inView
                text="Explore Options by Surgical Condition"
                className="font-display text-2xl sm:text-3xl font-extrabold text-[#062B61] tracking-tight"
              />
            </div>
            <p className="text-sm text-slate-700 max-w-md">
              Select a condition below to read procedure approaches, typical stay durations, and estimated package ranges.
            </p>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {CONDITION_PAGES.map((cond) => {
              const cardStyle = conditionCardStyles[cond.slug] || {
                surface: 'bg-white border-slate-200 hover:border-[#062B61]',
                topBar: 'from-[#062B61] to-[#0D9488]',
                ctaText: 'text-[#062B61]',
              };
              const condVisual = CONDITION_IMAGES[cond.slug];
              return (
                <StaggerItem key={cond.slug} className="h-full">
                  <motion.a
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                    href={`/conditions/${cond.slug}`}
                    title={`Explore ${cond.condition} surgery options, hospitals & estimated cost`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/conditions/${cond.slug}`);
                    }}
                    className={`group h-full border rounded-2xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-xl ${cardStyle.surface}`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${cardStyle.topBar}`} />
                    {condVisual && (
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative border-b border-white/70">
                        <ResilientImage
                          src={condVisual.src}
                          alt={condVisual.alt}
                          loading="lazy"
                          decoding="async"
                          fallbackLabel={cond.condition}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <ConditionVectorEmblem slug={cond.slug} size="sm" />
                          <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#062B61] transition-colors">
                            {cond.condition}
                          </h3>
                        </div>
                        <p className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                          {cond.estimatedRange}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${cardStyle.ctaText} group-hover:text-[#062B61] transition-colors`}>
                        <span>View Options</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 6 – FINAL VIBRANT AURORA CTA */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-br from-[#041B42] via-[#1E3A8A] via-[#0E7490] to-[#065F46] text-white overflow-hidden">
        <AmbientMedicalGraphic variant="dark" />
        <FadeInView className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <KineticText
            as="h2"
            inView
            text="Your Health Deserves the Right Decision. Not the First Available Option."
            className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          />
          <p className="text-sm sm:text-lg text-sky-100 max-w-2xl mx-auto">
            Explore your surgical options before committing to a treatment package.
          </p>
          <div className="pt-2">
            <motion.button
              id="final-cta-explore-btn"
              type="button"
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE_SMOOTH }}
              onClick={scrollToForm}
              className="group relative overflow-hidden w-full sm:w-auto min-h-[54px] inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#34D399] via-[#2DD4BF] to-[#38BDF8] hover:from-[#6EE7B7] hover:to-[#7DD3FC] text-[#041B42] text-sm sm:text-base font-extrabold tracking-wide px-8 sm:px-9 py-3.5 rounded-xl shadow-xl shadow-slate-950/35 transition-all cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <span className="relative">EXPLORE MY SURGICAL OPTIONS</span>
              <ArrowRight className="relative w-5 h-5 text-[#041B42] transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </FadeInView>
      </section>
    </div>
  );
};
