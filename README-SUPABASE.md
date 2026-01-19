# 🚀 Supabase + React Integration Guide

## 📋 Quick Start Checklist

### 1. Environment Setup
```bash
# Copy .env.example to .env
cp .env.example .env

# For React + Vite:
VITE_SUPABASE_URL=https://mdqgvtrysmeulcmjgvvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU
```

### 2. Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `mdqgvtrysmeulcmjgvvr`
3. Open SQL Editor
4. Run `database-setup.sql` script

### 3. Authentication Configuration
In Supabase Dashboard → Authentication → Settings:
- Site URL: `http://localhost:5173` (development)
- Redirect URLs: `http://localhost:5173/auth/callback`
- Enable email confirmation

## 🗂️ File Structure

```
src/
├── lib/
│   ├── supabase-client.ts     # Client-side Supabase instance
│   └── supabase-admin.ts      # Server-side admin instance
├── hooks/
│   └── useSupabaseAuth.ts     # Authentication hook
├── components/
│   ├── Auth.tsx               # Login/Signup component
│   └── Profile.tsx            # User profile management
└── types/
    └── database.ts            # TypeScript types
```

## 🔐 Authentication Usage

```typescript
import { useSupabaseAuth } from './hooks/useSupabaseAuth'

function MyComponent() {
  const { user, signIn, signOut, loading } = useSupabaseAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <button onClick={() => signIn('email@example.com', 'password')}>
        Sign In
      </button>
    )
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## 📊 Database Operations

```typescript
// Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

// Update profile
const { data } = await supabase
  .from('profiles')
  .update({ username: 'new_username' })
  .eq('id', user.id)
  .select()
```

## 🖼️ File Upload

```typescript
// Upload avatar
const file = event.target.files[0]
const fileName = `${user.id}/avatar.jpg`

const { error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file, { upsert: true })

if (!error) {
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  // Update profile with new avatar URL
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)
}
```

## 🚀 Deployment

### Vercel Environment Variables:
```
VITE_SUPABASE_URL=https://mdqgvtrysmeulcmjgvvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Update URLs for Production:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

## 🔧 Common Issues

### 1. "No API key found" error
- Check environment variables are set
- Ensure `VITE_` prefix for React + Vite
- Restart development server

### 2. RLS policy violations
- Run database setup script
- Check user is authenticated
- Verify `auth.uid()` matches user ID

### 3. CORS errors
- Add your domain to Supabase Authentication → URL Configuration
- Include both development and production URLs

## 🧪 Testing

```typescript
// Test database connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .single()
  
  console.log('Connection test:', { data, error })
}
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React + Supabase Guide](https://supabase.com/docs/guides/auth/auth-helpers/react)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
