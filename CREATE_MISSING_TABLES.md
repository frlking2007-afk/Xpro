# Yo'qolgan Jadvalarni Yaratish Qo'llanmasi

## Muammo
Console'da quyidagi xatoliklar chiqmoqda:
- `expense_categories` jadvali topilmayapti (404 Not Found / PGRST205)
- `user_profiles` jadvali topilmayapti (404 Not Found / PGRST205)

**Sabab:** Bu jadvallar Supabase'da yaratilmagan yoki RLS policies to'g'ri sozlangan emas.

## Yechim

### 1. Supabase Dashboard'ga kiring
- https://supabase.com/dashboard ga kiring
- Loyihangizni tanlang

### 2. SQL Editor'ni oching
- Chap menudan **SQL Editor** ni tanlang
- **New query** tugmasini bosing

### 3. `expense_categories` jadvalini yaratish

**Eng oson usul:** `QUICK_FIX_EXPENSE_CATEGORIES.sql` faylini oching va butun kodini nusxalab, SQL Editor'ga yopishtiring.

Yoki quyidagi SQL kodini nusxalab, SQL Editor'ga yopishtiring va **Run** tugmasini bosing:

```sql
-- Create expense_categories table to store user-specific expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anon and authenticated to read their own categories
CREATE POLICY "Allow anon and authenticated to read own categories"
  ON expense_categories
  FOR SELECT
  TO anon, authenticated
  USING (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to insert their own categories
CREATE POLICY "Allow anon and authenticated to insert own categories"
  ON expense_categories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to update their own categories
CREATE POLICY "Allow anon and authenticated to update own categories"
  ON expense_categories
  FOR UPDATE
  TO anon, authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to delete their own categories
CREATE POLICY "Allow anon and authenticated to delete own categories"
  ON expense_categories
  FOR DELETE
  TO anon, authenticated
  USING (auth.uid() = user_id);
```

### 4. `user_profiles` jadvalini yaratish

**Eng oson usul:** `QUICK_FIX_USER_PROFILES.sql` faylini oching va butun kodini nusxalab, SQL Editor'ga yopishtiring.

Yoki quyidagi SQL kodini nusxalab, SQL Editor'ga yopishtiring va **Run** tugmasini bosing:

```sql
-- User Profiles Table for Settings
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Updated_at trigger (if function doesn't exist, create it first)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anon and authenticated to read their own profile
CREATE POLICY "Allow anon and authenticated to read own profile"
    ON user_profiles FOR SELECT
    TO anon, authenticated
    USING (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to insert their own profile
CREATE POLICY "Allow anon and authenticated to insert own profile"
    ON user_profiles FOR INSERT
    TO anon, authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to update their own profile
CREATE POLICY "Allow anon and authenticated to update own profile"
    ON user_profiles FOR UPDATE
    TO anon, authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anon and authenticated to delete their own profile
CREATE POLICY "Allow anon and authenticated to delete own profile"
    ON user_profiles FOR DELETE
    TO anon, authenticated
    USING (auth.uid() = user_id);
```

### 5. Tekshirish

SQL kodlarini ishga tushirgandan so'ng:

1. **Table Editor** ga kiring
2. Quyidagi jadvallarni tekshiring:
   - `expense_categories` - mavjud bo'lishi kerak
   - `user_profiles` - mavjud bo'lishi kerak

3. **Authentication > Policies** ga kiring
4. Har bir jadval uchun policies'ni tekshiring:
   - `expense_categories` - 4 ta policy (SELECT, INSERT, UPDATE, DELETE)
   - `user_profiles` - 4 ta policy (SELECT, INSERT, UPDATE, DELETE)

### 6. API Key uzunligini tekshirish

Vercel Dashboard'da:
1. **Settings > Environment Variables** ga kiring
2. `VITE_SUPABASE_ANON_KEY` ni tekshiring
3. Key uzunligi 100+ belgi bo'lishi kerak

**Qayerdan topish:**
- Supabase Dashboard > Settings > API
- **anon public** key - bu `VITE_SUPABASE_ANON_KEY` uchun

## Natija

Jadvallar yaratilgandan so'ng:
- `expense_categories` jadvali ishlaydi
- `user_profiles` jadvali ishlaydi
- Console'dagi 404 xatoliklari yo'qoladi

## Qo'shimcha yordam

Agar hali ham muammo bo'lsa:
1. Browser Console'dagi to'liq xatolarni yuboring
2. Supabase Dashboard > Logs > Postgres Logs'ni tekshiring
3. SQL Editor'da test so'rovlarini ishga tushiring
