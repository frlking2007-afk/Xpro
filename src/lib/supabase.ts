import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.error('⚠️ Supabase environment variables are missing or invalid!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel environment variables.');
  
  // Create a dummy client to prevent app crash
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  
  // Test connection and authentication
  supabase.auth.getSession()
    .then(({ data: { session }, error: authError }) => {
      if (authError) {
        console.error('⚠️ Supabase auth error:', authError.message);
      } else if (session) {
        console.log('✅ Supabase session active for user:', session.user.email);
      } else {
        console.log('ℹ️ No active Supabase session');
      }
    })
    .catch((err) => {
      console.error('⚠️ Supabase session check failed:', err);
    });
  
  // Test database connection
  supabase.from('transactions').select('id').limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('⚠️ Supabase database connection error:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error);
        if (error.code === '42501') {
          console.error('⚠️ Permission denied - check RLS policies');
        }
      } else {
        console.log('✅ Supabase database connection successful');
      }
    })
    .catch((err) => {
      console.error('⚠️ Supabase connection test failed:', err);
    });
}

export { supabase };
