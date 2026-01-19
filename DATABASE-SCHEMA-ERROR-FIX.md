# 🚨 Database Error Querying Schema Yechimi

## Muammo: "Database error querying schema"

Bu xato quyidagi sabablarga ko'ra yuz berishi mumkin:

### 🎯 Asosiy Sabablar:

1. **Environment Variables yo'q yoki noto'g'ri**
2. **Database jadvallari mavjud emas**
3. **RLS (Row Level Security) policies xato**
4. **Supabase project to'xtatilgan yoki limitdan o'tgan**

---

## 🛠️ Tezkor Yechim (5 daqiqada)

### 1-qadam: Environment Variables Tekshirish

**Vercel Dashboard → Project Settings → Environment Variables:**

```
VITE_SUPABASE_URL=https://mdqgvtrysmeulcmjgvvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU
```

**Environment:** Production, Preview, Development (hammasini belgilang)

### 2-qadam: Database Jadvallarini Yaratish

**Supabase Dashboard → SQL Editor** → quyidagini yozing:

```sql
-- Quick fix for all required tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'click', 'uzcard', 'humo', 'expense')),
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nomi TEXT NOT NULL,
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view own profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expense_categories" ON public.expense_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expense_categories" ON public.expense_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expense_categories" ON public.expense_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expense_categories" ON public.expense_categories FOR DELETE USING (auth.uid() = user_id);

COMMIT;
```

### 3-qadam: Supabase Project Holatini Tekshirish

**Supabase Dashboard → Settings → Database:**
- **Status:** Active bo'lishi kerak
- **Region:** To'g'ri tanlangan
- **Connection pooling:** Yoqilgan

### 4-qadam: Browser Console Debug

**Chrome DevTools → Console** da quyidagilarni tekshiring:

```javascript
// Environment variables tekshirish
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Direct API test
fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/rest/v1/profiles?select=id&limit=1', {
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
})
.then(res => console.log('Status:', res.status, res.statusText))
.catch(err => console.error('Error:', err))
```

---

## 🔍 Xatolik Turlari va Yechimlari:

### 1. "Invalid API key"
**Yechim:** Vercel environment variables ni tekshiring

### 2. "Could not find the table"
**Yechim:** SQL skriptni ishga tushiring

### 3. "Permission denied"
**Yechim:** RLS policies ni tekshiring

### 4. "Database connection failed"
**Yechim:** Supabase project statusini tekshiring

---

## 🚀 Oxirgi Variant:

Agar hammasi ishlamasa:

1. **Yangi Supabase project yarating**
2. **Yangi environment variables oling**
3. **Database setup skriptini yangi project da ishga tushiring**

---

## 📞 Agar yordam kerak bo'lsa:

- **Supabase Dashboard:** https://supabase.com/dashboard/project/mdqgvtrysmeulcmjgvvr
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Console log'arni yuboring**
