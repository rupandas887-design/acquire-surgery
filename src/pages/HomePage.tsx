import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Lead } from '../types';
import { LANDING_IMAGES, CONDITION_IMAGES } from '../data/landingAssets';
import { CONDITION_PAGES } from '../data/conditionsData';
import { EnquiryForm } from '../components/EnquiryForm';
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
  ChevronDown,
  ShieldCheck,
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
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start 80%', 'end 55%'],
  });
  const smoothStepsBeam = useSpring(stepsProgress, { stiffness: 160, damping: 28 });

  const scrollToForm = () => {
    const el =
      document.getElementById('surgery-requirements-form') ||
      document.getElementById('enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const patientQuestions = [
    {
      text: 'Hospital quoted ₹1,00,000 — can I find another suitable option?',
      cardSurface: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/90 border-blue-200 hover:border-blue-400',
      activeSurface: 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] border-blue-700 text-white shadow-lg shadow-blue-500/20',
      iconTile: 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'Which accredited hospitals match my surgery budget safely?',
      cardSurface: 'bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]/90 border-cyan-200 hover:border-cyan-400',
      activeSurface: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] border-cyan-700 text-white shadow-lg shadow-cyan-500/20',
      iconTile: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'Am I consulting an experienced surgeon for this procedure?',
      cardSurface: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]/90 border-amber-200 hover:border-amber-400',
      activeSurface: 'bg-gradient-to-br from-[#D97706] to-[#EA580C] border-amber-700 text-white shadow-lg shadow-amber-500/20',
      iconTile: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
    {
      text: 'How do I compare hospital surgery costs before deciding?',
      cardSurface: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]/90 border-emerald-200 hover:border-emerald-400',
      activeSurface: 'bg-gradient-to-br from-[#059669] to-[#0D9488] border-emerald-700 text-white shadow-lg shadow-emerald-500/20',
      iconTile: 'bg-gradient-to-br from-[#059669] to-[#10B981] text-white shadow-sm',
      activeIconTile: 'bg-white/20 text-white',
    },
  ];

  const budgetExamples = [
    {
      slug: 'piles',
      title: 'Piles Surgery Within Your Budget',
      summary: 'Explore laser & stapler piles operation cost options at credible hospitals.',
      range: '₹35,000 – ₹1,10,000 (Indicative)',
      accent: 'from-[#0D9488] to-[#14B8A6]',
    },
    {
      slug: 'hernia',
      title: 'Affordable Hernia Surgery Options',
      summary: 'Compare laparoscopic vs. open mesh repair estimates and hospital facilities.',
      range: '₹45,000 – ₹1,45,000 (Indicative)',
      accent: 'from-[#1D4ED8] to-[#0284C7]',
    },
    {
      slug: 'gallbladder-stones',
      title: 'Gallbladder Stone Surgery Cost Options',
      summary: 'Review laparoscopic cholecystectomy hospital options & package inclusions.',
      range: '₹50,000 – ₹1,55,000 (Indicative)',
      accent: 'from-[#0891B2] to-[#06B6D4]',
    },
    {
      slug: 'uterine-fibroids',
      title: 'Affordable Uterine Fibroid Surgery',
      summary: 'Explore myomectomy & laparoscopic gynecological surgery options by budget.',
      range: '₹55,000 – ₹1,65,000 (Indicative)',
      accent: 'from-[#E11D48] to-[#FB7185]',
    },
    {
      slug: 'endometriosis',
      title: 'Endometriosis Treatment Options',
      summary: 'Find experienced laparoscopy specialists & accredited hospitals aligned with affordability.',
      range: '₹50,000 – ₹1,60,000 (Indicative)',
      accent: 'from-[#7C3AED] to-[#A855F7]',
    },
  ];

  const decisionFactors = [
    {
      index: '01',
      title: 'Surgeon Experience',
      description:
        'Explore surgeon qualifications, specialist credentials, and procedural experience so safety is never sacrificed for price.',
      image: LANDING_IMAGES.experiencedSurgeon,
      alt: 'Experienced Indian surgical specialist reviewing affordable surgical options inside a modern hospital consultation suite',
      icon: Stethoscope,
      topBar: 'from-[#1D4ED8] via-[#2563EB] to-[#0284C7]',
      cardBg: 'bg-gradient-to-b from-white via-[#EFF6FF] to-[#DBEAFE]/80 border-blue-200/90 hover:border-blue-400',
      iconBadge: 'bg-gradient-to-br from-[#1D4ED8] to-[#0284C7] text-white shadow-sm',
      indexText: 'text-[#1D4ED8]',
    },
    {
      index: '02',
      title: 'Hospital Credibility',
      description:
        'Review hospital accreditation, surgical infrastructure, hygiene standards, and post-operative support — because cheapest is not always best.',
      image: LANDING_IMAGES.hospitalFacility,
      alt: 'Modern accredited Indian hospital surgical wing, sterile operating theater corridor, and post-operative care facility',
      icon: Building2,
      topBar: 'from-[#0891B2] via-[#06B6D4] to-[#0D9488]',
      cardBg: 'bg-gradient-to-b from-white via-[#ECFEFF] to-[#CFFAFE]/80 border-cyan-200/90 hover:border-cyan-400',
      iconBadge: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] text-white shadow-sm',
      indexText: 'text-[#0E7490]',
    },
    {
      index: '03',
      title: 'Budget Alignment',
      description:
        'Understand indicative hospital package ranges, room-category differences, and cashless insurance support tailored to your budget.',
      image: LANDING_IMAGES.affordableTreatment,
      alt: 'Care coordinator explaining affordable surgery options in India and insurance coverage to an Indian family',
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
      title: 'The Problem',
      desc: 'Received a high surgery estimate? Worried about the cost of treatment?',
      accentTop: 'from-[#1D4ED8] to-[#0284C7]',
      cardSurface: 'bg-gradient-to-br from-white via-[#EFF6FF] to-[#DBEAFE]/80 border-blue-200 hover:border-blue-400',
      badgeText: 'text-[#1D4ED8]',
    },
    {
      step: '02',
      title: 'The Solution',
      desc: "Don't make a decision before exploring your options. Acquire Surgery helps you find suitable hospitals according to your treatment needs and budget.",
      accentTop: 'from-[#0891B2] to-[#0D9488]',
      cardSurface: 'bg-gradient-to-br from-white via-[#ECFEFF] to-[#CFFAFE]/80 border-cyan-200 hover:border-cyan-400',
      badgeText: 'text-[#0E7490]',
    },
    {
      step: '03',
      title: 'The Action',
      desc: 'Share your surgery requirement and budget. Our team will help you explore suitable hospital options.',
      accentTop: 'from-[#D97706] to-[#F59E0B]',
      cardSurface: 'bg-gradient-to-br from-white via-[#FFFBEB] to-[#FEF3C7]/80 border-amber-200 hover:border-amber-400',
      badgeText: 'text-[#B45309]',
    },
    {
      step: '04',
      title: 'The Result',
      desc: 'Make an informed decision by understanding your available hospital and treatment options.',
      accentTop: 'from-[#059669] to-[#10B981]',
      cardSurface: 'bg-gradient-to-br from-white via-[#ECFDF5] to-[#D1FAE5]/80 border-emerald-200 hover:border-emerald-400',
      badgeText: 'text-[#047857]',
    },
  ];

  const homeFaqs = [
    {
      question: 'How does Acquire Surgery help if I received a high surgery quotation?',
      answer:
        'If a hospital quoted a high amount such as ₹1,00,000 for piles or another planned surgery, Acquire Surgery helps you discover other suitable, credible hospitals and experienced surgeons that match your treatment requirements and budget.',
    },
    {
      question: 'Is Acquire Surgery a hospital or surgery provider?',
      answer:
        'No. Acquire Surgery is not a hospital or clinic. We are an independent patient decision platform that helps patients explore suitable hospitals, surgeons, and indicative treatment options based on their medical needs and affordability.',
    },
    {
      question: 'Are surgery prices fixed or guaranteed on Acquire Surgery?',
      answer:
        'No. Actual surgery costs depend on the hospital, treating surgeon, surgical procedure, medical condition, room category, and other clinical requirements confirmed after doctor evaluation.',
    },
  ];

  const conditionCardStyles: Record<
    string,
    { surface: string; topBar: string; ctaText: string }
  > = {
    piles: {
      surface: 'bg-gradient-to-br from-white via-[#F0FDFA] to-[#CCFBF1]/85 border-teal-200 hover:border-teal-400',
      topBar: 'from-[#0D9488] to-[#14B8A6]',
      ctaText: 'text-[#0F766E]',
    },
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
    'uterine-fibroids': {
      surface: 'bg-gradient-to-br from-white via-[#FFF1F2] to-[#FFE4E6]/85 border-rose-200 hover:border-rose-400',
      topBar: 'from-[#E11D48] to-[#FB7185]',
      ctaText: 'text-[#BE123C]',
    },
    endometriosis: {
      surface: 'bg-gradient-to-br from-white via-[#F5F3FF] to-[#EDE9FE]/85 border-violet-200 hover:border-violet-400',
      topBar: 'from-[#7C3AED] to-[#A855F7]',
      ctaText: 'text-[#6D28D9]',
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
      {/* SECTION 1 – HERO BANNER */}
      <section className="relative bg-[#031636] text-white overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: EASE_SMOOTH }}
              >
                <p className="text-sm font-semibold text-[#6EE7B7] tracking-tight">
                  Your Surgical Decision Partner · Affordable Surgery in India
                </p>
              </motion.div>

              <div className="space-y-3">
                <KineticText
                  as="h1"
                  text="Need Surgery? Let's Find the Right Treatment Within Your Budget."
                  className="font-display font-extrabold text-white tracking-tight leading-[1.11]"
                  style={{ fontSize: 'clamp(1.65rem, 3.65vw, 3.15rem)', textWrap: 'balance' }}
                  delay={0.05}
                />
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, delay: 0.28, ease: EASE_SMOOTH }}
                  className="font-display text-base sm:text-xl font-bold bg-gradient-to-r from-[#38BDF8] via-[#2DD4BF] to-[#FDE68A] bg-clip-text text-transparent"
                >
                  Get guidance on affordable treatment options, understand your estimated costs, and explore hospitals that fit your budget.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.4, ease: EASE_SMOOTH }}
                className="pt-1"
              >
                <motion.button
                  id="hero-explore-options-btn"
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  onClick={scrollToForm}
                  className="group relative overflow-hidden w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#34D399] via-[#2DD4BF] to-[#38BDF8] hover:from-[#6EE7B7] hover:to-[#7DD3FC] text-[#041B42] text-xs sm:text-base font-extrabold tracking-wide px-4 sm:px-8 py-3.5 rounded-xl shadow-xl shadow-teal-950/35 transition-all cursor-pointer text-center leading-snug whitespace-normal sm:whitespace-nowrap shrink-0"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                  <span className="relative">FIND HOSPITALS WITHIN MY BUDGET</span>
                  <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Right Column (Desktop): Layered Multi-Image Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.16, ease: EASE_SMOOTH }}
              className="hidden lg:block lg:col-span-6 lg:px-4 sm:py-4"
            >
              <div className="relative pb-6">
                <HeroDecisionOrbitOverlay />

                <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/50 bg-[#06224F] aspect-[16/10] shadow-2xl shadow-slate-950/60">
                  <ParallaxFrame offset={10} className="w-full h-full">
                    <ResilientImage
                      src={LANDING_IMAGES.heroConsultation}
                      alt="Indian senior surgeon explaining affordable surgery hospital options on a tablet to a patient and spouse"
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      fallbackLabel="Informed Surgical Consultation"
                      className="w-full h-full object-cover object-[center_20%] scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                  </ParallaxFrame>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/95 via-[#031636]/65 to-transparent p-4 sm:p-5">
                    <p className="text-xs sm:text-sm font-medium text-white sm:max-w-[54%] leading-snug">
                      &ldquo;Compare hospital surgery costs before committing. Find credible care that respects both your health and your budget.&rdquo;
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.34, ease: EASE_SMOOTH }}
                  className="absolute -bottom-1 -right-2 lg:-right-3 w-[42%] z-20"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="group rounded-xl overflow-hidden border-2 border-white/90 bg-[#06224F] aspect-[4/3] shadow-2xl shadow-slate-950/60"
                  >
                    <ResilientImage
                      src={LANDING_IMAGES.heroFamilyCare}
                      alt="Indian patient couple walking alongside a senior surgeon and care coordinator after finding a suitable hospital"
                      loading="eager"
                      decoding="sync"
                      fallbackLabel="Guided Surgical Support"
                      className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/95 via-[#031636]/55 to-transparent px-3 py-2.5">
                      <span className="block text-[11px] font-bold text-[#6EE7B7] leading-tight">
                        Budget-Aligned Guidance
                      </span>
                      <span className="block text-[11px] font-medium text-white/95 leading-tight">
                        Explore before deciding
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-7 sm:h-12">
            <path
              d="M0 32C240 64 480 64 720 34C960 4 1200 4 1440 32V60H0V32Z"
              fill="#0F2958"
            />
          </svg>
        </div>
      </section>

      {/* SECTION 2 – ENQUIRY FORM IMMEDIATELY AFTER HERO + CARE COORDINATOR VISUAL */}
      <section
        id="enquiry-form"
        className="relative py-10 sm:py-16 bg-gradient-to-br from-[#0F2958] via-[#0B5577] to-[#0D7A6E] scroll-mt-16 overflow-hidden"
      >
        <AmbientMedicalGraphic variant="dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Conversion Form (First on mobile right after Hero, Right Column on desktop) */}
            <div id="surgery-requirements-form" className="order-1 lg:order-2 lg:col-span-7 scroll-mt-20 space-y-5">
              <FadeInView delay={0.08}>
                <EnquiryForm
                  idPrefix="enquiry"
                  ctaLabel="SHARE YOUR SURGERY REQUIREMENT"
                  onSuccess={onLeadSubmitted}
                  onNavigatePrivacy={() => onNavigate('/privacy-policy')}
                />
              </FadeInView>

              <FadeInView delay={0.12} className="space-y-2.5 text-center lg:text-left px-1">
                <a
                  href="#decision-factors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('decision-factors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center justify-center lg:justify-start gap-1.5 text-sm font-semibold text-sky-100 hover:text-[#6EE7B7] underline underline-offset-4 decoration-cyan-400/50 hover:decoration-[#6EE7B7] transition-colors py-1"
                >
                  <span>Compare 3 Decision Factors</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  Acquire Surgery is not a hospital or surgery provider — we help patients find suitable, credible hospitals matched to their treatment requirements and budget.
                </p>
              </FadeInView>
            </div>

            {/* Mobile & Tablet 3-Card Consultation & Comparison Strip (Shown right after the form on <lg) */}
            <FadeInView className="order-2 lg:hidden space-y-3.5">
              <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/50 bg-[#06224F] aspect-[16/10] min-h-[195px] sm:min-h-0 shadow-2xl shadow-slate-950/60">
                <ResilientImage
                  src={LANDING_IMAGES.heroConsultation}
                  alt="Indian senior surgeon explaining affordable surgery hospital options on a tablet to a patient and spouse"
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Informed Surgical Consultation"
                  className="w-full h-full object-cover object-[center_20%]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/95 via-[#031636]/70 to-transparent p-3.5 sm:p-5">
                  <p className="text-[11px] sm:text-sm font-medium text-white leading-snug">
                    &ldquo;Compare hospital surgery costs before committing. Find credible care that respects both your health and your budget.&rdquo;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="relative rounded-xl overflow-hidden border border-cyan-300/40 aspect-[4/3] bg-[#06224F] min-w-0">
                  <ResilientImage
                    src={LANDING_IMAGES.heroFamilyCare}
                    alt="Indian patient couple consulting with senior surgeon and care advisor"
                    loading="lazy"
                    fallbackLabel="Patient Care"
                    className="w-full h-full object-cover object-[center_18%]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#031636]/90 to-transparent px-2.5 py-2">
                    <span className="block text-[11px] font-semibold text-white">Personal Guidance</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 flex flex-col justify-between min-w-0">
                  <span className="text-[11px] font-bold text-[#6EE7B7] leading-tight">
                    3 Key Comparison Factors
                  </span>
                  <div className="space-y-1 text-[11px] sm:text-xs font-semibold text-white/95">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Stethoscope className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span className="truncate">Surgeon Fit</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                      <span className="truncate">Hospital Credibility</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IndianRupee className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
                      <span className="truncate">Budget Clarity</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Companion Visual Showcase (Below 3 cards on mobile, Left Column on desktop) */}
            <FadeInView className="order-3 lg:order-1 lg:col-span-5 space-y-5 text-white">
              <div className="group relative rounded-2xl overflow-hidden border-2 border-cyan-300/35 bg-slate-900 aspect-[4/3] shadow-2xl shadow-slate-950/40">
                <ResilientImage
                  src={LANDING_IMAGES.careCoordinatorSupport}
                  alt="Acquire Surgery patient care coordinator helping families find affordable hospitals matched to their surgical budget"
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
                    Personalized guidance to match your surgery requirement, hospital safety expectations, and budget.
                  </p>
                </div>
              </div>
            </FadeInView>
          </div>

          {/* Full-Width 3-Pillar Bottom Anchor Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH }}
            className="mt-10 sm:mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0284C7] flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">01. Experienced Surgeons</p>
                <p className="text-xs text-sky-100/85 mt-0.5 leading-snug">Qualified specialists matched to procedure</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#0D9488] flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">02. Credible Hospitals</p>
                <p className="text-xs text-sky-100/85 mt-0.5 leading-snug">Safety standards, OT wings &amp; post-op care</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-sm">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">03. Budget Alignment</p>
                <p className="text-xs text-sky-100/85 mt-0.5 leading-snug">Explore options before paying more</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 – BRAND STORYTELLING (THE ₹1,00,000 PILES SURGERY STORY) */}
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
              Why Comparing Options Matters
            </p>
            <KineticText
              as="h2"
              inView
              text="Don't Let Surgery Costs Stop You From Getting Treatment."
              className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            />
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Imagine visiting a hospital for piles surgery and receiving an estimated cost of ₹1,00,000. When that amount feels out of reach, families worry about borrowing money or delaying essential care.{' '}
              <strong className="text-[#062B61]">Compare your options before paying more for surgery.</strong>
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <FadeInView className="lg:col-span-5">
              <div className="relative h-full min-h-[260px] rounded-2xl overflow-hidden border border-indigo-200/90 shadow-lg group bg-slate-900">
                <ParallaxFrame offset={10} className="w-full h-full">
                  <ResilientImage
                    src={LANDING_IMAGES.patientFamilyClarity}
                    alt="Indian couple comparing hospital surgery costs and affordable treatment options from home on a laptop"
                    loading="lazy"
                    decoding="async"
                    fallbackLabel="Compare Surgical Options Calmly"
                    className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </ParallaxFrame>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/95 via-[#041B42]/65 to-transparent p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                    Acquire Surgery Provides Another Way
                  </p>
                  <p className="text-sm font-medium text-white mt-1 leading-snug">
                    Instead of settling for the first quotation, discover suitable hospitals and surgeons aligned with your treatment needs and affordability.
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
                      className={`w-full h-full text-left border rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-3.5 shadow-sm transition-all cursor-pointer ${
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

          <FadeInView delay={0.08}>
            <SurgicalDecisionCompassGraphic activeIndex={activeQuestionIdx} />
          </FadeInView>

          <FadeInView delay={0.12}>
            <div className="bg-gradient-to-r from-[#062B61] via-[#0E7490] to-[#047857] text-white rounded-2xl p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl shadow-cyan-950/15">
              <div className="space-y-2.5 max-w-3xl">
                <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                  Acquire Surgery is not a hospital or surgery provider — and we never believe the cheapest hospital is automatically the best.
                </p>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  We help you find affordable hospitals with qualified surgeons, strong safety standards, and transparent options that fit your budget.
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToForm}
                className="w-full lg:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDE68A] via-[#FCD34D] to-[#34D399] text-[#041B42] text-xs sm:text-sm font-extrabold px-4 sm:px-6 py-3.5 rounded-xl shadow-lg text-center leading-snug whitespace-normal sm:whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>EXPLORE AFFORDABLE SURGERY OPTIONS</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </motion.button>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* SECTION 4 – BUDGET-SPECIFIC LANDING SECTION WITH REQUIREMENT FORM */}
      <section
        id="budget-finder"
        className="relative py-12 sm:py-20 bg-gradient-to-br from-[#F0FDF4] via-[#ECFEFF] to-[#EFF6FF] border-b border-teal-200/80 scroll-mt-16 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-emerald-200 to-cyan-200"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeInView className="max-w-3xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#047857]">
              Surgery Within My Budget
            </p>
            <KineticText
              as="h2"
              inView
              text="Find the Right Hospital Within Your Surgery Budget"
              className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            />
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Share your surgery requirements below so our care coordination team can help you discover suitable accredited hospitals aligned with your medical needs and affordability.
            </p>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
              <p>
                Actual surgery costs depend on the hospital, treating surgeon, surgical procedure, medical condition, and room category — we never promise fixed prices or unverified matches.
              </p>
            </div>
          </FadeInView>

          {/* Replaced 2nd budget form with Let's Understand Your Surgery Requirements form */}
          <FadeInView delay={0.06}>
            <div className="max-w-3xl mx-auto">
              <EnquiryForm
                idPrefix="budget-enquiry"
                ctaLabel="SHARE YOUR SURGERY REQUIREMENT"
                onSuccess={onLeadSubmitted}
                onNavigatePrivacy={() => onNavigate('/privacy-policy')}
              />
            </div>
          </FadeInView>

          {/* 5 Highlighted Budget-Specific Surgery Examples */}
          <div className="space-y-4">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#062B61]">
              Popular Budget-Focused Surgery Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetExamples.map((ex) => (
                <a
                  key={ex.slug}
                  href={`/conditions/${ex.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/conditions/${ex.slug}`);
                  }}
                  className="group bg-white border border-slate-200 hover:border-[#0D9488] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-1.5 bg-gradient-to-r ${ex.accent}`} />
                    <div className="p-5 space-y-2">
                      <h4 className="font-display text-base font-bold text-[#062B61] group-hover:text-[#0D9488] transition-colors">
                        {ex.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{ex.summary}</p>
                    </div>
                  </div>
                  <div className="px-4 sm:px-5 pb-4 pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                    <span className="font-mono font-semibold text-slate-700 tabular-nums">{ex.range}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#0D9488] shrink-0">
                      <span>Compare Options</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 – OUR THREE DECISION FACTORS */}
      <section
        id="decision-factors"
        className="relative py-12 sm:py-20 bg-gradient-to-b from-[#ECFEFF] via-[#E0F2FE]/80 to-[#F0FDFA] border-b border-cyan-200/80 scroll-mt-16 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full blur-3xl opacity-35 bg-gradient-to-tr from-sky-200 via-teal-200 to-emerald-200"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeInView className="max-w-3xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
              Balanced Quality &amp; Affordability
            </p>
            <KineticText
              as="h2"
              inView
              text="The Right Surgery Shouldn't Compromise Quality or Financial Peace"
              className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight"
              style={{ textWrap: 'balance' }}
            />
            <p className="text-sm sm:text-base text-slate-700">
              Finding the best hospital for surgery within your budget means weighing surgeon expertise, clinical safety, and transparent package estimates together.
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
                              {factor.index}. Decision Pillar
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

      {/* SECTION 6 – 4-STEP PATIENT JOURNEY STORYTELLING */}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <FadeInView className="lg:col-span-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                Patient Journey Storytelling · 4 Simple Steps
              </p>
              <KineticText
                as="h2"
                inView
                text="From a High Surgery Quote to an Informed Hospital Choice"
                className="font-display text-2xl sm:text-4xl font-extrabold text-[#062B61] tracking-tight"
                style={{ textWrap: 'balance' }}
              />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
                Our structured four-step process helps you move past high estimate anxiety toward suitable hospitals, clear communication, and peace of mind.
              </p>
              <div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToForm}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#E11D48] text-white text-xs sm:text-sm font-extrabold px-4 sm:px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center leading-snug whitespace-normal sm:whitespace-nowrap"
                >
                  <span>GET HELP FINDING THE RIGHT HOSPITAL</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </motion.button>
              </div>
            </FadeInView>

            <FadeInView delay={0.08} className="lg:col-span-6">
              <div className="group relative rounded-2xl overflow-hidden border border-emerald-200/90 aspect-video shadow-lg bg-slate-900">
                <ResilientImage
                  src={LANDING_IMAGES.surgicalRecoveryLifestyle}
                  alt="Healthy recovered Indian couple walking happily along a sunlit green park pathway after affordable planned surgery"
                  loading="lazy"
                  decoding="async"
                  fallbackLabel="Confident Surgical Recovery"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B42]/90 via-[#041B42]/45 to-transparent p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Better decisions lead to smoother surgical journeys without avoidable financial strain.
                  </p>
                </div>
              </div>
            </FadeInView>
          </div>

          <div ref={stepsContainerRef} className="relative">
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

      {/* SECTION 7 – PROCEDURE DIRECTORY (ALL 7 SEO TREATMENT PAGES) */}
      <section
        id="condition-guides"
        className="relative py-12 sm:py-16 bg-gradient-to-br from-[#EEF2FF] via-[#E0F2FE]/80 to-[#ECFDF5] border-b border-indigo-200/70 scroll-mt-16 overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <FadeInView className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                Procedure &amp; Cost Guides
              </p>
              <KineticText
                as="h2"
                inView
                text="Compare Surgery Costs & Hospital Options by Condition"
                className="font-display text-2xl sm:text-3xl font-extrabold text-[#062B61] tracking-tight"
                style={{ textWrap: 'balance' }}
              />
            </div>
            <p className="text-sm text-slate-700 max-w-md">
              Explore Piles surgery cost, Hernia surgery cost, Gallbladder surgery cost, Uterine Fibroid surgery, Endometriosis treatment, and related guides.
            </p>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
                    title={cond.seoTitle}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/conditions/${cond.slug}`);
                    }}
                    className={`group h-full border rounded-2xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-xl ${cardStyle.surface}`}
                  >
                    <div>
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
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <ConditionVectorEmblem slug={cond.slug} size="sm" />
                          <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#062B61] transition-colors">
                            {cond.condition} Surgery
                          </h3>
                        </div>
                        <p className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                          {cond.estimatedRange}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${cardStyle.ctaText} group-hover:text-[#062B61] transition-colors`}>
                        <span>Compare Options</span>
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

      {/* SECTION 8 – PATIENT FAQs */}
      <section id="patient-faqs" className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              Patient Questions Answered
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#062B61] tracking-tight">
              Frequently Asked Questions About Finding Affordable Hospitals
            </h2>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/70"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display text-sm sm:text-base font-bold text-[#062B61] hover:bg-sky-50/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#0D9488] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-700 leading-relaxed border-t border-slate-200/70 pt-3 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 – FINAL CONVERSION CTA */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-br from-[#041B42] via-[#1E3A8A] via-[#0E7490] to-[#065F46] text-white overflow-hidden">
        <AmbientMedicalGraphic variant="dark" />
        <FadeInView className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <KineticText
            as="h2"
            inView
            text="The Right Surgery Shouldn't Come With Financial Stress."
            className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          />
          <p className="text-sm sm:text-lg text-sky-100 max-w-2xl mx-auto">
            Your budget matters. Share your surgery requirement to explore suitable, credible hospitals before committing to a high estimate.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <motion.button
              id="final-cta-explore-btn"
              type="button"
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE_SMOOTH }}
              onClick={scrollToForm}
              className="group relative overflow-hidden w-full sm:w-auto min-h-[54px] inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#34D399] via-[#2DD4BF] to-[#38BDF8] hover:from-[#6EE7B7] hover:to-[#7DD3FC] text-[#041B42] text-xs sm:text-base font-extrabold tracking-wide px-4 sm:px-9 py-3.5 rounded-xl shadow-xl shadow-slate-950/35 transition-all cursor-pointer text-center leading-snug whitespace-normal sm:whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <span className="relative">EXPLORE AFFORDABLE SURGERY OPTIONS</span>
              <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 text-[#041B42] shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </FadeInView>
      </section>
    </div>
  );
};
