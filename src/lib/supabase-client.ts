// React + Vite Supabase Client
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Database types
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
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'cash' | 'click' | 'uzcard' | 'humo' | 'expense'
          summa: number
          tavsif: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          type: 'cash' | 'click' | 'uzcard' | 'humo' | 'expense'
          summa: number
          tavsif?: string | null
        }
        Update: {
          type?: 'cash' | 'click' | 'uzcard' | 'humo' | 'expense'
          summa?: number
          tavsif?: string | null
        }
      }
    }
  }
}
