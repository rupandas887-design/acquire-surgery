import React from 'react';
import { motion } from 'motion/react';
import {
  Stethoscope,
  Building2,
  IndianRupee,
  ShieldCheck,
  Search,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { EASE_SMOOTH } from './MotionPrimitives';

/**
 * Hero foreground 3D-layered colourful architectural overlay frame that anchors the
 * three surgical decision pillars alongside the consultation photography.
 */
export const HeroDecisionOrbitOverlay: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* Subtle 3D-layered luminous cyan-emerald-amber architectural backing plate */}
      <motion.div
        initial={{ opacity: 0, rotate: 0, scale: 0.95 }}
        animate={{ opacity: 1, rotate: -1.6, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.2, ease: EASE_SMOOTH }}
        className="hidden sm:block absolute inset-0 rounded-2xl bg-gradient-to-br from-[#38BDF8]/45 via-[#2DD4BF]/35 to-[#F59E0B]/35 border border-white/25 -translate-x-2.5 translate-y-2.5 blur-[0.5px]"
      />

      {/* Decorative rotating orbital precision arc in top-right behind frame */}
      <motion.svg
        viewBox="0 0 180 180"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="hidden lg:block absolute -top-12 -right-10 w-36 h-36 opacity-55 will-change-transform"
      >
        <circle
          cx="90"
          cy="90"
          r="74"
          stroke="url(#heroOrbitGrad)"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
        <circle
          cx="90"
          cy="90"
          r="54"
          stroke="#6EE7B7"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeDasharray="3 8"
        />
        <defs>
          <linearGradient id="heroOrbitGrad" x1="0" y1="0" x2="180" y2="180">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Floating Top-Left Unbiased Decision Pulse Card */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE_SMOOTH }}
        className="hidden sm:flex absolute -top-5 -left-3 z-30"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white/95 backdrop-blur-md border border-cyan-200/90 rounded-xl px-3.5 py-2.5 shadow-xl shadow-slate-950/25 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] via-[#0D9488] to-[#10B981] flex items-center justify-center shrink-0 shadow-xs">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <motion.path
                d="M4 16H10L13 9L18 23L21 16H28"
                stroke="#FFFFFF"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2, ease: EASE_SMOOTH }}
              />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-[11px] font-bold text-[#062B61]">Unbiased Comparison</span>
            <span className="block text-[10px] font-medium text-[#0D9488]">Surgeon · Hospital · Package</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * Custom animated multi-colour medical decision storytelling graphic for Section 2 (Patient Story / Problem).
 * Supports interactive highlighting synchronized with the 4 patient question cards.
 */
export const SurgicalDecisionCompassGraphic: React.FC<{ activeIndex?: number | null }> = ({
  activeIndex = null,
}) => {
  const questionNodes = [
    {
      label: 'Surgeon Fit',
      outcomeIndex: 0,
      accentStroke: '#2563EB',
      activeBox: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-700 text-white shadow-sm',
      idleBox: 'bg-blue-50/90 border-blue-200 text-[#062B61]',
    },
    {
      label: 'Hospital Quality',
      outcomeIndex: 1,
      accentStroke: '#0891B2',
      activeBox: 'bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-700 text-white shadow-sm',
      idleBox: 'bg-cyan-50/90 border-cyan-200 text-[#0E7490]',
    },
    {
      label: 'Fair Package Cost',
      outcomeIndex: 2,
      accentStroke: '#D97706',
      activeBox: 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600 text-white shadow-sm',
      idleBox: 'bg-amber-50/90 border-amber-200 text-amber-900',
    },
    {
      label: 'Insurance Clarity',
      outcomeIndex: 2,
      accentStroke: '#059669',
      activeBox: 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-700 text-white shadow-sm',
      idleBox: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    },
  ];

  const outcomes = [
    {
      title: 'Right Specialist Surgeon',
      sub: 'Procedure-matched credentials',
      idleBg: 'bg-gradient-to-r from-blue-50 to-indigo-50/80 border-blue-200/90',
      activeBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-700 text-white shadow-md',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Suitable Hospital Wing',
      sub: 'OT safety & post-op care',
      idleBg: 'bg-gradient-to-r from-cyan-50 to-teal-50/80 border-cyan-200/90',
      activeBg: 'bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-700 text-white shadow-md',
      iconColor: 'text-cyan-600',
    },
    {
      title: 'Transparent Estimate',
      sub: 'Budget & TPA aligned',
      idleBg: 'bg-gradient-to-r from-emerald-50 to-teal-50/80 border-emerald-200/90',
      activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-700 text-white shadow-md',
      iconColor: 'text-emerald-600',
    },
  ];

  const highlightedOutcome =
    activeIndex !== null && questionNodes[activeIndex]
      ? questionNodes[activeIndex].outcomeIndex
      : null;

  return (
    <div
      aria-hidden="true"
      className="bg-gradient-to-br from-white via-[#F5F9FF] to-[#ECFEFF] border border-indigo-200/80 rounded-2xl p-5 sm:p-7 overflow-hidden relative shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Animated Diagnostic Uncertainty Paths */}
        <div className="md:col-span-4 space-y-2.5 text-xs sm:text-sm">
          <div className="font-mono text-[11px] uppercase tracking-wider font-semibold text-indigo-700">
            Post-Diagnosis Questions
          </div>
          {questionNodes.map((node, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                animate={{
                  scale: isActive ? 1.025 : 1,
                }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: EASE_SMOOTH }}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border font-semibold transition-all ${
                  isActive ? node.activeBox : node.idleBox
                }`}
              >
                <span>{node.label}</span>
                <svg viewBox="0 0 36 12" fill="none" className="w-8 h-3 shrink-0">
                  <motion.path
                    d="M2 6H32M27 2L32 6L27 10"
                    stroke={isActive ? '#FFFFFF' : node.accentStroke}
                    strokeWidth={isActive ? '2.2' : '1.8'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: EASE_SMOOTH }}
                  />
                </svg>
              </motion.div>
            );
          })}
        </div>

        {/* Center: Animated Multi-Colour Surgical Decision Compass Emblem */}
        <div className="md:col-span-4 flex flex-col items-center justify-center py-2">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
            <motion.svg
              viewBox="0 0 180 180"
              fill="none"
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="90"
                cy="90"
                r="82"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />
              <path
                d="M 90 8 A 82 82 0 0 1 162 52"
                stroke="#06B6D4"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 162 128 A 82 82 0 0 1 90 172"
                stroke="#10B981"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 90 172 A 82 82 0 0 1 18 128"
                stroke="#2563EB"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 18 52 A 82 82 0 0 1 90 8"
                stroke="#F59E0B"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </motion.svg>

            <motion.svg
              viewBox="0 0 140 140"
              fill="none"
              className="absolute w-32 h-32"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="70"
                cy="70"
                r="58"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
            </motion.svg>

            <motion.div
              animate={{ scale: activeIndex !== null ? 1.07 : 1 }}
              transition={{ duration: 0.25, ease: EASE_SMOOTH }}
              className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#062B61] via-[#0284C7] to-[#0D9488] text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-900/20"
            >
              <ShieldCheck className="w-7 h-7 text-[#6EE7B7]" />
              <span className="text-[10px] font-bold tracking-wider mt-1">DECISION</span>
            </motion.div>
          </div>
          <p className="text-xs font-bold text-[#062B61] text-center mt-2">
            Acquire Surgery Alignment
          </p>
        </div>

        {/* Right: Structured Multi-Colour Decision Outcomes */}
        <div className="md:col-span-4 space-y-2.5 text-xs sm:text-sm">
          <div className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#0D9488]">
            Verified Patient Options
          </div>
          {outcomes.map((item, idx) => {
            const isHighlighted = highlightedOutcome === idx;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                animate={{ scale: isHighlighted ? 1.025 : 1 }}
                transition={{ duration: 0.35, delay: 0.12 + idx * 0.08, ease: EASE_SMOOTH }}
                className={`px-3.5 py-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                  isHighlighted ? item.activeBg : item.idleBg
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                    isHighlighted ? 'text-white' : item.iconColor
                  }`}
                />
                <div>
                  <div className={`font-bold leading-tight ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isHighlighted ? 'text-white/90' : 'text-slate-600'}`}>
                    {item.sub}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Custom animated multi-colour micro-illustrations for the 3 Decision Factor cards.
 */
export const DecisionFactorVectorAccent: React.FC<{ index: string }> = ({ index }) => {
  if (index === '01') {
    return (
      <svg viewBox="0 0 64 24" fill="none" className="w-16 h-6" aria-hidden="true">
        <motion.path
          d="M2 14H14L19 5L25 19L30 11L35 14H62"
          stroke="#2563EB"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0.2, opacity: 0.5 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_SMOOTH }}
        />
      </svg>
    );
  }
  if (index === '02') {
    return (
      <svg viewBox="0 0 64 24" fill="none" className="w-16 h-6" aria-hidden="true">
        {[
          { x: 6, h: 14, y: 6, fill: '#06B6D4' },
          { x: 20, h: 10, y: 10, fill: '#0D9488' },
          { x: 34, h: 16, y: 4, fill: '#0284C7' },
          { x: 48, h: 12, y: 8, fill: '#10B981' },
        ].map((bar, idx) => (
          <motion.rect
            key={bar.x}
            x={bar.x}
            y={bar.y}
            width="10"
            height={bar.h}
            rx="2.5"
            fill={bar.fill}
            initial={{ scaleY: 0.4, opacity: 0.3 }}
            whileInView={{ scaleY: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: EASE_SMOOTH }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 24" fill="none" className="w-16 h-6" aria-hidden="true">
      {[
        { y: 5, w: 46, color: '#059669' },
        { y: 12, w: 34, color: '#F59E0B' },
        { y: 19, w: 54, color: '#0D9488' },
      ].map((bar, idx) => (
        <motion.line
          key={bar.y}
          x1="4"
          y1={bar.y}
          x2={bar.w}
          y2={bar.y}
          stroke={bar.color}
          strokeWidth="2.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: idx * 0.1, ease: EASE_SMOOTH }}
        />
      ))}
    </svg>
  );
};

/**
 * Animated colourful gradient icon medallion for the 4-Step "What Happens Next?" journey.
 */
export const AnimatedStepIcon: React.FC<{ step: string }> = ({ step }) => {
  const styleMap: Record<string, { bg: string; icon: React.ReactNode }> = {
    '01': {
      bg: 'bg-gradient-to-br from-[#1D4ED8] to-[#0284C7] shadow-blue-500/25',
      icon: <Search className="w-4 h-4 text-white" />,
    },
    '02': {
      bg: 'bg-gradient-to-br from-[#0891B2] to-[#0D9488] shadow-cyan-500/25',
      icon: <Building2 className="w-4 h-4 text-white" />,
    },
    '03': {
      bg: 'bg-gradient-to-br from-[#D97706] to-[#F59E0B] shadow-amber-500/25',
      icon: <Scale className="w-4 h-4 text-white" />,
    },
    '04': {
      bg: 'bg-gradient-to-br from-[#059669] to-[#10B981] shadow-emerald-500/25',
      icon: <CheckCircle2 className="w-4 h-4 text-white" />,
    },
  };

  const entry = styleMap[step] || {
    bg: 'bg-gradient-to-br from-[#062B61] to-[#0D9488]',
    icon: <ShieldCheck className="w-4 h-4 text-white" />,
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl shadow-md ${entry.bg}`}
    >
      <motion.div
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ duration: 0.2, ease: EASE_SMOOTH }}
      >
        {entry.icon}
      </motion.div>
    </div>
  );
};

