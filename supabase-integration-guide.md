# Supabase Integration Guide

## 2. Supabase Client Init

### React + Vite (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          username?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
}
```

### Next.js (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
```

## 3. Authentication Operations

### Email/Password Auth
```typescript
// Sign Up
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Sign In
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Magic Link
const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}
```

### Session Management
```typescript
// Get current session
const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Get current user
const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Auth state change listener
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event, session)
      // Handle auth state changes
      if (event === 'SIGNED_IN' && session) {
        // User signed in
      } else if (event === 'SIGNED_OUT') {
        // User signed out
      }
    }
  )

  return () => subscription.unsubscribe()
}, [])
```

## 4. Profile CRUD Operations

### Get User Profile
```typescript
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}
```

### Create/Update Profile (Upsert)
```typescript
const upsertProfile = async (profile: {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}
```

### Storage (Avatar Upload)
```typescript
const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) return { data: null, error }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update profile with new avatar URL
  const { data: profile, error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
    .select()
    .single()

  return { data: profile, error: updateError }
}
```

## 5. Server-Side Operations (Service Role)

### Next.js API Route (pages/api/admin/create-user.ts)
```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, user_metadata } = req.body

    // Create user with service role
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create profile
    if (data.user) {
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          username: user_metadata?.username || email.split('@')[0],
        })
    }

    res.status(200).json({ user: data.user })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### Edge Function (supabase/functions/admin-create-user/index.ts)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY)!
    )

    const { email, password, user_metadata } = await req.json()

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ user: data.user }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## 6. RLS Policies

### Profiles Table
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 7. Common Issues & Solutions

### CORS Issues
```typescript
// Supabase Dashboard → Authentication → URL Configuration
// Add your site URLs:
// - http://localhost:3000 (development)
// - https://yoursite.vercel.app (production)
```

### Environment Variable Issues
```typescript
// Debug environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// In Next.js:
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### Auth State Issues
```typescript
// Always check for null session
const { user } = useAuth()
if (!user) {
  return <div>Please sign in</div>
}
```

## 8. Quick Checklist

- [ ] Environment variables set with correct prefixes
- [ ] Service role key only in server environment
- [ ] RLS policies created and tested
- [ ] Auth redirect URLs configured in Dashboard
- [ ] Storage bucket policies set up
- [ ] CORS settings configured
- [ ] Email templates customized
- [ ] Database schema created
