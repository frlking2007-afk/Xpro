# XPro CRM - O'rnatish va Ishlatish Qo'llanmasi

## ✅ Bajarilgan Qadamlar

1. ✅ Dependencies o'rnatildi (`npm install`)
2. ✅ `.env` fayl yaratildi
3. ✅ Development server ishga tushirildi

## 🔧 Keyingi Qadamlar

### 1. Supabase Sozlamalarini To'ldirish

`.env` faylini oching va quyidagi ma'lumotlarni to'ldiring:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Qayerdan olish:**
1. https://app.supabase.com ga kiring
2. Yangi loyiha yarating yoki mavjud loyihani tanlang
3. Settings > API bo'limiga o'ting
4. `Project URL` va `anon public` key'ni nusxalab `.env` fayliga qo'ying

### 2. Supabase Database Schema Yaratish

✅ **SQL migratsiya fayli yaratildi!**

Loyiha quyidagi jadvallarni talab qiladi:
- `shifts` - Smenalar
- `transactions` - Operatsiyalar
- `customers` - Mijozlar

**Qanday yaratish:**
1. `SUPABASE_SETUP.md` faylini oching va qadam-baqadam ko'rsatmalarga amal qiling
2. Yoki `supabase/migrations/001_initial_schema.sql` faylini Supabase SQL Editor'ga yopishtiring va Run qiling

📖 **Batafsil ma'lumot:** `SUPABASE_SETUP.md` faylini ko'ring

### 3. Development Server

Server allaqachon ishga tushirilgan. Agar to'xtatilgan bo'lsa:

```bash
npm run dev
```

Server odatda `http://localhost:5173` da ishlaydi.

### 4. Login

- **Email:** `frlking2007@gmail.com` (faqat bu email bilan kirish mumkin)
- **Parol:** Supabase'da yaratilgan parol

## 📦 NPM Scripts

- `npm run dev` - Development server ishga tushirish
- `npm run build` - Production build yaratish
- `npm run preview` - Build'ni preview qilish
- `npm run lint` - Code linting

## 🚨 Muammolar

### Supabase xatosi
Agar "Supabase URL va Anon Key topilmadi" xatosi chiqsa:
- `.env` fayl to'g'ri joyda ekanligini tekshiring
- Environment variables to'g'ri yozilganligini tekshiring
- Server'ni qayta ishga tushiring

### Port band
Agar port 5173 band bo'lsa, Vite avtomatik boshqa port tanlaydi (masalan, 5174)

## 📝 Eslatmalar

- Bu loyiha React + TypeScript + Vite + Supabase stack'ida yozilgan
- Tailwind CSS ishlatilgan
- Framer Motion animatsiyalar uchun
- React Router DOM routing uchun
