import { createClient } from '@supabase/supabase-js'

// Backend API - Secret key bilan
const supabaseUrl = 'https://mdqgvtrysmeulcmjgvvr.supabase.co'
const supabaseServiceKey = 'sb_secret_DPvxXjm1IM_-rNWBi_yp-w_xFWMvvrA'

// Service role key bilan client yaratish (backend uchun)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default supabaseAdmin
