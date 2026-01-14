import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if env vars are missing (for graceful degradation)
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase environment variables are missing!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  
  // Create a dummy client to prevent app crash
  // This allows the app to load and show error messages
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  // Create Supabase client with proper configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (!error) return 'Noma\'lum xatolik yuz berdi';
  
  // Check for 403 Forbidden error
  if (error.code === 'PGRST301' || error.code === '42501' || error.status === 403 || error.code === '403') {
    return 'Ruxsat yo\'q. Login muddati tugagan bo\'lishi mumkin. Iltimos, qayta kiring.';
  }
  
  // Check for 401 Unauthorized error
  if (error.code === 'PGRST116' || error.status === 401 || error.code === '401') {
    return 'Login muddati tugagan. Iltimos, qayta kiring.';
  }
  
  // Check for network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Internet aloqasi muammosi. Iltimos, internet aloqasini tekshiring.';
  }
  
  // Return the error message if available
  return error.message || 'Ma\'lumotlarni yuklashda xatolik yuz berdi';
}

export { supabase };
