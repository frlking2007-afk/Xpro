-- XPro CRM Database Schema
-- Supabase PostgreSQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SHIFTS TABLE (Smenalar)
-- ============================================
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    starting_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    ending_balance NUMERIC(15, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for shifts
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_opened_at ON shifts(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_shifts_closed_at ON shifts(closed_at DESC);

-- ============================================
-- 2. TRANSACTIONS TABLE (Operatsiyalar)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('kassa', 'click', 'uzcard', 'humo', 'xarajat', 'eksport')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_shift_id ON transactions(shift_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_shift_type ON transactions(shift_id, type);

-- ============================================
-- 3. CUSTOMERS TABLE (Mijozlar)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_purchase_date TIMESTAMPTZ,
    total_spent NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON customers(full_name);

-- ============================================
-- 4. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_shifts_updated_at
    BEFORE UPDATE ON shifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all data
CREATE POLICY "Allow authenticated users to read shifts"
    ON shifts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert shifts"
    ON shifts FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update shifts"
    ON shifts FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete shifts"
    ON shifts FOR DELETE
    TO authenticated
    USING (true);

-- Transactions policies
CREATE POLICY "Allow authenticated users to read transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert transactions"
    ON transactions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update transactions"
    ON transactions FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete transactions"
    ON transactions FOR DELETE
    TO authenticated
    USING (true);

-- Customers policies
CREATE POLICY "Allow authenticated users to read customers"
    ON customers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert customers"
    ON customers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update customers"
    ON customers FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete customers"
    ON customers FOR DELETE
    TO authenticated
    USING (true);
