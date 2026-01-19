# Supabase 404 Debug Qo'llanma

## Muammoni aniqlash uchun test

### 1. Browser Console da tekshirish
```javascript
// Console da quyidagini yozing
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Direct API test
fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions?select=id&limit=1', {
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
})
.then(res => console.log('Response status:', res.status))
.catch(err => console.error('Error:', err))
```

### 2. To'g'ri URL formatlari

#### REST API (ma'lumot olish):
```
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions?select=*
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/transactions?select=id,type,summa&limit=10
```

#### Auth endpointlar:
```
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/auth/v1/user
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/auth/v1/token?grant_type=password
```

#### Storage:
```
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/storage/v1/object/public/[bucket]/[file]
✅ https://mdqgvtrysmeulcmjgvvr.supabase.co/storage/v1/object/sign/[bucket]/[file]
```

#### Realtime:
```
✅ wss://mdqgvtrysmeulcmjgvvr.supabase.co/realtime/v1/websocket
```

### 3. 404 xatolarining umumiy sabablari

#### A. Jadval mavjud emas (eng ko'p uchraydigan)
**Xato:** `Could not find the table 'public.transactions'`
**Yechim:** Jadvalni yaratish

#### B. Noto'g'ri endpoint
**Xato:** `404 Not Found`
**Yechim:** URL ni tekshirish

#### C. API key muammosi
**Xato:** `401 Unauthorized` (404 emas)
**Yechim:** Environment variables ni tekshirish

### 4. Jadval yaratish SQL

```sql
-- Supabase Dashboard → SQL Editor
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

### 5. Network Headers tekshirish

**Request headers da bo'lishi kerak:**
```
apikey: [anon_key]
Authorization: Bearer [anon_key]
Content-Type: application/json
```

**Response headers da qidirish:**
```
Status: 404 Not Found
Content-Type: application/json
```

### 6. Debug qadamlari

1. **Console log'larni tekshir** - supabase client xatolari
2. **Network tab** - qaysi URL 404 berayotganini ko'rish  
3. **Supabase Dashboard** - jadvallar mavjudligini tekshirish
4. **Environment variables** - Vercel da to'g'ri yozilganligini tekshirish
