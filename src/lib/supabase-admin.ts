// Server-side Supabase Admin Client (Service Role)
// This should ONLY be used in server environments (API routes, Edge Functions)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://mdqgvtrysmeulcmjgvvr.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU2NjYzOSwiZXhwIjoyMDg0MTQyNjM5fQ.GX9q0U1ESUjNofMqKzZInAsDBUJzWAZl--VhZLArtUg'

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Admin functions
export const createAdminUser = async (userData: {
  email: string
  password: string
  user_metadata?: Record<string, any>
}) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: userData.user_metadata,
  })

  if (error) {
    return { data: null, error }
  }

  // Create profile for the user
  if (data.user) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,
        username: userData.user_metadata?.username || userData.email.split('@')[0],
        full_name: userData.user_metadata?.full_name || null,
      })

    if (profileError) {
      return { data: null, error: profileError }
    }
  }

  return { data, error: null }
}

export const deleteUser = async (userId: string) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  return { error }
}

export const getAllUsers = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  return { data, error }
}
