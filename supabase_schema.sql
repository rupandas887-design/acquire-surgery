-- ============================================================================
-- ACQUIRE SURGERY – COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Run this entire script in the Supabase SQL Editor (Dashboard -> SQL Editor).
-- It is 100% idempotent (safe to run multiple times without losing existing data).
-- ============================================================================

-- Ensure UUID generator is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. LEADS TABLE (Patient Surgical Enquiries, Attribution & CRM Pipeline)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_code TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    treatment TEXT,
    condition TEXT,
    suggested_treatment_plan TEXT,
    insurance_status TEXT DEFAULT 'Not Sure',
    insurance_company TEXT,
    expected_surgery_date DATE,
    budget TEXT,
    budget_numeric BIGINT,
    city TEXT DEFAULT 'India',
    status TEXT DEFAULT 'New Leads',
    crm_status TEXT DEFAULT 'New Enquiry',
    assigned_rep TEXT DEFAULT 'Unassigned',
    follow_up_date DATE,
    matched_hospital_ids JSONB DEFAULT '[]'::jsonb,
    matched_hospital_count INTEGER DEFAULT 0,
    preferred_hospital_id TEXT,
    source TEXT DEFAULT 'Acquire Surgery Landing Page',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    fbclid TEXT,
    gclid TEXT,
    landing_page_url TEXT,
    referrer TEXT,
    whatsapp_consent BOOLEAN DEFAULT true,
    whatsapp_ack_sent BOOLEAN DEFAULT false,
    team_notified BOOLEAN DEFAULT true,
    notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Non-destructively add any missing columns if public.leads already exists
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_code TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS condition TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS suggested_treatment_plan TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS insurance_status TEXT DEFAULT 'Not Sure';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS insurance_company TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS expected_surgery_date DATE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget_numeric BIGINT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS crm_status TEXT DEFAULT 'New Enquiry';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_rep TEXT DEFAULT 'Unassigned';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS matched_hospital_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS matched_hospital_count INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS preferred_hospital_id TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Acquire Surgery Landing Page';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS fbclid TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS gclid TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS landing_page_url TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN DEFAULT true;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp_ack_sent BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS team_notified BOOLEAN DEFAULT true;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Clean constraints allowing both legacy and 7-stage Acquire Surgery CRM statuses
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE public.leads ADD CONSTRAINT valid_status CHECK (
    status IS NULL OR status IN (
        'New Leads', 'RNR', 'Followup', 'Converted', 'Junk',
        'New Enquiry', 'Contacted', 'Requirements Under Review',
        'Options Shared', 'Consultation Scheduled', 'Not Interested'
    )
) NOT VALID;

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS valid_insurance_status;
ALTER TABLE public.leads ADD CONSTRAINT valid_insurance_status CHECK (
    insurance_status IS NULL OR insurance_status IN ('Yes', 'No', 'Not Sure')
) NOT VALID;

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_crm_status ON public.leads(crm_status);
CREATE INDEX IF NOT EXISTS idx_leads_condition ON public.leads(condition);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_date ON public.leads(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_leads_lead_code ON public.leads(lead_code);

-- ----------------------------------------------------------------------------
-- 2. USER ROLES TABLE (Portal Authentication)
-- Supports both lowercase (username/password/role) and capitalized ("Username"/"Password"/"Role")
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'username'
    ) THEN
        IF EXISTS (SELECT 1 FROM public.user_roles WHERE lower(username) = 'admin@acquire.com') THEN
            UPDATE public.user_roles
            SET password = '$2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue',
                role = 'admin'
            WHERE lower(username) = 'admin@acquire.com';
        ELSE
            INSERT INTO public.user_roles (username, password, role)
            VALUES ('Admin@acquire.com', '$2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue', 'admin');
        END IF;
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'Username'
    ) THEN
        IF EXISTS (SELECT 1 FROM public.user_roles WHERE lower("Username") = 'admin@acquire.com') THEN
            UPDATE public.user_roles
            SET "Password" = '$2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue',
                "Role" = 'admin'
            WHERE lower("Username") = 'admin@acquire.com';
        ELSE
            INSERT INTO public.user_roles ("Username", "Password", "Role")
            VALUES ('Admin@acquire.com', '$2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue', 'admin');
        END IF;
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. CATEGORIES TABLE (Hospital Tiers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    color TEXT,
    badge_bg TEXT,
    badge_border TEXT,
    badge_text TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 4. TREATMENTS TABLE (Master Surgical Directory)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.treatments (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'General Surgery',
    average_bangalore_min_cost INTEGER DEFAULT 50000,
    average_bangalore_max_cost INTEGER DEFAULT 120000,
    recovery_days TEXT,
    typical_stay TEXT,
    description TEXT,
    common_procedures JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. HOSPITALS TABLE (Partner Hospital Profiles & Pricing Estimates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Standard Hospital',
    location TEXT NOT NULL DEFAULT 'Bangalore',
    city TEXT DEFAULT 'Bangalore',
    rating NUMERIC(2, 1) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    established_year INTEGER DEFAULT 2015,
    bed_count INTEGER DEFAULT 100,
    specialties JSONB DEFAULT '[]'::jsonb,
    facilities JSONB DEFAULT '[]'::jsonb,
    accreditations JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    image_url TEXT,
    phone TEXT,
    mobile TEXT,
    email TEXT,
    registration_number TEXT,
    address TEXT,
    address_details JSONB,
    operating_hours JSONB DEFAULT '[]'::jsonb,
    insurance_cashless JSONB DEFAULT '[]'::jsonb,
    treatment_estimates JSONB DEFAULT '[]'::jsonb,
    surgeries JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hospitals_city ON public.hospitals(city);
CREATE INDEX IF NOT EXISTS idx_hospitals_category ON public.hospitals(category);

-- ----------------------------------------------------------------------------
-- 6. HOSPITAL ACCOUNTS TABLE (Partner Portal Credentials & Active Status)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hospital_accounts (
    id TEXT PRIMARY KEY,
    hospital_id TEXT,
    hospital_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    account_status TEXT NOT NULL DEFAULT 'Active' CHECK (account_status IN ('Active', 'Inactive')),
    must_change_password BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hospital_accounts_status ON public.hospital_accounts(account_status);
CREATE INDEX IF NOT EXISTS idx_hospital_accounts_hospital_id ON public.hospital_accounts(hospital_id);

-- ----------------------------------------------------------------------------
-- 7. PATIENT SCHEDULES TABLE (Appointments & Hospital Referrals)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patient_schedules (
    id TEXT PRIMARY KEY,
    lead_id TEXT,
    patient_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    hospital_id TEXT,
    hospital_name TEXT NOT NULL,
    surgery_name TEXT NOT NULL,
    min_cost INTEGER,
    max_cost INTEGER,
    budget TEXT,
    source TEXT DEFAULT 'Acquire OPD',
    referral_details TEXT,
    appointment_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (
        status IN ('Scheduled', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled', 'No Show')
    ),
    notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_schedules_hospital_date ON public.patient_schedules(hospital_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON public.patient_schedules(status);

-- ----------------------------------------------------------------------------
-- 8. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_hospitals_updated_at ON public.hospitals;
CREATE TRIGGER trg_hospitals_updated_at
    BEFORE UPDATE ON public.hospitals
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- Note: Server-side routes using SUPABASE_SERVICE_ROLE_KEY bypass RLS safely.
-- These policies ensure public enquiry submission and fallback anon reads work,
-- while keeping user_roles strictly locked to service_role only.
-- ----------------------------------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_schedules ENABLE ROW LEVEL SECURITY;

-- Leads policies (public enquiry submission + service_role / fallback access)
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
CREATE POLICY "leads_insert_public" ON public.leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "leads_select_all" ON public.leads;
CREATE POLICY "leads_select_all" ON public.leads
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "leads_update_all" ON public.leads;
CREATE POLICY "leads_update_all" ON public.leads
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Public directory read access for hospitals, categories, and treatments
DROP POLICY IF EXISTS "hospitals_select_public" ON public.hospitals;
CREATE POLICY "hospitals_select_public" ON public.hospitals
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
CREATE POLICY "categories_select_public" ON public.categories
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "treatments_select_public" ON public.treatments;
CREATE POLICY "treatments_select_public" ON public.treatments
    FOR SELECT TO anon, authenticated
    USING (true);
