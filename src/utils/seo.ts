import { ConditionPageInfo } from '../types';

interface SeoConfig {
  title: string;
  description: string;
  robots?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function upsertJsonLd(data?: Record<string, unknown> | Array<Record<string, unknown>>) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('route-jsonld');
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const script = existing || document.createElement('script');
  script.id = 'route-jsonld';
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(data);
  if (!existing) {
    document.head.appendChild(script);
  }
}

export function applyRouteSeo(currentPath: string, condition?: ConditionPageInfo) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = window.location.origin;
  const cleanPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
  const canonicalUrl = `${origin}${cleanPath}`;

  let config: SeoConfig;

  if (condition) {
    config = {
      title: `${condition.condition} Surgery Options & Cost – Acquire Surgery`,
      description: `${condition.subtitle} Indicative package range: ${condition.estimatedRange}. Compare surgeons & hospitals with Acquire Surgery.`,
      robots: 'index, follow',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: `${condition.condition} Surgery Options – Acquire Surgery`,
          description: condition.overview,
          url: canonicalUrl,
          about: {
            '@type': 'MedicalCondition',
            name: condition.condition,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Acquire Surgery',
            url: origin,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${condition.condition} Surgery Options`,
              item: canonicalUrl,
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: condition.questionsToAsk.map((q) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${condition.overview} ${condition.insuranceNote}`,
            },
          })),
        },
      ],
    };
  } else if (cleanPath === '/privacy-policy') {
    config = {
      title: 'Privacy Policy & Data Protection – Acquire Surgery',
      description:
        'Read how Acquire Surgery protects your medical enquiry details, insurance information, and privacy with strict healthcare data confidentiality.',
      robots: 'index, follow',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy – Acquire Surgery',
        url: canonicalUrl,
      },
    };
  } else if (cleanPath === '/terms') {
    config = {
      title: 'Terms of Surgical Decision Assistance – Acquire Surgery',
      description:
        'Review the Terms of Assistance for Acquire Surgery, explaining our independent surgical decision support, indicative estimates, and patient choice.',
      robots: 'index, follow',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms of Assistance – Acquire Surgery',
        url: canonicalUrl,
      },
    };
  } else if (cleanPath === '/thank-you') {
    config = {
      title: 'Enquiry Received – Acquire Surgery',
      description:
        'Thank you for submitting your surgical requirements to Acquire Surgery. Our care coordination team will contact you shortly.',
      robots: 'noindex, nofollow',
    };
  } else if (cleanPath === '/admin') {
    config = {
      title: 'Team Lead CRM & Partner Portal – Acquire Surgery',
      description: 'Secure internal lead management and hospital partner portal for Acquire Surgery.',
      robots: 'noindex, nofollow',
    };
  } else {
    config = {
      title: 'Acquire Surgery – Compare Surgeons, Hospitals & Costs',
      description:
        'Compare experienced surgeons, accredited hospital facilities, and transparent treatment estimates before deciding on surgery with Acquire Surgery.',
      robots: 'index, follow',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalOrganization',
          name: 'Acquire Surgery',
          alternateName: 'Acquire Surgery – Your Surgical Decision Partner',
          url: origin,
          logo: `${origin}/logo.png`,
          telephone: '+91-94296-93887',
          email: 'acquireopd@gmail.com',
          description:
            'Independent surgical decision platform helping patients explore experienced surgeons, accredited hospitals, and transparent surgery packages.',
          areaServed: {
            '@type': 'Country',
            name: 'India',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Acquire Surgery',
          url: origin,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is Acquire Surgery a hospital?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Acquire Surgery is an independent Surgical Decision Partner that helps diagnosed patients explore and compare experienced surgeons, hospital facilities, and transparent treatment packages.',
              },
            },
            {
              '@type': 'Question',
              name: 'What surgical conditions does Acquire Surgery help with?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We help patients explore surgical options for Hernia, Gallbladder Stones, Piles, Fissure, Fistula, and other advised general or laparoscopic procedures.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I compare surgery costs and health insurance eligibility?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. You can share your preferred budget range and health insurance or TPA details to explore suitable hospitals and transparent treatment estimates.',
              },
            },
          ],
        },
      ],
    };
  }

  document.title = config.title;
  upsertMeta('name', 'description', config.description);
  upsertMeta('name', 'robots', config.robots || 'index, follow');
  upsertMeta('property', 'og:title', config.title);
  upsertMeta('property', 'og:description', config.description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:site_name', 'Acquire Surgery');
  upsertMeta('name', 'twitter:title', config.title);
  upsertMeta('name', 'twitter:description', config.description);
  upsertCanonical(canonicalUrl);
  upsertJsonLd(config.schema);
}
