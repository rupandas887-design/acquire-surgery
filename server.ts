import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_HOSPITALS, INITIAL_CATEGORIES, INITIAL_TREATMENTS, INITIAL_LEADS } from './src/data/initialData';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { 
  INITIAL_HOSPITAL_ACCOUNTS, 
  INITIAL_SCHEDULES, 
  hashPassword, 
  generateRandomTempPassword 
} from './src/data/crmData';
import { 
  Hospital, 
  CategoryInfo, 
  TreatmentInfo, 
  Lead, 
  LeadStatus, 
  HospitalAccount, 
  PatientSchedule 
} from './src/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://zfifmfzrzxmbwilcsnhx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWZtZnpyenhtYndpbGNzbmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk1NDEsImV4cCI6MjEwNzUyNTU0MX0.2-7NB9SoCXG-5BnpwBneKevxZQmjf5F3LQaTEiz2Auk';
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory persistent state (seeded with comprehensive initial data)
let hospitals: Hospital[] = [...INITIAL_HOSPITALS];
let categories: CategoryInfo[] = [...INITIAL_CATEGORIES];
let treatments: TreatmentInfo[] = [...INITIAL_TREATMENTS];
let leads: Lead[] = [...INITIAL_LEADS];
let hospitalAccounts: HospitalAccount[] = [...INITIAL_HOSPITAL_ACCOUNTS];
let schedules: PatientSchedule[] = [...INITIAL_SCHEDULES];

function parseBudgetNumeric(budgetString: string): number {
  if (!budgetString) return 1000000;
  const lower = budgetString.toLowerCase();
  if (lower.includes('not sure')) return 1000000;
  if (lower.includes('below ₹20,000') || lower.includes('below rs. 20,000')) return 20000;
  if (lower.includes('20,000') && lower.includes('40,000')) return 40000;
  if (lower.includes('40,000') && lower.includes('60,000')) return 60000;
  if (lower.includes('60,000') && lower.includes('1,00,000')) return 100000;
  if (lower.includes('above ₹1,00,000') || lower.includes('above rs. 1,00,000')) return 200000;
  if (lower.includes('below 50,000') || lower.includes('below ₹50,000') || lower.includes('below rs. 50,000')) return 50000;
  if (lower.includes('50,000 – 1 lakh') || lower.includes('50,000 – ₹1 lakh') || lower.includes('50,000 – rs. 1 lakh')) return 100000;
  if (lower.includes('1 lakh – rs. 1.5 lakh') || lower.includes('1 – 1.5 lakh')) return 150000;
  if (lower.includes('1.5 lakh – rs. 2 lakh') || lower.includes('1 – 2 lakh') || lower.includes('1 – ₹2 lakh')) return 200000;
  if (lower.includes('2 – 5 lakh') || lower.includes('2 – ₹5 lakh') || lower.includes('2 lakh – rs. 5 lakh')) return 500000;
  if (lower.includes('5 lakh+') || lower.includes('5 lakh')) return 10000000;
  const digits = budgetString.replace(/[^0-9]/g, '');
  if (digits) {
    const val = parseInt(digits, 10);
    return val > 0 ? val : 1000000;
  }
  return 1000000;
}

function sanitizePgDate(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  return null;
}

function isMissingColumnError(err: any): boolean {
  const msg = String(err?.message || '').toLowerCase();
  const code = String(err?.code || '');
  return code === 'PGRST204' || code === '42703' || msg.includes('column') || msg.includes('schema cache');
}

function isMissingTableError(err: any): boolean {
  const msg = String(err?.message || '').toLowerCase();
  const code = String(err?.code || '');
  return code === 'PGRST205' || code === '42P01' || msg.includes('does not exist') || msg.includes('could not find the table');
}

// ---------- Table Row Mappers (Supabase <-> App Types) ----------
function toCategoryRow(c: CategoryInfo) {
  return {
    id: c.id,
    name: c.name,
    short_desc: c.shortDesc,
    full_desc: c.fullDesc,
    color: c.color,
    badge_bg: c.badgeBg,
    badge_border: c.badgeBorder,
    badge_text: c.badgeText,
  };
}

function fromCategoryRow(row: any): CategoryInfo {
  return {
    id: String(row.id),
    name: row.name,
    shortDesc: row.short_desc ?? '',
    fullDesc: row.full_desc ?? '',
    color: row.color ?? '#0A3B75',
    badgeBg: row.badge_bg ?? '',
    badgeBorder: row.badge_border ?? '',
    badgeText: row.badge_text ?? '',
  };
}

function toTreatmentRow(t: TreatmentInfo) {
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    average_bangalore_min_cost: t.averageBangaloreMinCost,
    average_bangalore_max_cost: t.averageBangaloreMaxCost,
    recovery_days: t.recoveryDays,
    typical_stay: t.typicalStay,
    description: t.description,
    common_procedures: Array.isArray(t.commonProcedures) ? t.commonProcedures : [],
    is_active: t.isActive ?? true,
  };
}

function fromTreatmentRow(row: any): TreatmentInfo {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category || 'General Surgery',
    averageBangaloreMinCost: Number(row.average_bangalore_min_cost ?? 50000),
    averageBangaloreMaxCost: Number(row.average_bangalore_max_cost ?? 120000),
    recoveryDays: row.recovery_days ?? '1–2 weeks',
    typicalStay: row.typical_stay ?? '1–2 days',
    description: row.description ?? '',
    commonProcedures: Array.isArray(row.common_procedures) ? row.common_procedures : [],
    isActive: row.is_active ?? true,
  };
}

