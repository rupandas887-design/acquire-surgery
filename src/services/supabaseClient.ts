import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://zfifmfzrzxmbwilcsnhx.supabase.co';

const supabaseAnonKey =
  (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWZtZnpyenhtYndpbGNzbmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk1NDEsImV4cCI6MjEwNzUyNTU0MX0.2-7NB9SoCXG-5BnpwBneKevxZQmjf5F3LQaTEiz2Auk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