/**
 * Animated surgical approach recovery & stay trajectory diagram for ConditionLandingPage.
 */
export const SurgicalApproachTrajectoryGraphic: React.FC<{ conditionName: string }> = ({
  conditionName,
}) => {
  return (
    <div
      aria-hidden="true"
      className="bg-gradient-to-br from-white via-[#F0F9FF] to-[#ECFDF5] border border-cyan-200/80 rounded-2xl p-5 sm:p-6 space-y-4 overflow-hidden shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#0D9488]">
            Procedural Clarity · {conditionName}
          </p>
          <h3 className="font-display text-base font-bold text-slate-900">
            Typical Care Pathway &amp; Recovery Trajectory
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-700 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#0D9488] rounded-full" />
            <span>Minimally Invasive</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#2563EB] rounded-full" />
            <span>Conventional Approach</span>
          </span>
        </div>
      </div>

      <svg viewBox="0 0 420 96" fill="none" className="w-full h-24">
        <defs>
          <linearGradient id="fastRecoveryGrad" x1="20" y1="74" x2="400" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <line x1="20" y1="80" x2="400" y2="80" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="20" y1="48" x2="400" y2="48" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20" y1="16" x2="400" y2="16" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

        {/* Minimally Invasive fast recovery curve */}
        <motion.path
          d="M20 74 C90 70, 125 22, 220 18 C295 16, 355 16, 400 16"
          stroke="url(#fastRecoveryGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.05, ease: EASE_SMOOTH }}
        />

        {/* Conventional steady recovery curve */}
        <motion.path
          d="M20 76 C125 74, 210 56, 290 32 C340 20, 375 18, 400 18"
          stroke="#2563EB"
          strokeWidth="2.2"
          strokeDasharray="5 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.25, delay: 0.15, ease: EASE_SMOOTH }}
        />

        <circle cx="20" cy="75" r="4" fill="#2563EB" />
        <circle cx="220" cy="18" r="4" fill="#06B6D4" />
        <circle cx="400" cy="16" r="4.5" fill="#10B981" />
      </svg>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-medium">
        <span>Day 0 · Consultation</span>
        <span>Day 1–3 · Discharge Window</span>
        <span>Full Routine Recovery</span>
      </div>
    </div>
  );
};