function toHospitalRow(h: Hospital) {
  return {
    id: h.id,
    name: h.name,
    category: h.category,
    location: h.location,
    city: h.city || 'Bangalore',
    rating: h.rating ?? 4.5,
    review_count: h.reviewCount ?? 0,
    established_year: h.establishedYear ?? 2015,
    bed_count: h.bedCount ?? 100,
    specialties: Array.isArray(h.specialties) ? h.specialties : [],
    facilities: Array.isArray(h.facilities) ? h.facilities : [],
    accreditations: Array.isArray(h.accreditations) ? h.accreditations : [],
    description: h.description ?? '',
    image_url: h.imageUrl ?? '',
    phone: h.phone ?? '',
    mobile: h.mobile ?? null,
    email: h.email ?? null,
    registration_number: h.registrationNumber ?? null,
    address: h.address ?? '',
    address_details: h.addressDetails ?? null,
    operating_hours: Array.isArray(h.operatingHours) ? h.operatingHours : [],
    insurance_cashless: Array.isArray(h.insuranceCashless) ? h.insuranceCashless : [],
    treatment_estimates: Array.isArray(h.treatmentEstimates) ? h.treatmentEstimates : [],
    surgeries: Array.isArray(h.surgeries) ? h.surgeries : [],
  };
}

function fromHospitalRow(row: any): Hospital {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    location: row.location || 'Bangalore',
    city: row.city || 'Bangalore',
    rating: Number(row.rating ?? 4.5),
    reviewCount: Number(row.review_count ?? 0),
    establishedYear: Number(row.established_year ?? 2015),
    bedCount: Number(row.bed_count ?? 100),
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    accreditations: Array.isArray(row.accreditations) ? row.accreditations : [],
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    phone: row.phone ?? '',
    mobile: row.mobile ?? undefined,
    email: row.email ?? undefined,
    registrationNumber: row.registration_number ?? undefined,
    address: row.address ?? '',
    addressDetails: row.address_details ?? undefined,
    operatingHours: Array.isArray(row.operating_hours) ? row.operating_hours : undefined,
    insuranceCashless: Array.isArray(row.insurance_cashless) ? row.insurance_cashless : [],
    treatmentEstimates: Array.isArray(row.treatment_estimates) ? row.treatment_estimates : [],
    surgeries: Array.isArray(row.surgeries) && row.surgeries.length > 0 ? row.surgeries : undefined,
  };
}

function toHospitalAccountRow(a: HospitalAccount) {
  return {
    id: a.id,
    hospital_id: a.hospitalId,
    hospital_name: a.hospitalName,
    email: a.email,
    mobile: a.mobile,
    username: a.username,
    password_hash: a.passwordHash,
    account_status: a.accountStatus || 'Active',
    must_change_password: a.mustChangePassword ?? true,
    last_login: a.lastLogin || null,
    created_at: a.createdAt || new Date().toISOString(),
  };
}

