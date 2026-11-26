import React, { useState, useEffect } from 'react';
import { MotionConfig, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ConditionLandingPage } from './pages/ConditionLandingPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPortal } from './components/AdminPortal';
import { PageTransition } from './components/MotionPrimitives';
import { getConditionBySlug } from './data/conditionsData';
import { Lead } from './types';
import { captureAndPersistUtms, initAdTracking } from './utils/tracking';
import { applyRouteSeo } from './utils/seo';

function resolvePathRoute(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname || '/';
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const params = new URLSearchParams(window.location.search);

  if (hash === 'admin' || hash === 'portal' || hash === 'login' || params.has('admin') || params.has('portal')) {
    return '/admin';
  }
  return pathname === '' ? '/' : pathname;
}

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => resolvePathRoute());
  const [lastSubmittedLead, setLastSubmittedLead] = useState<Lead | null>(null);

  useEffect(() => {
    initAdTracking();
    captureAndPersistUtms();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(resolvePathRoute());
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const conditionMatch = currentPath.startsWith('/conditions/')
    ? getConditionBySlug(currentPath.replace('/conditions/', '').replace(/\/$/, ''))
    : undefined;

  useEffect(() => {
    applyRouteSeo(currentPath, conditionMatch);
  }, [currentPath, conditionMatch]);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  };

  const handleExploreOptions = () => {
    if (currentPath !== '/' && !currentPath.startsWith('/conditions/')) {
      navigate('/');
      setTimeout(() => {
        document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);
    } else {
      document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLeadSubmitted = (lead: Lead) => {
    setLastSubmittedLead(lead);
    navigate('/thank-you');
  };

  return (
    <MotionConfig reducedMotion="user">
      {currentPath === '/admin' ? (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
          <AnimatePresence mode="wait">
            <PageTransition routeKey="/admin">
              <AdminPortal onClose={() => navigate('/')} />
            </PageTransition>
          </AnimatePresence>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-[#EFF6FF] text-slate-800 selection:bg-cyan-100 selection:text-[#062B61]">
          <Navbar
            currentPath={currentPath}
            onNavigate={navigate}
            onExploreOptions={handleExploreOptions}
          />

          <main className="grow">
            <AnimatePresence mode="wait">
              {currentPath === '/thank-you' ? (
                <PageTransition routeKey="/thank-you">
                  <ThankYouPage
                    lead={lastSubmittedLead}
                    onNavigateHome={() => navigate('/')}
                  />
                </PageTransition>
              ) : currentPath === '/privacy-policy' ? (
                <PageTransition routeKey="/privacy-policy">
                  <PrivacyPolicyPage onNavigateHome={() => navigate('/')} />
                </PageTransition>
              ) : currentPath === '/terms' ? (
                <PageTransition routeKey="/terms">
                  <TermsPage onNavigateHome={() => navigate('/')} />
                </PageTransition>
              ) : conditionMatch ? (
                <PageTransition routeKey={currentPath}>
                  <ConditionLandingPage
                    conditionInfo={conditionMatch}
                    onLeadSubmitted={handleLeadSubmitted}
                    onNavigate={navigate}
                  />
                </PageTransition>
              ) : (
                <PageTransition routeKey="/">
                  <HomePage
                    onLeadSubmitted={handleLeadSubmitted}
                    onNavigate={navigate}
                  />
                </PageTransition>
              )}
            </AnimatePresence>
          </main>

          <Footer onNavigate={navigate} />
        </div>
      )}
    </MotionConfig>
  );
}

export default App;
