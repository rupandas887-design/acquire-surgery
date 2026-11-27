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
      title: condition.seoTitle,
      description: condition.seoDescription,
      robots: 'index, follow',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: condition.seoTitle,
          description: condition.seoDescription,
          url: canonicalUrl,
          about: {
            '@type': 'MedicalCondition',
            name: condition.condition,
          },
          mainEntity: {
            '@type': 'MedicalProcedure',
            name: `${condition.condition} Surgery & Treatment Options`,
            description: condition.overview,
            procedureType: 'http://schema.org/SurgicalProcedure',
          },
          publisher: {
            '@type': 'MedicalOrganization',
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
          mainEntity: condition.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };
  } else if (cleanPath === '/privacy-policy') {
    config = {
      title: 'Privacy Policy & Patient Confidentiality – Acquire Surgery',
      description:
        'Learn how Acquire Surgery safeguards your medical enquiry details, surgery budget preferences, and insurance information.',
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
        'Review the Terms of Assistance for Acquire Surgery explaining our independent hospital comparison and budget-focused guidance.',
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
      title: 'Requirement Received – Acquire Surgery',
      description:
        'Thank you for sharing your surgery requirement and budget with Acquire Surgery. Our care coordination team will reach out shortly.',
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
      title: 'Acquire Surgery – Affordable Surgery Within Your Budget',
      description:
        'Quoted high for surgery? Compare hospital surgery costs for piles, hernia, gallbladder stones, uterine fibroids & endometriosis within your budget.',
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
            'Independent patient decision platform helping patients find suitable hospitals and affordable surgery options in India matched to their treatment needs and budget.',
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
              name: 'How does Acquire Surgery help if I received a high surgery quotation?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'If a hospital quoted a high amount such as ₹1,00,000 for piles or another surgery, Acquire Surgery helps you discover other suitable, credible hospitals and experienced surgeons that match your treatment requirements and budget.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is Acquire Surgery a hospital or surgery provider?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Acquire Surgery is not a hospital or clinic. We are an independent patient decision platform that helps patients explore suitable hospitals, surgeons, and indicative treatment options based on their medical needs and affordability.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are surgery prices fixed or guaranteed on Acquire Surgery?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Actual surgery costs depend on the hospital, treating surgeon, surgical procedure, medical condition, room category, and other clinical requirements confirmed after doctor evaluation.',
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
