# Supabase Database Setup Qo'llanmasi

Bu qo'llanma XPro CRM loyihasi uchun Supabase database'ni sozlash uchun yordam beradi.

## 📋 Kerakli Jadvalar

Loyiha quyidagi 3 ta asosiy jadvalni talab qiladi:

1. **shifts** - Smenalar (ochilgan/yopilgan smenalar)
2. **transactions** - Operatsiyalar (kassa, click, uzcard, humo, xarajat)
3. **customers** - Mijozlar

## 🚀 Qadam-baqadam Sozlash

### 1. Supabase Loyiha Yaratish

1. https://app.supabase.com ga kiring
2. "New Project" tugmasini bosing
3. Loyiha nomini kiriting (masalan: "XPro CRM")
4. Database parolini yarating va saqlang
5. Region tanlang (eng yaqin regionni tanlang)
6. "Create new project" tugmasini bosing

### 2. SQL Editor orqali Schema Yaratish

1. Supabase Dashboard'da **SQL Editor** bo'limiga o'ting
2. **New Query** tugmasini bosing
3. `supabase/migrations/001_initial_schema.sql` faylini oching
4. Barcha SQL kodini nusxalab SQL Editor'ga yopishtiring
5. **Run** tugmasini bosing yoki `Ctrl+Enter` bosing

✅ Agar muvaffaqiyatli bo'lsa, quyidagi jadvallar yaratiladi:
- ✅ shifts
- ✅ transactions  
- ✅ customers

### 3. Environment Variables Sozlash

1. Supabase Dashboard'da **Settings** > **API** bo'limiga o'ting
2. Quyidagi ma'lumotlarni nusxalang:
   - **Project URL** (masalan: `https://xxxxx.supabase.co`)
   - **anon public** key

3. `.env` faylini oching va quyidagilarni to'ldiring:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Authentication Sozlash

1. Supabase Dashboard'da **Authentication** > **Users** bo'limiga o'ting
2. **Add user** tugmasini bosing
3. Quyidagi ma'lumotlarni kiriting:
   - **Email:** `frlking2007@gmail.com`
   - **Password:** (o'zingiz parol yarating)
   - **Auto Confirm User:** ✅ (belgilang)

4. **Create user** tugmasini bosing

⚠️ **Eslatma:** Login.tsx faylida faqat `frlking2007@gmail.com` email bilan kirish mumkin. Agar boshqa email ishlatmoqchi bo'lsangiz, `src/pages/Login.tsx` faylini o'zgartiring.

### 5. Row Level Security (RLS) Tekshirish

RLS allaqachon SQL migratsiyasida sozlangan. Tekshirish uchun:

1. **Authentication** > **Policies** bo'limiga o'ting
2. Quyidagi jadvallar uchun policy'lar mavjudligini tekshiring:
   - shifts
   - transactions
   - customers

## 🧪 Test Qilish

### 1. Database Connection Test

Development server'ni ishga tushiring:
```bash
npm run dev
```

Browser'da `http://localhost:5173/login` ga kiring va login qiling.

### 2. Jadvalarni Tekshirish

Supabase Dashboard'da **Table Editor** bo'limiga o'ting va quyidagi jadvallarni ko'ring:
- shifts
- transactions
- customers

## 📊 Jadval Strukturasi

### shifts (Smenalar)
- `id` - UUID (Primary Key)
- `opened_at` - Smena ochilgan vaqt
- `closed_at` - Smena yopilgan vaqt (nullable)
- `status` - 'open' yoki 'closed'
- `starting_balance` - Boshlang'ich balans
- `ending_balance` - Yakuniy balans (nullable)

### transactions (Operatsiyalar)
- `id` - UUID (Primary Key)
- `shift_id` - Smena ID (Foreign Key)
- `amount` - Summa
- `description` - Tavsif (nullable)
- `date` - Sana va vaqt
- `type` - 'kassa', 'click', 'uzcard', 'humo', 'xarajat', 'eksport'

### customers (Mijozlar)
- `id` - UUID (Primary Key)
- `full_name` - Ism Familiya
- `phone` - Telefon raqami
- `status` - 'active' yoki 'inactive'
- `last_purchase_date` - Oxirgi xarid sanasi (nullable)
- `total_spent` - Jami sarflangan summa

## 🔧 Muammolarni Hal Qilish

### Xato: "relation does not exist"
- SQL migratsiyasini qayta ishga tushiring
- Table Editor'da jadvallar mavjudligini tekshiring

### Xato: "permission denied"
- RLS policy'lar to'g'ri sozlanganligini tekshiring
- User authentication qilganligini tekshiring

### Xato: "Supabase URL va Anon Key topilmadi"
- `.env` fayl to'g'ri joyda ekanligini tekshiring
- Environment variables to'g'ri yozilganligini tekshiring
- Server'ni qayta ishga tushiring

## 📝 Qo'shimcha Ma'lumotlar

- Supabase Documentation: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
