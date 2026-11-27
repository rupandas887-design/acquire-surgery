import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  HTMLMotionProps,
} from 'motion/react';

export const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SPRING = { stiffness: 260, damping: 26, mass: 0.9 };

interface FadeInViewProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  yOffset = 20,
  className = '',
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.52, delay, ease: EASE_SMOOTH }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.08,
  className = '',
  ...rest
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.48, ease: EASE_SMOOTH },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface PageTransitionProps {
  routeKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ routeKey, children }) => {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Hairline scroll progress bar along the bottom edge of the sticky navbar.
 * Uses GPU scaleX only; zero layout shift.
 */
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[#2563EB] via-[#06B6D4] via-[#10B981] to-[#F59E0B]"
    />
  );
};

/**
 * Masked kinetic headline reveal inspired by modern motion-graphics reels.
 * Animates each word cleanly upward out of an overflow mask on mount or scroll.
 */
interface KineticTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  inView?: boolean;
  delay?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  className = '',
  style,
  as = 'h1',
  inView = false,
  delay = 0.04,
}) => {
  const words = text.split(' ');
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      {...(inView
        ? { whileInView: 'visible', viewport: { once: true, amount: 0.25 } }
        : { animate: 'visible' })}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em] max-w-full">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '105%', opacity: 0 },
                visible: {
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.5, ease: EASE_SMOOTH },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </MotionTag>
  );
};

/**
 * Subtle scroll-linked vertical parallax container for media frames.
 */
export const ParallaxFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
  offset?: number;
}> = ({ children, className = '', offset = 16 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Tactile 3D-perspective hover card (only responds on fine-pointer hover devices).
 */
export const InteractiveTiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}> = ({ children, className = '', maxTilt = 3.5 }) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 240, damping: 22 });
  const smoothY = useSpring(rotateY, { stiffness: 240, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        className={`h-full will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Ambient medical-geometry SVG motion graphic with vibrant multi-colour radial blooms.
 * Pure compositor transforms & opacity; pointer-events-none so clicks are never blocked.
 */
export const AmbientMedicalGraphic: React.FC<{ variant?: 'light' | 'dark' }> = ({
  variant = 'light',
}) => {
  const strokeColor = variant === 'dark' ? 'rgba(56,189,248,0.22)' : 'rgba(37,99,235,0.12)';
  const accentColor = variant === 'dark' ? 'rgba(45,212,191,0.28)' : 'rgba(13,148,136,0.16)';
  const warmColor = variant === 'dark' ? 'rgba(251,191,36,0.22)' : 'rgba(245,158,11,0.12)';
  const gridColor = variant === 'dark' ? 'rgba(255,255,255,0.055)' : 'rgba(37,99,235,0.04)';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle architectural coordinate grid */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 60% 35%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 60% 35%, #000 30%, transparent 100%)',
        }}
      />

      {/* Precision rotating multi-colour compass rings */}
      <motion.svg
        viewBox="0 0 600 600"
        fill="none"
        className="absolute -top-28 -right-28 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="300" cy="300" r="245" stroke={strokeColor} strokeWidth="1.8" strokeDasharray="8 14" />
        <circle cx="300" cy="300" r="185" stroke={accentColor} strokeWidth="1.8" />
        <circle cx="300" cy="300" r="120" stroke={warmColor} strokeWidth="1.3" strokeDasharray="4 8" />
        <circle cx="300" cy="55" r="6" fill={accentColor} />
        <circle cx="545" cy="300" r="5" fill={warmColor} />
      </motion.svg>

      {/* Counter-rotating secondary geometry */}
      <motion.svg
        viewBox="0 0 360 360"
        fill="none"
        className="hidden sm:block absolute -bottom-24 left-6 w-[300px] h-[300px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 95, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="180" cy="180" r="145" stroke={accentColor} strokeWidth="1.4" strokeDasharray="6 10" />
        <circle cx="180" cy="180" r="98" stroke={strokeColor} strokeWidth="1.2" />
      </motion.svg>

      {/* Luminous vibrant gradient light blooms */}
      <motion.div
        className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(6,182,212,0.14) 45%, transparent 72%)'
              : 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(16,185,129,0.12) 45%, transparent 72%)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="hidden md:block absolute top-6 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(37,99,235,0.14) 50%, transparent 72%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(244,63,94,0.08) 55%, transparent 75%)',
        }}
        animate={{ y: [0, -16, 0], opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="hidden lg:block absolute -top-12 left-1/3 w-64 h-64 rounded-full blur-3xl"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};
