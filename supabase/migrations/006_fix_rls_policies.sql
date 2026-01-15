-- Fix RLS Policies to allow anon key access
-- This migration adds policies for anonymous (anon) key access
-- Required for Supabase client to work without authentication

-- ============================================
-- 1. DROP EXISTING POLICIES (if they exist)
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated users to read shifts" ON shifts;
DROP POLICY IF EXISTS "Allow authenticated users to insert shifts" ON shifts;
DROP POLICY IF EXISTS "Allow authenticated users to update shifts" ON shifts;
DROP POLICY IF EXISTS "Allow authenticated users to delete shifts" ON shifts;

DROP POLICY IF EXISTS "Allow authenticated users to read transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated users to insert transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated users to update transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated users to delete transactions" ON transactions;

DROP POLICY IF EXISTS "Allow authenticated users to read customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated users to delete customers" ON customers;

-- ============================================
-- 2. CREATE POLICIES FOR ANON KEY (Public Access)
-- ============================================
-- Shifts policies - Allow public read/write (for now, can be restricted later)
CREATE POLICY "Allow public read shifts"
    ON shifts FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert shifts"
    ON shifts FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update shifts"
    ON shifts FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete shifts"
    ON shifts FOR DELETE
    TO anon, authenticated
    USING (true);

-- Transactions policies - Allow public read/write
CREATE POLICY "Allow public read transactions"
    ON transactions FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert transactions"
    ON transactions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update transactions"
    ON transactions FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete transactions"
    ON transactions FOR DELETE
    TO anon, authenticated
    USING (true);

-- Customers policies - Allow public read/write
CREATE POLICY "Allow public read customers"
    ON customers FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert customers"
    ON customers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update customers"
    ON customers FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete customers"
    ON customers FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================
-- 3. VERIFY POLICIES
-- ============================================
-- After running this migration, verify policies in Supabase Dashboard:
-- 1. Go to Authentication > Policies
-- 2. Check that all tables have policies for both 'anon' and 'authenticated' roles
-- 3. Ensure RLS is enabled on all tables
