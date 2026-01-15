# Supabase Policies'ni To'g'ri Sozlash (Qadam-baqadam)

## Muammo
Rasmdan ko'rinib turibdiki, policies "APPLIED TO: public" ko'rsatilgan. Bu noto'g'ri! Policies `anon` va `authenticated` rollariga qo'llanilishi kerak.

## Yechim

### 1-qadam: Eski policies'ni o'chirish

Supabase Dashboard > SQL Editor'da quyidagi kodni ishga tushiring:

```sql
-- Eski policies'ni o'chirish
DROP POLICY IF EXISTS "Enable all access" ON shifts;
DROP POLICY IF EXISTS "Enable all access for shifts" ON shifts;
DROP POLICY IF EXISTS "Enable all access" ON transactions;
```

### 2-qadam: Yangi policies'ni yaratish

Keyin quyidagi kodni ishga tushiring:

```sql
-- ============================================
-- SHIFTS TABLE POLICIES
-- ============================================

-- SELECT (o'qish)
CREATE POLICY "Allow anon and authenticated to read shifts"
    ON shifts FOR SELECT
    TO anon, authenticated
    USING (true);

-- INSERT (qo'shish)
CREATE POLICY "Allow anon and authenticated to insert shifts"
    ON shifts FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE (yangilash)
CREATE POLICY "Allow anon and authenticated to update shifts"
    ON shifts FOR UPDATE
    TO anon, authenticated
    USING (true);

-- DELETE (o'chirish)
CREATE POLICY "Allow anon and authenticated to delete shifts"
    ON shifts FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================

-- SELECT (o'qish)
CREATE POLICY "Allow anon and authenticated to read transactions"
    ON transactions FOR SELECT
    TO anon, authenticated
    USING (true);

-- INSERT (qo'shish)
CREATE POLICY "Allow anon and authenticated to insert transactions"
    ON transactions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE (yangilash)
CREATE POLICY "Allow anon and authenticated to update transactions"
    ON transactions FOR UPDATE
    TO anon, authenticated
    USING (true);

-- DELETE (o'chirish)
CREATE POLICY "Allow anon and authenticated to delete transactions"
    ON transactions FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================
-- CUSTOMERS TABLE POLICIES (agar kerak bo'lsa)
-- ============================================

-- SELECT
CREATE POLICY "Allow anon and authenticated to read customers"
    ON customers FOR SELECT
    TO anon, authenticated
    USING (true);

-- INSERT
CREATE POLICY "Allow anon and authenticated to insert customers"
    ON customers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE
CREATE POLICY "Allow anon and authenticated to update customers"
    ON customers FOR UPDATE
    TO anon, authenticated
    USING (true);

-- DELETE
CREATE POLICY "Allow anon and authenticated to delete customers"
    ON customers FOR DELETE
    TO anon, authenticated
    USING (true);
```

### 3-qadam: Tekshirish

SQL kodini ishga tushirgandan so'ng:

1. **Authentication > Policies** ga qaytib kiring
2. **shifts** jadvali uchun 4 ta policy bo'lishi kerak:
   - "Allow anon and authenticated to read shifts" - SELECT
   - "Allow anon and authenticated to insert shifts" - INSERT
   - "Allow anon and authenticated to update shifts" - UPDATE
   - "Allow anon and authenticated to delete shifts" - DELETE

3. Har bir policy'da **APPLIED TO** qismida `anon, authenticated` ko'rsatilishi kerak (faqat `public` emas!)

4. **transactions** jadvali uchun ham xuddi shunday 4 ta policy bo'lishi kerak

### 4-qadam: Agar policy'ni tahrirlash kerak bo'lsa

1. Policy'ning o'ng tomonidagi **3 nuqta** (⋮) tugmasini bosing
2. **Edit** ni tanlang
3. **Target roles** qismida `anon` va `authenticated` tanlanganligini tekshiring
4. **Save** tugmasini bosing

## Muhim eslatma

- **"APPLIED TO: public"** - bu noto'g'ri! Bu schema nomi, role emas.
- **"APPLIED TO: anon, authenticated"** - bu to'g'ri! Bu rollar.

## Test qilish

SQL kodini ishga tushirgandan so'ng, saytni yangilang va "Bad Request" xatosi yo'qolishi kerak.
