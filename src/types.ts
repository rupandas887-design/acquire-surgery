export type HospitalCategory = 'Premium Hospital' | 'Standard Hospital' | 'Budget-Friendly Hospital' | 'Specialty Hospital';

export const PATIENT_CONDITIONS = [
  'Hernia',
  'Gallbladder Stones',
  'Piles',
  'Fissure',
  'Fistula',
  'Other / Not Sure',
] as const;

export type PatientCondition = (typeof PATIENT_CONDITIONS)[number] | string;

export const AFFORDABLE_BUDGETS = [
  'Below Rs. 50,000',
  'Rs. 50,000 – Rs. 1 Lakh',
  'Rs. 1 Lakh – Rs. 1.5 Lakh',
  'Rs. 1.5 Lakh – Rs. 2 Lakh',
  'Rs. 2 Lakh – Rs. 5 Lakh',
  'Above Rs. 5 Lakh',
] as const;

export type AffordableBudget = (typeof AFFORDABLE_BUDGETS)[number] | string;

export type InsuranceStatus = 'Yes' | 'No' | 'Not Sure';

export const CRM_LEAD_STATUSES = [
  'New Enquiry',
  'Contacted',
  'Requirements Under Review',
  'Options Shared',
  'Consultation Scheduled',
  'Converted',
  'Not Interested',
] as const;

export type LeadStatus =
  | (typeof CRM_LEAD_STATUSES)[number]
  | 'New Leads'
  | 'RNR'
  | 'Followup'
  | 'Junk';

export type UserRole = 'admin' | 'hospital';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
  hospitalName?: string;
  title?: string;
  avatar?: string;
}

export interface HospitalCapacityStatus {
  icuStatus: 'Available' | 'Limited' | 'Full';
  generalBedsAvailable: number;
  emergencyActive: boolean;
  acceptingReferrals: boolean;
  tpaDeskOpen: boolean;
}

export interface TreatmentEstimate {
  treatmentName: string;
  minCost: number;
  maxCost: number;
  notes?: string;
  id?: string;
  status?: 'Active' | 'Inactive';
  description?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface HospitalOperatingHour {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface HospitalAddress {
  line1: string;
  line2?: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
}

export interface HospitalSurgery {
  id: string;
  name: string;
  minCost: number;
  maxCost: number;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface Hospital {
  id: string;
  name: string;
  category: HospitalCategory;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  establishedYear: number;
  bedCount: number;
  specialties: string[];
  facilities: string[];
  accreditations: string[];
  description: string;
  imageUrl: string;
  phone: string;
  address: string;
  insuranceCashless: string[];
  treatmentEstimates: TreatmentEstimate[];
  registrationNumber?: string;
  mobile?: string;
  email?: string;
  addressDetails?: HospitalAddress;
  operatingHours?: HospitalOperatingHour[];
  surgeries?: HospitalSurgery[];
}

export interface HospitalAccount {
  id: string;
  hospitalId: string;
  hospitalName: string;
  email: string;
  mobile: string;
  username: string;
  passwordHash: string;
  accountStatus: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin?: string;
  mustChangePassword?: boolean;
}

export type ScheduleStatus = 'Scheduled' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'No Show';
export type ScheduleLeadSource =
  | 'Acquire OPD'
  | 'Google'
  | 'Instagram'
  | 'Walking'
  | 'Relatives / Friends'
  | 'Billboard'
  | 'Referral';
export type LeadSource = ScheduleLeadSource;

export interface ScheduleNote {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface PatientSchedule {
  id: string;
  patientName: string;
  mobile: string;
  hospitalId: string;
  hospitalName: string;
  surgeryName: string;
  minCost?: number;
  maxCost?: number;
  budget: string;
  source: ScheduleLeadSource;
  referralDetails?: string;
  appointmentDate: string;
  preferredTime: string;
  status: ScheduleStatus;
  notes: ScheduleNote[];
  createdAt: string;
}

export interface FormNote {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  name: HospitalCategory;
  shortDesc: string;
  fullDesc: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface TreatmentInfo {
  id: string;
  name: string;
  category: string;
  averageBangaloreMinCost: number;
  averageBangaloreMaxCost: number;
  recoveryDays: string;
  typicalStay: string;
  description: string;
  commonProcedures: string[];
  isActive?: boolean;
}

export interface UtmAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  fbclid?: string;
  gclid?: string;
  landingPageUrl?: string;
  referrer?: string;
  sourceCampaign?: string;
}

export interface LeadSubmissionInput {
  name: string;
  mobile: string;
  condition: string;
  suggestedTreatmentPlan?: string;
  insuranceStatus: InsuranceStatus;
  insuranceCompany?: string;
  expectedSurgeryDate?: string;
  budget: string;
  city?: string;
  whatsappConsent?: boolean;
  attribution?: UtmAttribution;
  source?: string;
  preferredHospitalId?: string;
  matchedHospitalIds?: string[];
}

export interface Lead {
  id: string;
  leadCode?: string;
  name: string;
  mobile: string;
  treatment: string;
  condition?: string;
  suggestedTreatmentPlan?: string;
  insuranceStatus?: InsuranceStatus;
  insuranceCompany?: string;
  expectedSurgeryDate?: string;
  budget: string;
  budgetNumeric?: number;
  city: string;
  createdAt: string;
  matchedHospitalIds: string[];
  matchedHospitalCount: number;
  status: LeadStatus;
  assignedRep?: string;
  notes?: string[];
  followUpDate?: string;
  preferredHospitalId?: string;
  preferredHospitalName?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPageUrl?: string;
  whatsappConsent?: boolean;
  whatsappAckSent?: boolean;
  teamNotified?: boolean;
}

export interface SearchCriteria {
  name: string;
  mobile: string;
  treatment: string;
  budget: string;
  budgetNumeric?: number;
  city: string;
}

export interface ConditionPageInfo {
  slug: string;
  condition: string;
  headline: string;
  subtitle: string;
  overview: string;
  whenAdvised: string[];
  surgicalApproaches: { name: string; stay: string; recovery: string; note: string }[];
  estimatedRange: string;
  insuranceNote: string;
  questionsToAsk: string[];
}
