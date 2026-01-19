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
  console.log('🔧 Creating Supabase client...');
  console.log('🔧 Supabase URL:', supabaseUrl);
  console.log('🔧 Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
  console.log('🔧 Supabase Key length:', supabaseAnonKey.length);
  
  // Validate API key format (anon key is usually 100+ characters)
  if (supabaseAnonKey.length < 100) {
    console.warn('⚠️ Warning: Supabase API key seems too short! Expected 100+ characters, got:', supabaseAnonKey.length);
    console.warn('⚠️ This might cause authentication issues. Please check your VITE_SUPABASE_ANON_KEY in Vercel.');
  } else {
    console.log('✅ API key length is valid:', supabaseAnonKey.length, 'characters');
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  
  console.log('✅ Supabase client created with API key headers');
  
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
  
  // Test database connection and verify API key headers
  supabase.from('transactions').select('id').limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('⚠️ Supabase database connection error:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error);
        if (error.code === '42501') {
          console.error('⚠️ Permission denied - check RLS policies');
        } else if (error.message.includes('API key')) {
          console.error('⚠️ API key issue - check VITE_SUPABASE_ANON_KEY in Vercel');
        }
      } else {
        console.log('✅ Supabase database connection successful');
        console.log('✅ API key headers are working correctly');
      }
    });
  
  // Test user_profiles table (if exists)
  supabase.from('user_profiles').select('id').limit(1)
    .then(({ error }) => {
      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          console.log('ℹ️ user_profiles table not found - this is OK, will use fallback');
        } else {
          console.warn('⚠️ user_profiles table access issue:', error.message);
        }
      } else {
        console.log('✅ user_profiles table is accessible');
      }
    });
  
  // Test expense_categories table (if exists) - using public schema explicitly
  console.log('🔧 Testing expense_categories table access (public schema)...');
  (async () => {
    const { data, error } = await supabase.from('expense_categories').select('id').limit(1);
    
    if (error) {
      // Handle 404 specifically - table doesn't exist
      if ((error as any).status === 404 || error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('does not exist')) {
        console.error('❌ expense_categories table not found (404) - Please run database-setup.sql or fix-expense-categories.sql');
        console.error('🔧 Quick fix: Copy fix-expense-categories.sql and run in Supabase Dashboard → SQL Editor');
      } else if (error.code === '400' || (error as any).status === 400 || error.message?.includes('400') || error.message?.includes('Bad Request')) {
        console.warn('⚠️ expense_categories table - 400 Bad Request (will use localStorage fallback):', error.message);
        console.warn('⚠️ Error details:', error.details);
        console.warn('⚠️ Error hint:', (error as any).hint);
      } else {
        console.warn('⚠️ expense_categories table access issue:', error.message);
        console.warn('⚠️ Error code:', error.code);
        console.warn('⚠️ Error status:', (error as any).status);
      }
    } else {
      console.log('✅ expense_categories table is accessible (public schema)');
      console.log('✅ Test query returned:', data?.length || 0, 'rows');
    }
  })();
}

export { supabase };