function fromHospitalAccountRow(row: any): HospitalAccount {
  return {
    id: String(row.id),
    hospitalId: row.hospital_id ?? '',
    hospitalName: row.hospital_name ?? '',
    email: row.email ?? '',
    mobile: row.mobile ?? '',
    username: row.username ?? '',
    passwordHash: row.password_hash ?? '',
    accountStatus: (row.account_status as 'Active' | 'Inactive') || 'Active',
    mustChangePassword: row.must_change_password ?? true,
    lastLogin: row.last_login ?? undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function toScheduleRow(s: PatientSchedule) {
  return {
    id: s.id,
    patient_name: s.patientName,
    mobile: s.mobile,
    hospital_id: s.hospitalId,
    hospital_name: s.hospitalName,
    surgery_name: s.surgeryName,
    min_cost: s.minCost ?? null,
    max_cost: s.maxCost ?? null,
    budget: s.budget ?? null,
    source: s.source || 'Acquire OPD',
    referral_details: s.referralDetails ?? null,
    appointment_date: sanitizePgDate(s.appointmentDate) || new Date().toISOString().split('T')[0],
    preferred_time: s.preferredTime || '10:00 AM',
    status: s.status || 'Scheduled',
    notes: Array.isArray(s.notes) ? s.notes : [],
    created_at: s.createdAt || new Date().toISOString(),
  };
}

function fromScheduleRow(row: any): PatientSchedule {
  return {
    id: String(row.id),
    patientName: row.patient_name ?? 'Patient',
    mobile: row.mobile ?? '',
    hospitalId: row.hospital_id ?? '',
    hospitalName: row.hospital_name ?? '',
    surgeryName: row.surgery_name ?? '',
    minCost: row.min_cost !== null && row.min_cost !== undefined ? Number(row.min_cost) : undefined,
    maxCost: row.max_cost !== null && row.max_cost !== undefined ? Number(row.max_cost) : undefined,
    budget: row.budget ?? '₹1 – ₹2 Lakh',
    source: (row.source as any) || 'Acquire OPD',
    referralDetails: row.referral_details ?? undefined,
    appointmentDate: row.appointment_date || new Date().toISOString().split('T')[0],
    preferredTime: row.preferred_time || '10:00 AM',
    status: (row.status as any) || 'Scheduled',
    notes: Array.isArray(row.notes) ? row.notes : [],
    createdAt: row.created_at || new Date().toISOString(),
  };
}

async function loadTableWithSeedFallback<T>(
  table: string,
  fallbackItems: T[],
  fromRow: (r: any) => T,
  toRow: (item: T) => Record<string, any>,
  orderColumn = 'created_at',
  ascending = false
): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*').order(orderColumn, { ascending });
    if (error) {
      if (!isMissingTableError(error)) {
        console.warn(`Supabase GET ${table} fallback:`, error.message);
      }
      return fallbackItems;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data.map(fromRow);
    }
    // Table exists and is empty -> seed initial data once
    if (fallbackItems.length > 0) {
      const { data: seeded, error: seedErr } = await supabase
        .from(table)
        .upsert(fallbackItems.map(toRow), { onConflict: 'id' })
        .select();
      if (!seedErr && Array.isArray(seeded) && seeded.length > 0) {
        return seeded.map(fromRow);
      }
    }
  } catch (err: any) {
    console.warn(`Supabase sync ${table} exception:`, err?.message);
  }
  return fallbackItems;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // =================== API ROUTES ===================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Authentication: Login using exclusively public.user_roles in Supabase
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const cleanUsername = typeof username === 'string' ? username.trim() : '';
      const cleanPassword = typeof password === 'string' ? password.trim() : '';

      if (!cleanUsername || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
      }

      // Query public.user_roles table in Supabase
      let userRecord: any = null;

      // 1. First query with 'username'
      const { data: users1, error: err1 } = await supabase
        .from('user_roles')
        .select('*')
        .ilike('username', cleanUsername)
        .limit(1);

      if (err1) {
        // If 'username' column query failed, attempt query with capitalized 'Username'
        const { data: users2, error: err2 } = await supabase
          .from('user_roles')
          .select('*')
          .ilike('Username', cleanUsername)
          .limit(1);

        if (!err2 && users2 && users2.length > 0) {
          userRecord = users2[0];
        } else if (err2) {
          console.error('Database query error on user_roles:', err2.message);
          return res.status(500).json({ success: false, error: 'Database service error' });
        }
      } else if (users1 && users1.length > 0) {
        userRecord = users1[0];
      }

      if (!userRecord) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }

      const storedPassword = userRecord.password ?? userRecord.Password ?? '';
      const storedUsername = userRecord.username ?? userRecord.Username ?? cleanUsername;
      const storedRole = (userRecord.role ?? userRecord.Role ?? 'admin').toLowerCase();

      let isPasswordValid = false;

      // Plaintext verification
      if (storedPassword === cleanPassword) {
        isPasswordValid = true;
      } 
      // Bcrypt hash verification
      else if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
        try {
          isPasswordValid = await bcrypt.compare(cleanPassword, storedPassword);
        } catch {
          isPasswordValid = false;
        }
      }

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }

      return res.json({
        success: true,
        user: {
          username: storedUsername,
          role: storedRole
        }
      });
    } catch (routeErr: any) {
      console.error('Server login handler error:', routeErr?.message || 'Internal error');
      return res.status(500).json({ success: false, error: 'Authentication service encountered an error' });
    }
  });

  // Hospitals: GET with dynamic matching & filters (backed by Supabase when available)
  app.get('/api/hospitals', async (req, res) => {
    hospitals = await loadTableWithSeedFallback('hospitals', hospitals, fromHospitalRow, toHospitalRow, 'name', true);
    const { treatment, budget, category, location, query } = req.query;
    let filtered = [...hospitals];

    if (treatment && typeof treatment === 'string' && treatment !== 'All Treatments' && treatment !== 'Other') {
      const targetTreatment = treatment.toLowerCase();
      filtered = filtered.filter(h =>
        h.treatmentEstimates.some(t => t.treatmentName.toLowerCase().includes(targetTreatment)) ||
        h.specialties.some(s => s.toLowerCase().includes(targetTreatment))
      );
    }

    if (budget && typeof budget === 'string') {
      const maxBudget = parseBudgetNumeric(budget);
      if (maxBudget < 10000000) {
        if (treatment && typeof treatment === 'string' && treatment !== 'All Treatments' && treatment !== 'Other') {
          const targetTreatment = treatment.toLowerCase();
          filtered = filtered.filter(h => {
            const estimate = h.treatmentEstimates.find(t => t.treatmentName.toLowerCase().includes(targetTreatment));
            if (!estimate) return true;
            return estimate.minCost <= maxBudget * 1.25;
          });
        }
      }
    }

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(h => h.category === category);
    }

    if (location && typeof location === 'string' && location !== 'All Locations' && location !== 'All') {
      filtered = filtered.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (query && typeof query === 'string' && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some(s => s.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  });

  // Single Hospital: GET
  app.get('/api/hospitals/:id', async (req, res) => {
    hospitals = await loadTableWithSeedFallback('hospitals', hospitals, fromHospitalRow, toHospitalRow, 'name', true);
    const hospital = hospitals.find(h => h.id === req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  });

  // Hospitals: POST (Admin add)
  app.post('/api/hospitals', async (req, res) => {
    const body = req.body;
    if (!body.name || !body.category) {
      return res.status(400).json({ success: false, error: 'Name and category are required' });
    }
    const newHospital: Hospital = {
      id: `hosp-${Date.now()}`,
      name: body.name,
      category: body.category,
      location: body.location || 'Bangalore',
      city: body.city || 'Bangalore',
      rating: body.rating || 4.5,
      reviewCount: body.reviewCount || 50,
      establishedYear: body.establishedYear || 2015,
      bedCount: body.bedCount || 150,
      specialties: body.specialties || ['General Surgery'],
      facilities: body.facilities || ['NABH Accredited', '24x7 Emergency', 'Cashless TPA Desk'],
      accreditations: body.accreditations || ['NABH'],
      description: body.description || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      phone: body.phone || '+91 80 4000 0000',
      address: body.address || 'Bangalore, Karnataka',
      insuranceCashless: body.insuranceCashless || ['Star Health', 'Medi Assist'],
      treatmentEstimates: body.treatmentEstimates || [],
      mobile: body.mobile,
      email: body.email,
      registrationNumber: body.registrationNumber,
      addressDetails: body.addressDetails,
      operatingHours: body.operatingHours,
      surgeries: body.surgeries,
    };
    hospitals.unshift(newHospital);
    const { error } = await supabase.from('hospitals').upsert([toHospitalRow(newHospital)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase POST hospital warning:', error.message);
    }
    res.status(201).json({ success: true, data: newHospital });
  });

  // Hospitals: PUT (Admin edit)
  app.put('/api/hospitals/:id', async (req, res) => {
    hospitals = await loadTableWithSeedFallback('hospitals', hospitals, fromHospitalRow, toHospitalRow, 'name', true);
    const index = hospitals.findIndex(h => h.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    hospitals[index] = { ...hospitals[index], ...req.body, id: req.params.id };
    const { error } = await supabase.from('hospitals').upsert([toHospitalRow(hospitals[index])], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase PUT hospital warning:', error.message);
    }
    res.json({ success: true, data: hospitals[index] });
  });

  // Hospitals: DELETE (Admin delete)
  app.delete('/api/hospitals/:id', async (req, res) => {
    const index = hospitals.findIndex(h => h.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    const deleted = hospitals.splice(index, 1);
    const { error } = await supabase.from('hospitals').delete().eq('id', req.params.id);
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase DELETE hospital warning:', error.message);
    }
    res.json({ success: true, data: deleted[0] });
  });

  // Categories: GET
  app.get('/api/categories', async (req, res) => {
    categories = await loadTableWithSeedFallback('categories', categories, fromCategoryRow, toCategoryRow, 'id', true);
    res.json({ success: true, data: categories });
  });

  // Categories: PUT (Admin update category descriptions)
  app.put('/api/categories/:id', async (req, res) => {
    categories = await loadTableWithSeedFallback('categories', categories, fromCategoryRow, toCategoryRow, 'id', true);
    const index = categories.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    categories[index] = { ...categories[index], ...req.body, id: req.params.id };
    const { error } = await supabase.from('categories').upsert([toCategoryRow(categories[index])], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase PUT category warning:', error.message);
    }
    res.json({ success: true, data: categories[index] });
  });

  // Treatments: GET
  app.get('/api/treatments', async (req, res) => {
    treatments = await loadTableWithSeedFallback('treatments', treatments, fromTreatmentRow, toTreatmentRow, 'name', true);
    res.json({ success: true, data: treatments });
  });

  // Treatments: POST (Admin add treatment)
  app.post('/api/treatments', async (req, res) => {
    treatments = await loadTableWithSeedFallback('treatments', treatments, fromTreatmentRow, toTreatmentRow, 'name', true);
    const body = req.body;
    const cleanName = typeof body.name === 'string' ? body.name.trim() : '';
    if (!cleanName) {
      return res.status(400).json({ success: false, error: 'Treatment name required' });
    }
    if (treatments.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'A treatment with this name already exists' });
    }
    const newTreatment: TreatmentInfo = {
      id: `treat-${Date.now()}`,
      name: cleanName,
      category: body.category || 'General Surgery',
      averageBangaloreMinCost: body.averageBangaloreMinCost || 50000,
      averageBangaloreMaxCost: body.averageBangaloreMaxCost || 120000,
      recoveryDays: body.recoveryDays || '1–2 weeks',
      typicalStay: body.typicalStay || '1–2 days',
      description: body.description || '',
      commonProcedures: body.commonProcedures || [cleanName],
      isActive: body.isActive ?? true,
    };
    treatments.push(newTreatment);
    const { error } = await supabase.from('treatments').upsert([toTreatmentRow(newTreatment)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase POST treatment warning:', error.message);
    }
    res.status(201).json({ success: true, data: newTreatment });
  });

  // Treatments: PUT & DELETE (Admin update/remove treatment options)
  app.put('/api/treatments/:id', async (req, res) => {
    treatments = await loadTableWithSeedFallback('treatments', treatments, fromTreatmentRow, toTreatmentRow, 'name', true);
    const idx = treatments.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Treatment not found' });
    }
    const cleanName = typeof req.body.name === 'string' ? req.body.name.trim() : treatments[idx].name;
    if (!cleanName) {
      return res.status(400).json({ success: false, error: 'Treatment name is required' });
    }
    const dup = treatments.some((t, i) => i !== idx && t.name.toLowerCase() === cleanName.toLowerCase());
    if (dup) {
      return res.status(400).json({ success: false, error: 'A treatment with this name already exists' });
    }
    treatments[idx] = { ...treatments[idx], ...req.body, name: cleanName, id: req.params.id };
    const { error } = await supabase.from('treatments').upsert([toTreatmentRow(treatments[idx])], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase PUT treatment warning:', error.message);
    }
    res.json({ success: true, data: treatments[idx] });
  });

  app.delete('/api/treatments/:id', async (req, res) => {
    const idx = treatments.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Treatment not found' });
    }
    const deleted = treatments.splice(idx, 1);
    const { error } = await supabase.from('treatments').delete().eq('id', req.params.id);
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase DELETE treatment warning:', error.message);
    }
    res.json({ success: true, data: deleted[0] });
  });

  // Helper: Map 7-stage Acquire Surgery CRM status to Supabase valid_status check constraint
  function toSupabaseLeadStatus(crmStatus: string): string {
    switch (crmStatus) {
      case 'New Enquiry':
      case 'New Leads':
        return 'New Leads';
      case 'Contacted':
      case 'RNR':
        return 'RNR';
      case 'Requirements Under Review':
      case 'Options Shared':
      case 'Consultation Scheduled':
      case 'Followup':
        return 'Followup';
      case 'Converted':
        return 'Converted';
      case 'Not Interested':
      case 'Junk':
        return 'Junk';
      default:
        return 'New Leads';
    }
  }

  function fromSupabaseLeadStatus(dbStatus: string, metaCrmStatus?: string): LeadStatus {
    if (metaCrmStatus) return metaCrmStatus as LeadStatus;
    switch (dbStatus) {
      case 'New Leads':
        return 'New Enquiry';
      case 'RNR':
        return 'Contacted';
      case 'Followup':
        return 'Requirements Under Review';
      case 'Converted':
        return 'Converted';
      case 'Junk':
        return 'Not Interested';
      default:
        return 'New Enquiry';
    }
  }

  function parseSupabaseLeadRow(row: any): Lead {
    const rawNotes: string[] = Array.isArray(row.notes) ? row.notes : [];
    let meta: Record<string, any> = {};
    const visibleNotes: string[] = [];

    for (const entry of rawNotes) {
      if (typeof entry === 'string' && entry.startsWith('__LEAD_META__:')) {
        try {
          meta = JSON.parse(entry.slice('__LEAD_META__:'.length));
        } catch {
          // ignore malformed meta
        }
      } else if (typeof entry === 'string') {
        visibleNotes.push(entry);
      }
    }

    let resolvedBudget = row.budget || meta.budget || 'Not Specified';
    if ((!row.budget && !meta.budget) && visibleNotes[0]) {
      const budgetMatch = visibleNotes[0].match(/Budget:\s*([^,|)]+)/i);
      if (budgetMatch) resolvedBudget = budgetMatch[1].trim();
    }

    const resolvedCondition = row.condition || meta.condition || row.treatment || 'Other / Not Sure';
    const resolvedMatchedIds: string[] = Array.isArray(row.matched_hospital_ids)
      ? row.matched_hospital_ids
      : Array.isArray(meta.matchedHospitalIds)
        ? meta.matchedHospitalIds
        : [];

    return {
      id: String(row.id),
      leadCode: row.lead_code || meta.leadCode || `AS-${String(row.id).slice(0, 6).toUpperCase()}`,
      name: row.name || 'Patient',
      mobile: row.phone || row.mobile || '',
      treatment: row.treatment || resolvedCondition,
      condition: resolvedCondition,
      suggestedTreatmentPlan: row.suggested_treatment_plan ?? meta.suggestedTreatmentPlan ?? '',
      insuranceStatus: row.insurance_status || meta.insuranceStatus || 'Not Sure',
      insuranceCompany: row.insurance_company ?? meta.insuranceCompany ?? '',
      expectedSurgeryDate: row.expected_surgery_date || meta.expectedSurgeryDate || '',
      budget: resolvedBudget,
      budgetNumeric: row.budget_numeric ? Number(row.budget_numeric) : parseBudgetNumeric(resolvedBudget),
      city: row.city || 'India',
      createdAt: row.created_at || meta.createdAt || new Date().toISOString(),
      matchedHospitalIds: resolvedMatchedIds,
      matchedHospitalCount: Number(row.matched_hospital_count ?? meta.matchedHospitalCount ?? resolvedMatchedIds.length),
      preferredHospitalId: row.preferred_hospital_id ?? meta.preferredHospitalId,
      status: fromSupabaseLeadStatus(row.status, row.crm_status || meta.crmStatus),
      assignedRep: row.assigned_rep || meta.assignedRep || 'Unassigned',
      notes: visibleNotes,
      followUpDate: row.follow_up_date || meta.followUpDate || '',
      source: row.source || meta.sourceCampaign || meta.source || 'Acquire Surgery Landing Page',
      utmSource: row.utm_source ?? meta.utmSource,
      utmMedium: row.utm_medium ?? meta.utmMedium,
      utmCampaign: row.utm_campaign ?? meta.utmCampaign,
      utmTerm: row.utm_term ?? meta.utmTerm,
      utmContent: row.utm_content ?? meta.utmContent,
      landingPageUrl: row.landing_page_url ?? meta.landingPageUrl,
      whatsappConsent: row.whatsapp_consent ?? meta.whatsappConsent ?? true,
      whatsappAckSent: row.whatsapp_ack_sent ?? meta.whatsappAckSent ?? false,
      teamNotified: row.team_notified ?? meta.teamNotified ?? true,
    };
  }

  function serializeMetaEntry(meta: Record<string, any>): string {
    return `__LEAD_META__:${JSON.stringify(meta)}`;
  }

  // Leads: GET (Admin view leads)
  app.get('/api/leads', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const parsed = data.map(parseSupabaseLeadRow);
        return res.json({ success: true, count: parsed.length, data: parsed });
      }
      if (error) {
        console.warn('Supabase GET leads fallback:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase GET leads exception:', err?.message);
    }

    const sorted = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: sorted.length, data: sorted });
  });

  // Leads: POST (Create surgical enquiry lead)
  app.post('/api/leads', async (req, res) => {
    try {
      const {
        name,
        mobile,
        condition,
        treatment,
        suggestedTreatmentPlan = '',
        insuranceStatus = 'Not Sure',
        insuranceCompany = '',
        expectedSurgeryDate = '',
        budget = 'Not Sure – Help Me Decide',
        city = 'India',
        whatsappConsent = true,
        attribution = {},
        preferredHospitalId,
        source,
      } = req.body;

      const cleanName = typeof name === 'string' ? name.trim() : '';
      const cleanDigits = typeof mobile === 'string' ? mobile.replace(/\D/g, '').slice(-10) : '';
      const cleanCondition = (condition || treatment || '').trim();

      if (!cleanName || cleanDigits.length !== 10 || !cleanCondition) {
        return res.status(400).json({
          success: false,
          error: 'Please enter patient name, a valid 10-digit Indian mobile number, and condition.',
        });
      }

      const formattedMobile = `+91 ${cleanDigits}`;
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const rand = Math.floor(1000 + Math.random() * 9000);
      const leadCode = `AS-${yy}${mm}${dd}-${rand}`;
      const maxBudget = parseBudgetNumeric(budget);

      // Optional hospital matching for backward compatibility
      let matching = hospitals.filter(h =>
        h.treatmentEstimates.some(t => t.treatmentName.toLowerCase().includes(cleanCondition.toLowerCase())) ||
        h.specialties.some(s => s.toLowerCase().includes(cleanCondition.toLowerCase()))
      );
      if (matching.length === 0) matching = hospitals.slice(0, 3);

      const sourceCampaign =
        attribution?.sourceCampaign ||
        source ||
        ([attribution?.utmSource, attribution?.utmMedium, attribution?.utmCampaign].filter(Boolean).join(' / ') || 'Acquire Surgery Landing Page');

      const metaObj = {
        leadCode,
        condition: cleanCondition,
        suggestedTreatmentPlan: typeof suggestedTreatmentPlan === 'string' ? suggestedTreatmentPlan.trim() : '',
        insuranceStatus,
        insuranceCompany: insuranceStatus === 'Yes' ? (insuranceCompany || '').trim() : '',
        expectedSurgeryDate: expectedSurgeryDate || '',
        budget,
        crmStatus: 'New Enquiry',
        assignedRep: 'Unassigned',
        followUpDate: '',
        sourceCampaign,
        utmSource: attribution?.utmSource || '',
        utmMedium: attribution?.utmMedium || '',
        utmCampaign: attribution?.utmCampaign || '',
        utmTerm: attribution?.utmTerm || '',
        utmContent: attribution?.utmContent || '',
        fbclid: attribution?.fbclid || '',
        gclid: attribution?.gclid || '',
        landingPageUrl: attribution?.landingPageUrl || '',
        referrer: attribution?.referrer || '',
        whatsappConsent: Boolean(whatsappConsent),
        whatsappAckSent: Boolean(whatsappConsent),
        teamNotified: true,
        matchedHospitalIds: matching.map(h => h.id),
        matchedHospitalCount: matching.length,
        createdAt: now.toISOString(),
      };

      const summaryNote = `Enquiry [${leadCode}] — Condition: ${cleanCondition} | Budget: ${budget} | Insurance: ${insuranceStatus}${metaObj.insuranceCompany ? ` (${metaObj.insuranceCompany})` : ''}${expectedSurgeryDate ? ` | Expected Date: ${expectedSurgeryDate}` : ''} | Source: ${sourceCampaign}`;
      const notesPayload = [serializeMetaEntry(metaObj), summaryNote];

      // 1. Try persisting full structured payload to Supabase; fallback cleanly to legacy columns if SQL hasn't been executed yet
      let savedLead: Lead | null = null;
      const legacyPayload = {
        name: cleanName,
        phone: formattedMobile,
        email: `${leadCode.toLowerCase()}@acquirepatient.in`,
        treatment: cleanCondition,
        city,
        status: 'New Leads',
        notes: notesPayload,
      };
      const fullStructuredPayload = {
        ...legacyPayload,
        lead_code: leadCode,
        condition: cleanCondition,
        suggested_treatment_plan: metaObj.suggestedTreatmentPlan || null,
        insurance_status: insuranceStatus || 'Not Sure',
        insurance_company: metaObj.insuranceCompany || null,
        expected_surgery_date: sanitizePgDate(expectedSurgeryDate),
        budget,
        budget_numeric: maxBudget,
        crm_status: 'New Enquiry',
        assigned_rep: 'Unassigned',
        matched_hospital_ids: metaObj.matchedHospitalIds,
        matched_hospital_count: metaObj.matchedHospitalCount,
        preferred_hospital_id: preferredHospitalId || null,
        source: sourceCampaign,
        utm_source: metaObj.utmSource || null,
        utm_medium: metaObj.utmMedium || null,
        utm_campaign: metaObj.utmCampaign || null,
        utm_term: metaObj.utmTerm || null,
        utm_content: metaObj.utmContent || null,
        fbclid: metaObj.fbclid || null,
        gclid: metaObj.gclid || null,
        landing_page_url: metaObj.landingPageUrl || null,
        referrer: metaObj.referrer || null,
        whatsapp_consent: metaObj.whatsappConsent,
        whatsapp_ack_sent: metaObj.whatsappAckSent,
        team_notified: true,
      };

      let { data: supaRow, error: supaError } = await supabase
        .from('leads')
        .insert([fullStructuredPayload])
        .select()
        .single();

      if (supaError && isMissingColumnError(supaError)) {
        const retry = await supabase
          .from('leads')
          .insert([legacyPayload])
          .select()
          .single();
        supaRow = retry.data;
        supaError = retry.error;
      }

      if (!supaError && supaRow) {
        savedLead = parseSupabaseLeadRow(supaRow);
      } else {
        console.warn('Supabase POST lead fallback:', supaError?.message);
        savedLead = {
          id: `lead-${Date.now()}`,
          leadCode,
          name: cleanName,
          mobile: formattedMobile,
          treatment: cleanCondition,
          condition: cleanCondition,
          suggestedTreatmentPlan: metaObj.suggestedTreatmentPlan,
          insuranceStatus,
          insuranceCompany: metaObj.insuranceCompany,
          expectedSurgeryDate,
          budget,
          budgetNumeric: maxBudget,
          city,
          createdAt: now.toISOString(),
          matchedHospitalIds: metaObj.matchedHospitalIds,
          matchedHospitalCount: metaObj.matchedHospitalCount,
          status: 'New Enquiry',
          assignedRep: 'Unassigned',
          notes: [summaryNote],
          preferredHospitalId,
          source: sourceCampaign,
          utmSource: metaObj.utmSource,
          utmMedium: metaObj.utmMedium,
          utmCampaign: metaObj.utmCampaign,
          landingPageUrl: metaObj.landingPageUrl,
          whatsappConsent: metaObj.whatsappConsent,
          whatsappAckSent: metaObj.whatsappAckSent,
          teamNotified: true,
        };
        leads.unshift(savedLead);
      }

      // 2. Immediate Acquire Surgery Team Notification & WhatsApp/SMS Webhook Hook
      console.log(`[NEW LEAD ALERT] ${leadCode} | ${cleanCondition} | ${budget} | Source: ${sourceCampaign}`);
      if (process.env.TEAM_NOTIFY_WEBHOOK_URL) {
        fetch(process.env.TEAM_NOTIFY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_surgical_enquiry',
            leadCode,
            condition: cleanCondition,
            budget,
            insuranceStatus,
            sourceCampaign,
            createdAt: now.toISOString(),
          }),
        }).catch(() => {});
      }
      if (whatsappConsent && process.env.WHATSAPP_WEBHOOK_URL) {
        fetch(process.env.WHATSAPP_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedMobile,
            leadCode,
            patientName: cleanName,
            message: `Thank you for choosing Acquire Surgery (Ref: ${leadCode}). Your requirements have been received. Our team will connect with you to help explore suitable surgical options.`,
          }),
        }).catch(() => {});
      }

      res.status(201).json({
        success: true,
        data: savedLead,
        matchingCount: matching.length,
      });
    } catch (err: any) {
      console.error('Error creating lead:', err?.message || err);
      res.status(500).json({ success: false, error: 'Failed to save your enquiry. Please try again.' });
    }
  });

  // Leads: PATCH (Update lead status, assignedRep, followUpDate, internal remarks)
  app.patch('/api/leads/:id', async (req, res) => {
    const { status, assignedRep, followUpDate, note, authorName } = req.body;
    const id = req.params.id;

    try {
      const { data: existingRow, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (!fetchError && existingRow) {
        const rawNotes: string[] = Array.isArray(existingRow.notes) ? existingRow.notes : [];
        let meta: Record<string, any> = {};
        const visibleNotes: string[] = [];

        for (const entry of rawNotes) {
          if (typeof entry === 'string' && entry.startsWith('__LEAD_META__:')) {
            try {
              meta = JSON.parse(entry.slice('__LEAD_META__:'.length));
            } catch {
              // ignore
            }
          } else if (typeof entry === 'string') {
            visibleNotes.push(entry);
          }
        }

        if (status) meta.crmStatus = status;
        if (assignedRep !== undefined) meta.assignedRep = assignedRep;
        if (followUpDate !== undefined) meta.followUpDate = followUpDate;

        if (note && typeof note === 'string' && note.trim()) {
          const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
          const author = authorName || 'Admin';
          visibleNotes.push(`[${timestamp} by ${author}] ${note.trim()}`);
        }

        const legacyUpdatePayload: Record<string, any> = {
          notes: [serializeMetaEntry(meta), ...visibleNotes],
        };
        if (status) {
          legacyUpdatePayload.status = toSupabaseLeadStatus(status);
        }
        if (followUpDate !== undefined) {
          legacyUpdatePayload.follow_up_date = sanitizePgDate(followUpDate);
        }

        const fullUpdatePayload: Record<string, any> = {
          ...legacyUpdatePayload,
        };
        if (status) fullUpdatePayload.crm_status = status;
        if (assignedRep !== undefined) fullUpdatePayload.assigned_rep = assignedRep;

        let { data: updatedRow, error: updateError } = await supabase
          .from('leads')
          .update(fullUpdatePayload)
          .eq('id', id)
          .select()
          .single();

        if (updateError && isMissingColumnError(updateError)) {
          const retry = await supabase
            .from('leads')
            .update(legacyUpdatePayload)
            .eq('id', id)
            .select()
            .single();
          updatedRow = retry.data;
          updateError = retry.error;
        }

        if (!updateError && updatedRow) {
          return res.json({ success: true, data: parseSupabaseLeadRow(updatedRow) });
        }
        if (updateError) {
          console.warn('Supabase PATCH lead error:', updateError.message);
        }
      }
    } catch (err: any) {
      console.warn('Supabase PATCH lead exception:', err?.message);
    }

    // Fallback in-memory
    const lead = leads.find(l => l.id === id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    if (status) lead.status = status;
    if (assignedRep !== undefined) lead.assignedRep = assignedRep;
    if (followUpDate !== undefined) lead.followUpDate = followUpDate;
    if (note) {
      if (!lead.notes) lead.notes = [];
      const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
      const author = authorName || 'Admin';
      lead.notes.push(`[${timestamp} by ${author}] ${note}`);
    }
    res.json({ success: true, data: lead });
  });

  // =================== PATIENT SCHEDULING ===================
  app.get('/api/schedules', async (req, res) => {
    schedules = await loadTableWithSeedFallback('patient_schedules', schedules, fromScheduleRow, toScheduleRow, 'created_at', false);
    const hospitalId = req.query.hospitalId as string;
    let list = [...schedules];
    if (hospitalId) {
      list = list.filter(s => s.hospitalId === hospitalId);
    }
    res.json({ success: true, data: list });
  });

  app.post('/api/schedules', async (req, res) => {
    schedules = await loadTableWithSeedFallback('patient_schedules', schedules, fromScheduleRow, toScheduleRow, 'created_at', false);
    const body = req.body;
    if (!body.patientName || !body.mobile || !body.hospitalId || !body.surgeryName) {
      return res.status(400).json({ success: false, error: 'Patient name, mobile, hospital, and surgery are required' });
    }
    const hosp = hospitals.find(h => h.id === body.hospitalId);
    const newSchedule: PatientSchedule = {
      id: `sched-${Date.now()}`,
      patientName: body.patientName,
      mobile: body.mobile,
      hospitalId: body.hospitalId,
      hospitalName: body.hospitalName || hosp?.name || 'Selected Hospital',
      surgeryName: body.surgeryName,
      minCost: body.minCost,
      maxCost: body.maxCost,
      budget: body.budget || '₹1 – ₹2 Lakh',
      source: body.source || 'Acquire OPD',
      referralDetails: body.referralDetails,
      appointmentDate: body.appointmentDate || new Date().toISOString().split('T')[0],
      preferredTime: body.preferredTime || '10:00 AM',
      status: body.status || 'Scheduled',
      createdAt: new Date().toISOString(),
      notes: body.notes || [
        {
          id: `note-${Date.now()}`,
          text: body.initialNote || 'Scheduled via Acquire OPD Platform',
          authorName: body.authorName || 'Platform Coordinator',
          createdAt: new Date().toISOString(),
        }
      ],
    };
    schedules.unshift(newSchedule);
    const { error } = await supabase.from('patient_schedules').upsert([toScheduleRow(newSchedule)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase POST schedule warning:', error.message);
    }
    res.status(201).json({ success: true, data: newSchedule });
  });

  app.patch('/api/schedules/:id', async (req, res) => {
    schedules = await loadTableWithSeedFallback('patient_schedules', schedules, fromScheduleRow, toScheduleRow, 'created_at', false);
    const schedule = schedules.find(s => s.id === req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule record not found' });
    }
    const { status, appointmentDate, preferredTime, note, authorName, ...rest } = req.body;
    if (status) schedule.status = status;
    if (appointmentDate) schedule.appointmentDate = appointmentDate;
    if (preferredTime) schedule.preferredTime = preferredTime;
    Object.assign(schedule, rest);
    if (note) {
      if (!schedule.notes) schedule.notes = [];
      schedule.notes.push({
        id: `snote-${Date.now()}`,
        text: note,
        authorName: authorName || 'Staff',
        createdAt: new Date().toISOString(),
      });
    }
    const { error } = await supabase.from('patient_schedules').upsert([toScheduleRow(schedule)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase PATCH schedule warning:', error.message);
    }
    res.json({ success: true, data: schedule });
  });

  app.delete('/api/schedules/:id', async (req, res) => {
    const idx = schedules.findIndex(s => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Schedule record not found' });
    }
    const deleted = schedules.splice(idx, 1);
    const { error } = await supabase.from('patient_schedules').delete().eq('id', req.params.id);
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase DELETE schedule warning:', error.message);
    }
    res.json({ success: true, data: deleted[0] });
  });

  // =================== HOSPITAL ACCESS MANAGEMENT ===================
  app.get('/api/hospital-accounts', async (req, res) => {
    hospitalAccounts = await loadTableWithSeedFallback('hospital_accounts', hospitalAccounts, fromHospitalAccountRow, toHospitalAccountRow, 'created_at', false);
    res.json({ success: true, data: hospitalAccounts });
  });

  app.post('/api/hospital-accounts', async (req, res) => {
    hospitalAccounts = await loadTableWithSeedFallback('hospital_accounts', hospitalAccounts, fromHospitalAccountRow, toHospitalAccountRow, 'created_at', false);
    const { hospitalId, hospitalName, email, mobile, username, password, accountStatus } = req.body;
    if (!hospitalName || !email || !mobile || !username) {
      return res.status(400).json({ success: false, error: 'Hospital Name, Email, Mobile, and Username are required' });
    }
    if (hospitalAccounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Username is already in use by another hospital account' });
    }

    let matchedHosp = hospitals.find(h => h.id === hospitalId || h.name.toLowerCase() === hospitalName.toLowerCase());
    let targetHospitalId = hospitalId;
    if (!matchedHosp) {
      targetHospitalId = `hosp-${Date.now()}`;
      matchedHosp = {
        id: targetHospitalId,
        name: hospitalName,
        category: 'Standard Hospital',
        location: 'Bangalore',
        city: 'Bangalore',
        rating: 4.5,
        reviewCount: 20,
        establishedYear: 2018,
        bedCount: 100,
        specialties: ['General Surgery'],
        facilities: ['NABH Accredited', '24x7 Emergency'],
        accreditations: ['NABH'],
        description: `Verified hospital partner ${hospitalName}.`,
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
        phone: mobile,
        address: 'Bangalore, Karnataka',
        insuranceCashless: ['Star Health', 'Medi Assist'],
        treatmentEstimates: [],
        email,
        mobile,
      };
      hospitals.unshift(matchedHosp);
      const { error: hErr } = await supabase.from('hospitals').upsert([toHospitalRow(matchedHosp)], { onConflict: 'id' });
      if (hErr && !isMissingTableError(hErr)) {
        console.warn('Supabase auto-create hospital warning:', hErr.message);
      }
    }

    const plainPassword = password || generateRandomTempPassword();
    const newAccount: HospitalAccount = {
      id: `acc-${Date.now()}`,
      hospitalId: matchedHosp.id,
      hospitalName: matchedHosp.name,
      email,
      mobile,
      username,
      passwordHash: hashPassword(plainPassword),
      accountStatus: accountStatus || 'Active',
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };

    hospitalAccounts.unshift(newAccount);
    const { error } = await supabase.from('hospital_accounts').upsert([toHospitalAccountRow(newAccount)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase POST hospital_account warning:', error.message);
    }
    res.status(201).json({ 
      success: true, 
      data: newAccount, 
      tempPassword: plainPassword 
    });
  });

  app.patch('/api/hospital-accounts/:id', async (req, res) => {
    hospitalAccounts = await loadTableWithSeedFallback('hospital_accounts', hospitalAccounts, fromHospitalAccountRow, toHospitalAccountRow, 'created_at', false);
    const acc = hospitalAccounts.find(a => a.id === req.params.id);
    if (!acc) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const { accountStatus, email, mobile, hospitalName } = req.body;
    if (accountStatus) acc.accountStatus = accountStatus;
    if (email) acc.email = email;
    if (mobile) acc.mobile = mobile;
    if (hospitalName) acc.hospitalName = hospitalName;
    const { error } = await supabase.from('hospital_accounts').upsert([toHospitalAccountRow(acc)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase PATCH hospital_account warning:', error.message);
    }
    res.json({ success: true, data: acc });
  });

  app.post('/api/hospital-accounts/:id/reset-password', async (req, res) => {
    hospitalAccounts = await loadTableWithSeedFallback('hospital_accounts', hospitalAccounts, fromHospitalAccountRow, toHospitalAccountRow, 'created_at', false);
    const acc = hospitalAccounts.find(a => a.id === req.params.id);
    if (!acc) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const newPlainPassword = req.body.password || generateRandomTempPassword();
    acc.passwordHash = hashPassword(newPlainPassword);
    acc.mustChangePassword = true;
    const { error } = await supabase.from('hospital_accounts').upsert([toHospitalAccountRow(acc)], { onConflict: 'id' });
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase reset password warning:', error.message);
    }
    res.json({ 
      success: true, 
      message: 'Password reset successfully', 
      tempPassword: newPlainPassword 
    });
  });

  app.delete('/api/hospital-accounts/:id', async (req, res) => {
    const idx = hospitalAccounts.findIndex(a => a.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const deleted = hospitalAccounts.splice(idx, 1);
    const { error } = await supabase.from('hospital_accounts').delete().eq('id', req.params.id);
    if (error && !isMissingTableError(error)) {
      console.warn('Supabase DELETE hospital_account warning:', error.message);
    }
    res.json({ success: true, data: deleted[0] });
  });

  // Stats: GET
  app.get('/api/stats', async (req, res) => {
    let activeLeads = leads;
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (!error && Array.isArray(data)) {
        activeLeads = data.map(parseSupabaseLeadRow);
      }
    } catch {
      // use in-memory fallback
    }
    res.json({
      success: true,
      totalHospitals: hospitals.length,
      totalTreatments: treatments.length,
      totalLeads: activeLeads.length,
      newLeads: activeLeads.filter(l => l.status === 'New Leads' || l.status === 'New Enquiry').length,
      inProgressLeads: activeLeads.filter(l =>
        l.status === 'RNR' ||
        l.status === 'Followup' ||
        l.status === 'Contacted' ||
        l.status === 'Requirements Under Review' ||
        l.status === 'Options Shared' ||
        l.status === 'Consultation Scheduled'
      ).length,
      closedLeads: activeLeads.filter(l => l.status === 'Converted' || l.status === 'Junk' || l.status === 'Not Interested').length,
    });
  });

  // =================== VITE MIDDLEWARE ===================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Right Hospital server listening on port ${PORT}`);
  });
}

startServer();
