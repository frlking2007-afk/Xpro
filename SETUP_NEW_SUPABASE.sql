-- ============================================
-- YANGI SUPABASE PROJECT UCHUN TO'LIQ SETUP
-- ============================================
-- Bu SQL kodini Supabase SQL Editor'da ishga tushiring
-- STEP 1: Barcha jadvallarni yaratish
-- STEP 2: Foreign key constraints qo'shish
-- STEP 3: RLS policies sozlash
-- ============================================

-- ============================================
-- STEP 1: JADVALLARNI YARATISH
-- ============================================

-- 1. SHIFTS jadvali (Smenalar)
CREATE TABLE IF NOT EXISTS shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  starting_balance NUMERIC DEFAULT 0,
  ending_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRANSACTIONS jadvali (Operatsiyalar)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID NOT NULL,
  user_id UUID,
  amount NUMERIC NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('kassa', 'click', 'uzcard', 'humo', 'xarajat')),
  category TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPENSE_CATEGORIES jadvali (Xarajat kategoriyalari)
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER_PROFILES jadvali (Foydalanuvchi profillari)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMERS jadvali (Mijozlar)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: FOREIGN KEY CONSTRAINTS (CASCADE DELETE bilan)
-- ============================================

-- Transactions -> Shifts (CASCADE DELETE)
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_shift_id_fkey;

ALTER TABLE transactions
ADD CONSTRAINT transactions_shift_id_fkey
FOREIGN KEY (shift_id)
REFERENCES shifts(id)
ON DELETE CASCADE;

-- ============================================
-- STEP 3: INDEXLAR QO'SHISH (Performance uchun)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_transactions_shift_id ON transactions(shift_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_opened_at ON shifts(opened_at);

-- ============================================
-- STEP 4: RLS (ROW LEVEL SECURITY) POLICIES
-- ============================================

-- Enable RLS for all tables
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- DROP old policies (agar mavjud bo'lsa)
DROP POLICY IF EXISTS "Allow all for anon" ON shifts;
DROP POLICY IF EXISTS "Allow all for authenticated" ON shifts;
DROP POLICY IF EXISTS "Allow all for anon" ON transactions;
DROP POLICY IF EXISTS "Allow all for authenticated" ON transactions;
DROP POLICY IF EXISTS "Allow all for anon" ON expense_categories;
DROP POLICY IF EXISTS "Allow all for authenticated" ON expense_categories;
DROP POLICY IF EXISTS "Allow all for anon" ON user_profiles;
DROP POLICY IF EXISTS "Allow all for authenticated" ON user_profiles;
DROP POLICY IF EXISTS "Allow all for anon" ON customers;
DROP POLICY IF EXISTS "Allow all for authenticated" ON customers;

-- SHIFTS policies (anon va authenticated uchun ochiq)
CREATE POLICY "Allow all for anon" ON shifts
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON shifts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- TRANSACTIONS policies (anon va authenticated uchun ochiq)
CREATE POLICY "Allow all for anon" ON transactions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON transactions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- EXPENSE_CATEGORIES policies (anon va authenticated uchun ochiq)
CREATE POLICY "Allow all for anon" ON expense_categories
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON expense_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- USER_PROFILES policies (anon va authenticated uchun ochiq)
CREATE POLICY "Allow all for anon" ON user_profiles
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON user_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- CUSTOMERS policies (anon va authenticated uchun ochiq)
CREATE POLICY "Allow all for anon" ON customers
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON customers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- TUGADI!
-- ============================================
-- Endi .env faylini yangilashni unutmang:
-- VITE_SUPABASE_URL=https://mdqgvtrysmeulcmjgvvr.supabase.co
-- VITE_SUPABASE_ANON_KEY=sb_publishable_5QsK-EC3-B26NoTPIeJycg_Nzz-ZzNA
-- ============================================
