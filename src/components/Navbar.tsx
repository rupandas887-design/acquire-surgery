import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight } from 'lucide-react';
import { CONDITION_PAGES } from '../data/conditionsData';
import { EASE_SMOOTH, ScrollProgressBar } from './MotionPrimitives';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onExploreOptions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onExploreOptions,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled((window.scrollY || 0) > 16);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPath !== '/' && !currentPath.startsWith('/conditions/')) {
      onNavigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 160);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNavigate('/');
    }
  };

  const handleActionClick = () => {
    setMobileMenuOpen(false);
    onExploreOptions();
  };

  const navLinks = [
    { id: 'decision-factors', label: 'Decision Factors' },
    { id: 'condition-guides', label: 'Surgeries' },
    { id: 'what-happens-next', label: 'How It Works' },
    { id: 'enquiry-form', label: 'Enquiry Form' },
  ];

  return (
    <header
      id="acquire-surgery-header"
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-gradient-to-r from-[#EFF6FF]/95 via-white/95 to-[#ECFEFF]/95 backdrop-blur-md border-b border-sky-200 shadow-sm'
          : 'bg-gradient-to-r from-[#F0F7FF] via-white to-[#ECFEFF] border-b border-sky-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-16">
          {/* Zone 1: Clean Brand Wordmark */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.18, ease: EASE_SMOOTH }}
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate('/');
            }}
            className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062B61] rounded-md"
            aria-label="Acquire Surgery Home"
          >
            <Logo size="sm" showTagline={false} />
          </motion.a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="group relative py-2 hover:text-[#062B61] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-1 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#10B981] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200"
                />
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16, ease: EASE_SMOOTH }}
              onClick={handleActionClick}
              className="group hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#062B61] via-[#1D4ED8] to-[#0D9488] hover:from-[#05234E] hover:to-[#0F766E] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm shadow-blue-900/15 transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062B61]"
            >
              <span>Explore Options</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.button>

            <motion.button
              type="button"
              id="mobile-menu-toggle-btn"
              whileTap={{ scale: 0.94 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-900/25 backdrop-blur-[1px] z-30"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="md:hidden relative z-40 border-t border-sky-200 bg-gradient-to-b from-[#EFF6FF] via-white to-[#ECFDF5] px-4 py-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="w-full text-left px-3 py-3 min-h-[44px] text-sm font-semibold text-slate-800 hover:bg-sky-100/70 hover:text-[#062B61] rounded-lg cursor-pointer transition-colors"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                  Surgery Guides
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1 pb-2">
                  {CONDITION_PAGES.map((c) => (
                    <a
                      key={c.slug}
                      href={`/conditions/${c.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        onNavigate(`/conditions/${c.slug}`);
                      }}
                      className="px-3 py-2.5 min-h-[44px] flex items-center text-sm font-medium text-[#062B61] bg-white/80 border border-sky-100 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      {c.condition}
                    </a>
                  ))}
                </div>

                <div className="pt-3 border-t border-sky-200/70 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#062B61] via-[#1D4ED8] to-[#0D9488] text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-sm cursor-pointer transition-all"
                  >
                    <span>Explore My Surgical Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="/privacy-policy"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        onNavigate('/privacy-policy');
                      }}
                      className="min-h-[44px] inline-flex items-center justify-center text-xs font-medium text-slate-600 hover:text-[#062B61] rounded-lg hover:bg-slate-50"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/admin"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        onNavigate('/admin');
                      }}
                      className="min-h-[44px] inline-flex items-center justify-center text-xs font-medium text-slate-600 hover:text-[#062B61] rounded-lg hover:bg-slate-50"
                    >
                      Team CRM Login
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ScrollProgressBar />
    </header>
  );
};
