# Supabase "Bad Request" Xatosini Tuzatish Qo'llanmasi

## Muammo
Loyihada "Bad Request" xatosi chiqmoqda. Bu muammo Supabase RLS (Row Level Security) policies bilan bog'liq.

## Yechim

### 1. Supabase Dashboard'ga kiring
- https://supabase.com/dashboard ga kiring
- Loyihangizni tanlang

### 2. SQL Editor'ni oching
- Chap menudan **SQL Editor** ni tanlang
- **New query** tugmasini bosing

### 3. Migration faylini ishga tushiring

Quyidagi SQL kodini nusxalab, SQL Editor'ga yopishtiring va **Run** tugmasini bosing:

```sql
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
-- Shifts policies - Allow public read/write
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
```

### 4. Tekshirish

SQL kodini ishga tushirgandan so'ng:

1. **Authentication > Policies** ga kiring
2. Quyidagi jadvallarni tekshiring:
   - `shifts` - 4 ta policy bo'lishi kerak (SELECT, INSERT, UPDATE, DELETE)
   - `transactions` - 4 ta policy bo'lishi kerak
   - `customers` - 4 ta policy bo'lishi kerak

3. Har bir policy'da **Roles** qismida `anon` va `authenticated` bo'lishi kerak

### 5. Agar hali ham xatolik bo'lsa

#### A. RLS'ni vaqtincha o'chirish (faqat test uchun)

```sql
-- RLS'ni o'chirish (faqat test uchun, production'da tavsiya etilmaydi)
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
```

**Eslatma:** Bu faqat test uchun. Production'da RLS yoqilgan bo'lishi kerak.

#### B. Jadval strukturasini tekshirish

```sql
-- Shifts jadvali strukturasini ko'rish
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'shifts';

-- Transactions jadvali strukturasini ko'rish
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions';
```

#### C. Test so'rov yuborish

```sql
-- Test: Shifts jadvaliga ma'lumot qo'shish
INSERT INTO shifts (status, starting_balance, opened_at)
VALUES ('open', 0, NOW())
RETURNING *;
```

Agar bu so'rov ishlasa, muammo RLS policies'da emas.

### 6. Environment Variables tekshirish

Vercel Dashboard'da:
1. **Settings > Environment Variables** ga kiring
2. Quyidagilar mavjudligini tekshiring:
   - `VITE_SUPABASE_URL` - Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

**Qayerdan topish:**
- Supabase Dashboard > Settings > API
- **Project URL** - `VITE_SUPABASE_URL` uchun
- **anon public** key - `VITE_SUPABASE_ANON_KEY` uchun

### 7. Browser Console'ni tekshirish

Browser'da F12 ni bosing va Console'ni oching. Quyidagilarni qidiring:

- `✅ Supabase connection successful` - ulanish muvaffaqiyatli
- `❌ Supabase error...` - xatolik bo'lsa, batafsil ma'lumot ko'rsatiladi

## Xatolik kodlari va ularning ma'nosi

- **42501** - Permission denied (RLS policy muammosi)
- **PGRST116** - No rows found (normal, agar ma'lumot bo'lmasa)
- **23505** - Unique violation (duplicate key)
- **PGRST301** - Table not found (jadval topilmadi)

## Qo'shimcha yordam

Agar muammo hal bo'lmasa:
1. Browser Console'dagi to'liq xatolarni yuboring
2. Supabase Dashboard > Logs > Postgres Logs'ni tekshiring
3. SQL Editor'da test so'rovlarini ishga tushiring
