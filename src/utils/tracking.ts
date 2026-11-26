import { UtmAttribution } from '../types';

const ATTRIBUTION_STORAGE_KEY = 'acquire_surgery_utm_attribution';
const CONVERSION_FIRED_PREFIX = 'acquire_surgery_conv_';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function initAdTracking(): void {
  if (typeof window === 'undefined') return;
  const ga4Id = import.meta.env?.VITE_GA4_MEASUREMENT_ID;
  const adsId = import.meta.env?.VITE_GOOGLE_ADS_ID;

  if (typeof window.gtag === 'function') {
    if (ga4Id) {
      window.gtag('config', ga4Id, { send_page_view: true });
    }
    if (adsId) {
      window.gtag('config', adsId);
    }
  }
}

export function captureAndPersistUtms(): UtmAttribution {
  if (typeof window === 'undefined') return {};

  let existing: UtmAttribution = {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) existing = JSON.parse(raw);
  } catch {
    // ignore storage failures
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || existing.utmSource || undefined;
  const utmMedium = params.get('utm_medium') || existing.utmMedium || undefined;
  const utmCampaign = params.get('utm_campaign') || existing.utmCampaign || undefined;
  const utmTerm = params.get('utm_term') || existing.utmTerm || undefined;
  const utmContent = params.get('utm_content') || existing.utmContent || undefined;
  const fbclid = params.get('fbclid') || existing.fbclid || undefined;
  const gclid = params.get('gclid') || existing.gclid || undefined;
  const landingPageUrl = existing.landingPageUrl || window.location.href;
  const referrer = existing.referrer || (document.referrer || undefined);

  let sourceCampaign = existing.sourceCampaign;
  if (utmCampaign || utmSource) {
    sourceCampaign = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ');
  } else if (fbclid) {
    sourceCampaign = 'Meta Video Ad';
  } else if (gclid) {
    sourceCampaign = 'Google Ad';
  } else if (!sourceCampaign) {
    sourceCampaign = 'Organic / Direct';
  }

  const captured: UtmAttribution = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    fbclid,
    gclid,
    landingPageUrl,
    referrer,
    sourceCampaign,
  };

  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // ignore
  }

  return captured;
}

export function getAttributionData(): UtmAttribution {
  return captureAndPersistUtms();
}

/**
 * Fires privacy-compliant form submission conversion events across Meta Pixel, GA4, and Google Ads.
 * Strictly avoids sending identifiable patient health information (PHI) such as name, phone, condition, or TPA.
 */
export function trackLeadConversion(leadId: string, attribution?: UtmAttribution): void {
  if (typeof window === 'undefined') return;
  const storageKey = `${CONVERSION_FIRED_PREFIX}${leadId}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
  } catch {
    // ignore
  }

  const safePayload = {
    content_name: 'Surgical Decision Enquiry',
    content_category: 'surgical_decision_support',
    currency: 'INR',
    value: 1,
    lead_reference: leadId,
    utm_source: attribution?.utmSource || 'direct',
    utm_campaign: attribution?.utmCampaign || 'organic',
  };

  // 1. Meta Pixel Lead Event (no PHI)
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', safePayload);
  }

  // 2. Google Analytics 4 Event (no PHI)
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'enquiry',
      event_label: attribution?.sourceCampaign || 'Acquire Surgery LP',
      currency: 'INR',
      value: 1,
    });

    const adsSendTo = import.meta.env?.VITE_GOOGLE_ADS_CONVERSION_SEND_TO;
    if (adsSendTo) {
      window.gtag('event', 'conversion', {
        send_to: adsSendTo,
        transaction_id: leadId,
      });
    }
  }

  // 3. Push clean dataLayer event
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'acquire_surgery_lead_submitted',
      leadReference: leadId,
      sourceCampaign: attribution?.sourceCampaign || 'Organic / Direct',
    });
  }
}

export function trackThankYouPageView(leadId?: string): void {
  if (typeof window === 'undefined') return;
  const ref = leadId || 'page_view';
  const key = `${CONVERSION_FIRED_PREFIX}ty_${ref}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // ignore
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'Surgical Enquiry Thank You Page',
      status: true,
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: 'Thank You - Acquire Surgery',
      page_path: '/thank-you',
    });
  }
}

export function trackWhatsAppClick(context: string): void {
  if (typeof window === 'undefined') return;

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: 'WhatsApp Consultation Click',
      content_category: context,
    });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: context,
    });
  }
}
