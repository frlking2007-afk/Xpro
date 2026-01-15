# "Bad Request" Xatosini Debug Qilish

## 1. Browser Console'ni oching

1. F12 tugmasini bosing
2. **Console** tab'ini tanlang
3. Saytni yangilang (F5)

## 2. Quyidagilarni qidiring

### A. Supabase Connection
```
✅ Supabase database connection successful
```
yoki
```
❌ Supabase database connection error: ...
```

### B. Session Check
```
✅ Supabase session active for user: ...
```
yoki
```
ℹ️ No active Supabase session
```

### C. Smena ochishda
```
🚀 Opening new shift...
📝 Insert data: {...}
✅ Shift inserted successfully
```
yoki
```
❌ Supabase error inserting shift: ...
Error code: ...
Error message: ...
```

### D. Dashboard'da
```
📊 Fetching dashboard stats...
✅ All transactions fetched: X items
```
yoki
```
❌ Supabase error fetching transactions: ...
```

## 3. Xatolik kodlarini tahlil qilish

### 400 Bad Request
- **Sabab:** So'rov formati noto'g'ri
- **Yechim:** Insert qilayotgan ma'lumotlarni tekshiring

### 42501 Permission denied
- **Sabab:** RLS policy muammosi
- **Yechim:** Policies'ni tekshiring

### PGRST116 No rows found
- **Sabab:** Ma'lumot topilmadi (normal)
- **Yechim:** Hech narsa qilish shart emas

## 4. Test qilish

### A. SQL Editor'da test so'rov

Supabase Dashboard > SQL Editor'da:

```sql
-- Test: Shifts jadvaliga ma'lumot qo'shish
INSERT INTO shifts (status, starting_balance, opened_at)
VALUES ('open', 0, NOW())
RETURNING *;
```

Agar bu ishlasa, muammo kodda emas, Supabase'da.

### B. Jadval strukturasini tekshirish

```sql
-- Shifts jadvali strukturasini ko'rish
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'shifts'
ORDER BY ordinal_position;
```

### C. RLS holatini tekshirish

```sql
-- RLS yoqilganmi?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('shifts', 'transactions');
```

## 5. Environment Variables tekshirish

Vercel Dashboard'da:
1. **Settings > Environment Variables**
2. Quyidagilar mavjudligini tekshiring:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Qayerdan topish:**
- Supabase Dashboard > Settings > API
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 6. RLS'ni vaqtincha o'chirish (test uchun)

Agar hali ham muammo bo'lsa, test uchun RLS'ni o'chirib ko'ring:

```sql
-- RLS'ni o'chirish (faqat test uchun!)
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
```

**Eslatma:** Bu faqat test uchun! Production'da RLS yoqilgan bo'lishi kerak.

Agar RLS o'chirilganda ishlasa, muammo RLS policies'da.

## 7. To'liq xatolik ma'lumotlarini yuborish

Browser Console'dan quyidagilarni nusxalab yuboring:

1. **Error code** (masalan: `400`, `42501`)
2. **Error message** (to'liq matn)
3. **Error details** (agar mavjud bo'lsa)
4. **Insert data** (smena ochishda yuborilayotgan ma'lumotlar)

## 8. Qo'shimcha tekshirishlar

### A. Supabase Project Settings
- Supabase Dashboard > Settings > API
- **Project URL** to'g'rimi?
- **anon public** key to'g'rimi?

### B. Database Connection
- Supabase Dashboard > Settings > Database
- Database faolmi?
- Connection pool limit'ga yetganmisan?

### C. Logs
- Supabase Dashboard > Logs > Postgres Logs
- Xatoliklar bor yoki yo'qligini tekshiring
