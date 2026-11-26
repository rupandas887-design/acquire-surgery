import { ConditionPageInfo } from '../types';

export const CONDITION_PAGES: ConditionPageInfo[] = [
  {
    slug: 'hernia',
    condition: 'Hernia',
    headline: 'Explore Safe & Affordable Hernia Surgery Options',
    subtitle: 'Compare experienced laparoscopic surgeons, NABH-accredited hospitals, and transparent hernia mesh repair packages before deciding.',
    overview:
      'A hernia occurs when internal tissue pushes through a weakened muscle wall in the abdomen or groin (inguinal, umbilical, incisional, or hiatal). When advised surgery, patients often receive widely varying estimates depending on open vs. laparoscopic technique, mesh brand, and room category.',
    whenAdvised: [
      'Visible bulge in the groin, navel, or previous surgical scar',
      'Discomfort or heaviness while lifting, coughing, or standing long hours',
      'Doctor-recommended repair to prevent incarceration or strangulation',
    ],
    surgicalApproaches: [
      {
        name: 'Laparoscopic Mesh Repair (TEP / TAPP)',
        stay: '1 Day',
        recovery: '5–7 Days',
        note: 'Keyhole procedure with minimal post-operative pain and quicker return to routine.',
      },
      {
        name: 'Open Tension-Free Hernioplasty',
        stay: '1–2 Days',
        recovery: '10–14 Days',
        note: 'Suitable for large or complex hernias or patients advised against general anesthesia.',
      },
    ],
    estimatedRange: 'Rs. 55,000 – Rs. 1,45,000',
    insuranceNote:
      'Hernia surgery is widely covered under individual and corporate health insurance policies (subject to policy waiting periods). Cashless TPA pre-authorization support is available across participating hospitals.',
    questionsToAsk: [
      'Is laparoscopic or open repair safer for my hernia type and medical history?',
      'Which surgical mesh type is included in the estimated package?',
      'Does the estimate include room charges, anesthesia, surgeon fee, and follow-up visits?',
    ],
  },
  {
    slug: 'gallbladder-stones',
    condition: 'Gallbladder Stones',
    headline: 'Explore Gallbladder Stone Surgery Options with Clarity',
    subtitle: 'Understand laparoscopic cholecystectomy estimates, surgeon experience, and accredited hospital facilities across your budget range.',
    overview:
      'Gallstones (cholelithiasis) causing recurrent upper abdominal pain, nausea, or inflammation are commonly treated by removing the gallbladder via laparoscopic surgery. Comparing surgeon track records and transparent all-inclusive packages helps prevent surprise billing.',
    whenAdvised: [
      'Recurrent upper-right abdominal pain after meals',
      'Ultrasound-confirmed gallstones with biliary colic or cholecystitis',
      'Advised elective laparoscopic cholecystectomy before complications develop',
    ],
    surgicalApproaches: [
      {
        name: 'Laparoscopic Cholecystectomy',
        stay: '1–2 Days',
        recovery: '7–10 Days',
        note: 'Standard 3–4 tiny keyhole incisions with rapid recovery and minimal scarring.',
      },
      {
        name: 'Single-Incision / Complex Gallbladder Surgery',
        stay: '2–3 Days',
        recovery: '10–14 Days',
        note: 'Used when inflammation, adhesions, or common bile duct evaluation is required.',
      },
    ],
    estimatedRange: 'Rs. 60,000 – Rs. 1,60,000',
    insuranceNote:
      'Covered by almost all major health insurance and corporate TPA plans. Pre-authorization can be verified prior to admission.',
    questionsToAsk: [
      'Are pre-operative blood tests and ultrasound/MRCP included or billed separately?',
      'What happens if mild adhesions require an extra day of hospital stay?',
      'How many laparoscopic gallbladder procedures has the treating surgeon performed?',
    ],
  },
  {
    slug: 'piles',
    condition: 'Piles',
    headline: 'Compare Modern Piles (Hemorrhoids) Treatment Options',
    subtitle: 'Explore laser hemorrhoidoplasty, stapler surgery, and experienced proctology surgeons in trusted hospital facilities.',
    overview:
      'Grade 3 and Grade 4 hemorrhoids that do not respond to medication often require minimally invasive laser or stapler surgery. Because package prices vary sharply between daycare clinics and multi-specialty hospitals, comparing options ensures clinical safety without overpaying.',
    whenAdvised: [
      'Persistent painless bleeding during bowel movements',
      'Prolapsed hemorrhoidal tissue requiring manual reduction or remaining prolapsed',
      'Advised Laser Hemorrhoidoplasty or MIPH (Stapler) procedure',
    ],
    surgicalApproaches: [
      {
        name: 'Laser Hemorrhoidoplasty (LHP)',
        stay: 'Daycare / 24 Hrs',
        recovery: '3–5 Days',
        note: 'Minimal tissue trauma, low post-operative pain, and quick return to work.',
      },
      {
        name: 'Stapler Hemorrhoidopexy (MIPH)',
        stay: '1 Day',
        recovery: '5–7 Days',
        note: 'Effective for circumferential prolapsed Grade 3–4 internal piles.',
      },
    ],
    estimatedRange: 'Rs. 45,000 – Rs. 1,10,000',
    insuranceNote:
      'Covered under standard hospitalization and daycare surgical insurance terms; cashless facility depends on hospital TPA empanelment.',
    questionsToAsk: [
      'Does my grade of piles genuinely need laser, stapler, or conservative care?',
      'Is the disposable stapler/laser fiber cost included in the quoted estimate?',
      'What post-operative pain management and diet follow-up is provided?',
    ],
  },
  {
    slug: 'fissure',
    condition: 'Fissure',
    headline: 'Explore Chronic Anal Fissure Surgery & Laser Options',
    subtitle: 'Find experienced proctologists and transparent daycare surgical packages when medical treatment alone has not healed the fissure.',
    overview:
      'An anal fissure is a small tear in the mucosal lining causing sharp pain during or after bowel movements. Chronic fissures that do not heal with ointments and sitz baths may be advised Lateral Internal Sphincterotomy (LIS) or laser sphincterotomy.',
    whenAdvised: [
      'Chronic sharp pain or burning lasting hours after passing stools',
      'Sentinel skin tag or recurrent bleeding unresponsive to 6+ weeks of medicines',
      'Surgeon-advised Lateral Internal Sphincterotomy (LIS) or laser procedure',
    ],
    surgicalApproaches: [
      {
        name: 'Laser / Minimally Invasive Sphincterotomy',
        stay: 'Daycare / 1 Day',
        recovery: '3–6 Days',
        note: 'Precision relief of internal sphincter spasm with minimal discomfort.',
      },
      {
        name: 'Conventional Lateral Internal Sphincterotomy',
        stay: '1 Day',
        recovery: '7–10 Days',
        note: 'Time-tested surgical relief with high long-term healing rates.',
      },
    ],
    estimatedRange: 'Rs. 35,000 – Rs. 85,000',
    insuranceNote:
      'Eligible for daycare surgical coverage under most retail and group health insurance policies.',
    questionsToAsk: [
      'Have conservative non-surgical options been fully explored first?',
      'Will the procedure be done under short general or spinal anesthesia?',
      'Are follow-up consultations included in the daycare package?',
    ],
  },
  {
    slug: 'fistula',
    condition: 'Fistula',
    headline: 'Compare Experienced Surgeons for Anal Fistula Treatment',
    subtitle: 'Fistula surgery requires high surgical precision to prevent recurrence and protect sphincter control. Explore qualified specialists first.',
    overview:
      'An anal fistula is an abnormal tunnel connecting the anal canal to the outer skin, often following an abscess. Unlike routine procedures, choosing an experienced colorectal/general surgeon and accurate pre-op MRI mapping is essential to prevent recurrence.',
    whenAdvised: [
      'Recurrent pus or fluid discharge near the perianal skin',
      'Recurring painful swelling or abscess despite antibiotics',
      'Doctor-advised Fistulotomy, VAAFT, LIFT, or Laser FiLaC procedure',
    ],
    surgicalApproaches: [
      {
        name: 'Laser FiLaC / VAAFT (Sphincter-Saving)',
        stay: '1 Day',
        recovery: '7–10 Days',
        note: 'Minimally invasive tract closure designed to preserve sphincter muscles.',
      },
      {
        name: 'Fistulotomy / LIFT Procedure',
        stay: '1–2 Days',
        recovery: '10–14 Days',
        note: 'Selected based on low vs. high/complex fistula tract anatomy on MRI fistulogram.',
      },
    ],
    estimatedRange: 'Rs. 50,000 – Rs. 1,35,000',
    insuranceNote:
      'Covered under inpatient/daycare health insurance; MRI fistulogram and pre-op diagnostics may be covered under pre-hospitalization benefits.',
    questionsToAsk: [
      'Do I need an MRI Fistulogram before deciding the exact surgical technique?',
      'How does the proposed technique protect sphincter muscle control and minimize recurrence?',
      'What dressing and post-operative follow-up care is needed after discharge?',
    ],
  },
];

export function getConditionBySlug(slug: string): ConditionPageInfo | undefined {
  return CONDITION_PAGES.find((c) => c.slug === slug);
}
