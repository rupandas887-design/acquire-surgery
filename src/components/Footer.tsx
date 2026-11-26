import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { CONDITION_PAGES } from '../data/conditionsData';
import { trackWhatsAppClick } from '../utils/tracking';
import { FadeInView, EASE_SMOOTH } from './MotionPrimitives';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer id="site-footer" className="relative bg-gradient-to-br from-[#041B42] via-[#092C5C] to-[#0B4F5C] text-slate-200 border-t border-cyan-900/50 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] via-[#10B981] to-[#F59E0B]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full blur-3xl opacity-25 bg-gradient-to-br from-[#06B6D4] to-[#10B981]"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeInView yOffset={14}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-slate-800/80">
            {/* Brand & Disclaimer Positioning */}
            <div className="lg:col-span-5 space-y-4">
              <Logo size="md" variant="white" showTagline={false} />
              <p className="text-sm font-semibold text-white">
                Acquire Surgery – Your Surgical Decision Partner.
              </p>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-md">
                Acquire Surgery is not a hospital. It is a patient-focused Surgical Decision Partner that helps patients explore and compare experienced surgeons, hospital facilities, and affordable treatment estimates before deciding.
              </p>
            </div>

            {/* Condition Landing Pages (Scalable Architecture) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Surgical Conditions
              </h4>
              <ul className="space-y-1.5 text-sm">
                {CONDITION_PAGES.map((cond) => (
                  <li key={cond.slug}>
                    <a
                      href={`/conditions/${cond.slug}`}
                      onClick={(e) => handleLinkClick(e, `/conditions/${cond.slug}`)}
                      className="group text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1 py-1.5 min-h-[36px] cursor-pointer"
                    >
                      <span className="group-hover:underline underline-offset-4">
                        {cond.condition} Surgery Options
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-teal-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Patient Support & Legal */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Patient Assistance &amp; Legal
              </h4>
              <div className="space-y-2.5 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href="tel:+919429693887"
                    className="text-white hover:text-teal-200 hover:underline underline-offset-4 font-medium py-1"
                  >
                    +91 94296 93887
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <a
                    href="mailto:acquireopd@gmail.com"
                    className="text-white hover:text-teal-200 hover:underline underline-offset-4 py-1 break-all"
                  >
                    acquireopd@gmail.com
                  </a>
                </div>
                <div className="pt-1">
                  <motion.a
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                    href="https://wa.me/919429693887?text=Hi%20Acquire%20Surgery%2C%20I%20would%20like%20help%20exploring%20surgical%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('footer_whatsapp')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#059669] to-[#0D9488] hover:from-[#047857] hover:to-[#0F766E] border border-emerald-400/50 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-100" />
                    <span>Connect on WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>

        {/* Medical Disclaimer */}
        <div className="py-5 text-xs text-slate-400 leading-relaxed border-b border-slate-800">
          <strong className="text-slate-300">Medical &amp; Cost Notice:</strong> Acquire Surgery facilitates comparison of surgeons, hospital facilities, and indicative package estimates. Final clinical suitability, surgical approach, and exact billing are confirmed only after direct consultation with the treating surgeon and hospital.
        </div>

        {/* Bottom Legal & Navigation Row (Fully Clickable Links) */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Acquire Surgery – Your Surgical Decision Partner.
          </div>
          <nav aria-label="Footer legal and portal links" className="flex flex-wrap items-center gap-x-4 gap-y-2 relative z-10">
            <a
              id="footer-privacy-policy-link"
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, '/privacy-policy')}
              className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer py-2 px-1 transition-colors inline-flex items-center min-h-[40px]"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <a
              id="footer-terms-link"
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer py-2 px-1 transition-colors inline-flex items-center min-h-[40px]"
            >
              Terms of Assistance
            </a>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <a
              id="footer-admin-crm-link"
              href="/admin"
              onClick={(e) => handleLinkClick(e, '/admin')}
              className="text-slate-300 hover:text-white hover:underline underline-offset-4 cursor-pointer py-2 px-1 transition-colors inline-flex items-center min-h-[40px]"
            >
              Team CRM Login
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
