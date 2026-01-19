# Supabase API Key 404 Xatolik Yechimi

## 🚨 Muammo Tahlili
Xato: `{"message":"No API key found in request","hint":"No apikey request header or url param was found."}`

Sabab: API key request headers da yo'q yoki noto'g'ri formatda

## 1. Environment Variables Tekshiruvi

### ✅ To'g'ri format (Vite):
```bash
# .env fayli (local)
VITE_SUPABASE_URL=https://mdqgvtrysmeulcmjgvvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU
```

### ✅ Vercel Environment Variables:
```
Project Settings → Environment Variables
Name: VITE_SUPABASE_URL
Value: https://mdqgvtrysmeulcmjgvvr.supabase.co
Environment: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU
Environment: Production, Preview, Development
```

## 2. createClient To'g'ri Ishlatish

### ✅ To'g'ri supabase-js client:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mdqgvtrysmeulcmjgvvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  },
})
```

### ❌ Xato client (headers qo'shmagan):
```typescript
// BU XATO - headers qo'shilmagan
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 3. To'g'ridan-to'g'ri REST API So'rovi

### ✅ To'g'ri fetch:
```javascript
const fetchTransactions = async () => {
  const supabaseUrl = 'https://mdqgvtrysmeulcmjgvvr.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU'

  const response = await fetch(`${supabaseUrl}/rest/v1/transactions?select=*`, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
```

### ✅ curl misoli:
```bash
curl -i \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU" \
  -H "Content-Type: application/json" \
  "https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions?select=*"
```

## 4. Jadval Mavjudligini Tekshirish

### SQL Query (Supabase Dashboard):
```sql
-- Jadval mavjudligini tekshirish
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema='public' AND table_name='transactions';

-- Agar jadval yo'q bo'lsa, yaratish
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('cash', 'click', 'uzcard', 'humo', 'expense')),
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS ni yoqish
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 5. Debug Qadamlari

### Browser Console da tekshirish:
```javascript
// 1. Environment variables
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// 2. Direct API test
fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions?select=id', {
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
})
.then(res => console.log('Status:', res.status))
.catch(err => console.error('Error:', err))
```

### Network Headers tekshirish:
**Request headers da bo'lishi kerak:**
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## 6. Vercel Deploy uchun Qadamlar

1. **Vercel Dashboard → Project Settings → Environment Variables**
2. **Add Environment Variable:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://mdqgvtrysmeulcmjgvvr.supabase.co`
   - Environment: `Production, Preview, Development`
3. **Add Second Variable:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environment: `Production, Preview, Development`
4. **Save**
5. **Redeploy:** Git push yoki Vercel da manual redeploy

## 7. Xavfsizlik Eslatmalari

✅ **TO'G'RI:** Frontend faqat anon key ishlatish  
❌ **XATO:** Frontend da service_role key ishlatish  
✅ **TO'G'RI:** Kalitlarni environment variables da saqlash  
❌ **XATO:** Kalitlarni kodga hardcode qilish  

## 8. Tezkor Yechim

Agar shoshqancha bo'lsangiz, quyidagini qiling:

1. **Local .env faylini tekshiring**
2. **Vercel environment variables ni qo'shing**
3. **Redeploy qiling**
4. **Browser console da debugSupabaseConnection() ni chaqiring**
