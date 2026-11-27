import heroConsultationImg from '../assets/images/hero_indian_surgical_consultation_1795680839779.jpg';
import heroHospitalAtriumImg from '../assets/images/hero_hospital_atrium_backdrop_1795695674689.jpg';
import heroFamilyCareImg from '../assets/images/hero_family_care_navigator_1795695673873.jpg';
import surgeonFactorImg from '../assets/images/factor_experienced_surgeon_1795680839939.jpg';
import hospitalFactorImg from '../assets/images/factor_hospital_facility_1795680839725.jpg';
import affordableFactorImg from '../assets/images/factor_affordable_treatment_1795680839741.jpg';
import patientFamilyClarityImg from '../assets/images/patient_family_clarity_1795692753521.jpg';
import careCoordinatorSupportImg from '../assets/images/care_coordinator_support_1795692753963.jpg';
import surgicalRecoveryLifestyleImg from '../assets/images/surgical_recovery_lifestyle_1795692755263.jpg';
import condHerniaCareImg from '../assets/images/cond_hernia_care_1795692755566.jpg';
import condGallbladderCareImg from '../assets/images/cond_gallbladder_care_1795692756501.jpg';
import condPilesLaserImg from '../assets/images/cond_piles_laser_1795692757535.jpg';
import condFissureCareImg from '../assets/images/cond_fissure_care_1795692757085.jpg';
import condFistulaMappingImg from '../assets/images/cond_fistula_mapping_1795692775749.jpg';
import condUterineFibroidsImg from '../assets/images/cond_uterine_fibroids_care_1795770940020.jpg';
import condEndometriosisImg from '../assets/images/cond_endometriosis_care_1795770941449.jpg';

export const LANDING_IMAGES = {
  heroConsultation: heroConsultationImg,
  heroHospitalAtrium: heroHospitalAtriumImg,
  heroFamilyCare: heroFamilyCareImg,
  experiencedSurgeon: surgeonFactorImg,
  hospitalFacility: hospitalFactorImg,
  affordableTreatment: affordableFactorImg,
  patientFamilyClarity: patientFamilyClarityImg,
  careCoordinatorSupport: careCoordinatorSupportImg,
  surgicalRecoveryLifestyle: surgicalRecoveryLifestyleImg,
};

export interface ConditionVisualAsset {
  src: string;
  alt: string;
}

export const CONDITION_IMAGES: Record<string, ConditionVisualAsset> = {
  piles: {
    src: condPilesLaserImg,
    alt: 'Precision laser piles treatment setup in an accredited hospital for affordable piles surgery in India',
  },
  hernia: {
    src: condHerniaCareImg,
    alt: 'Laparoscopic hernia mesh repair visualization for comparing hernia surgery cost and hospital facilities',
  },
  'gallbladder-stones': {
    src: condGallbladderCareImg,
    alt: 'Minimally invasive laparoscopic gallbladder surgery technology for transparent gallbladder surgery cost options',
  },
  'uterine-fibroids': {
    src: condUterineFibroidsImg,
    alt: 'Gynecology specialist discussing affordable uterine fibroid surgery and laparoscopic myomectomy options with a couple',
  },
  endometriosis: {
    src: condEndometriosisImg,
    alt: 'Doctor reviewing personalized endometriosis treatment options and hospital surgery cost clarity with a patient',
  },
  fissure: {
    src: condFissureCareImg,
    alt: 'Specialist surgeon explaining gentle day-care anal fissure treatment and hospital budget options to a patient',
  },
  fistula: {
    src: condFistulaMappingImg,
    alt: 'High-precision surgical ultrasound mapping console for evaluating anal fistula treatment options',
  },
};
