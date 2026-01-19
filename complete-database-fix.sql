-- COMPLETE DATABASE FIX FOR SCHEMA ERROR
-- Run this in Supabase Dashboard → SQL Editor

-- ==========================================
-- 1. CREATE ALL REQUIRED TABLES
-- ==========================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'click', 'uzcard', 'humo', 'expense')),
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense categories table
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nomi TEXT NOT NULL,
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. CREATE RLS POLICIES
-- ==========================================

-- Profiles policies
CREATE POLICY IF NOT EXISTS "Users can view own profiles" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Transactions policies
CREATE POLICY IF NOT EXISTS "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Expense categories policies
CREATE POLICY IF NOT EXISTS "Users can view own expense_categories" ON public.expense_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own expense_categories" ON public.expense_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own expense_categories" ON public.expense_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own expense_categories" ON public.expense_categories
  FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS expense_categories_user_id_idx ON public.expense_categories(user_id);

-- ==========================================
-- 5. CREATE UPDATED_AT TRIGGER FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 6. CREATE TRIGGERS
-- ==========================================

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_transactions_updated_at ON public.transactions;
CREATE TRIGGER handle_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_expense_categories_updated_at ON public.expense_categories;
CREATE TRIGGER handle_expense_categories_updated_at
  BEFORE UPDATE ON public.expense_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 7. GRANT PERMISSIONS
-- ==========================================

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.expense_categories TO authenticated;

-- ==========================================
-- 8. VERIFICATION QUERIES
-- ==========================================

-- Check if tables exist
SELECT 
  table_name,
  table_type,
  is_insertable_into
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'transactions', 'expense_categories')
ORDER BY table_name;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  forcerlspolicy
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'transactions', 'expense_categories');

-- Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==========================================
-- 9. SAMPLE DATA (OPTIONAL)
-- ==========================================

-- Create sample profile for test user (if exists)
INSERT INTO public.profiles (id, username, full_name)
SELECT 
  u.id,
  'frlking2007',
  'FRL King'
FROM auth.users u 
WHERE u.email = 'frlking2007@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

COMMIT;

-- ==========================================
-- 10. SUCCESS MESSAGE
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '✅ Tables created: profiles, transactions, expense_categories';
  RAISE NOTICE '✅ RLS enabled and policies created';
  RAISE NOTICE '✅ Indexes and triggers created';
  RAISE NOTICE '✅ Permissions granted';
END $$;