/**
 * Colour-coded domain vector emblem for each surgical condition guide.
 */
export const ConditionVectorEmblem: React.FC<{ slug: string; size?: 'sm' | 'lg' }> = ({
  slug,
  size = 'sm',
}) => {
  const dim = size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  const containerStyleMap: Record<string, string> = {
    hernia: 'bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] border-blue-300/80',
    'gallbladder-stones': 'bg-gradient-to-br from-[#CFFAFE] to-[#A5F3FC] border-cyan-300/80',
    piles: 'bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4] border-teal-300/80',
    fissure: 'bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] border-indigo-300/80',
    fistula: 'bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] border-emerald-300/80',
  };

  return (
    <div
      aria-hidden="true"
      className={`${dim} rounded-xl border flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ${
        containerStyleMap[slug] || 'bg-[#F0F7FF] border-slate-200/90'
      }`}
    >
      <svg viewBox="0 0 40 40" fill="none" className="w-3/4 h-3/4">
        {slug === 'hernia' && (
          <>
            <motion.rect
              x="7"
              y="7"
              width="26"
              height="26"
              rx="6"
              stroke="#1D4ED8"
              strokeWidth="2"
              strokeDasharray="4 3"
              animate={{ rotate: [0, 90] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '20px 20px' }}
            />
            <circle cx="20" cy="20" r="6" stroke="#0284C7" strokeWidth="2.2" />
            <circle cx="20" cy="20" r="2.5" fill="#1D4ED8" />
          </>
        )}
        {slug === 'gallbladder-stones' && (
          <>
            <motion.path
              d="M20 7C26 7 30 13 30 20C30 27 25 33 20 33C15 33 10 27 10 20C10 13 14 7 20 7Z"
              stroke="#0E7490"
              strokeWidth="2"
            />
            <motion.circle
              cx="18"
              cy="22"
              r="2.6"
              fill="#F59E0B"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="23"
              cy="18"
              r="2.2"
              fill="#0284C7"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        {slug === 'piles' && (
          <>
            <motion.circle
              cx="20"
              cy="20"
              r="11"
              stroke="#0F766E"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="5"
              stroke="#06B6D4"
              strokeWidth="2.2"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '20px 20px' }}
            />
          </>
        )}
        {slug === 'fissure' && (
          <>
            <circle cx="20" cy="20" r="11" stroke="#4338CA" strokeWidth="2" />
            <motion.path
              d="M14 20H26"
              stroke="#06B6D4"
              strokeWidth="2.4"
              strokeLinecap="round"
              initial={{ pathLength: 0.4 }}
              animate={{ pathLength: [0.4, 1, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <path d="M20 14V26" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {slug === 'fistula' && (
          <>
            <circle cx="13" cy="27" r="4" stroke="#047857" strokeWidth="2" />
            <circle cx="27" cy="13" r="4" stroke="#0284C7" strokeWidth="2" />
            <motion.path
              d="M16 24C18 18 22 22 24 16"
              stroke="#059669"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5, ease: EASE_SMOOTH }}
            />
          </>
        )}
      </svg>
    </div>
  );
};
