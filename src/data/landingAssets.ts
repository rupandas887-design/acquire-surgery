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
  hernia: {
    src: condHerniaCareImg,
    alt: '3D medical visualization of modern laparoscopic hernia mesh reinforcement engineering in a bright clinical studio',
  },
  'gallbladder-stones': {
    src: condGallbladderCareImg,
    alt: 'Modern minimally invasive laparoscopic optical keyhole surgical technology for gallbladder stone treatment',
  },
  piles: {
    src: condPilesLaserImg,
    alt: 'Precision fiber-optic surgical laser system in a clean hospital procedure room for day-care piles treatment',
  },
  fissure: {
    src: condFissureCareImg,
    alt: 'Specialist Indian surgeon reassuringly explaining gentle day-care fissure treatment options to a smiling patient',
  },
  fistula: {
    src: condFistulaMappingImg,
    alt: 'High-precision surgical ultrasound probe and contour mapping console used in modern fistula care evaluation',
  },
};
