# XPro CRM - Kassa Xisobot Tizimi

Modern React + TypeScript + Supabase bilan yozilgan kassa va hisobot tizimi.

## 🚀 Tezkor Boshlash

**5 daqiqada ishga tushirish:** [`QUICK_START.md`](./QUICK_START.md) faylini ko'ring

## 📋 Talablar

- Node.js 18+ 
- npm yoki yarn
- Supabase account (bepul)

## ⚡ O'rnatish

```bash
# 1. Dependencies o'rnatish
npm install

# 2. Environment variables sozlash
# .env faylini oching va Supabase ma'lumotlarini kiriting
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. Supabase Database Schema yaratish
# SUPABASE_SETUP.md faylini ko'ring

# 4. Development server ishga tushirish
npm run dev
```

## 📚 Qo'llanmalar

- [`QUICK_START.md`](./QUICK_START.md) - 5 daqiqada ishga tushirish
- [`SETUP.md`](./SETUP.md) - Batafsil o'rnatish qo'llanmasi
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Supabase database sozlash

## 🎯 Funksiyalar

- ✅ **Smena Boshqaruvi** - Smenalarni ochish/yopish
- ✅ **Operatsiyalar** - Kassa, Click, Uzcard, Humo, Xarajat
- ✅ **Mijozlar** - Mijozlar bazasi
- ✅ **Hisobotlar** - Operatsiyalar va smenalar hisobotlari
- ✅ **Dashboard** - Statistika va grafiklar
- ✅ **Authentication** - Xavfsiz kirish tizimi

## 🛠️ Texnologiyalar

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Build Tool:** Vite

## 📦 NPM Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code linting
```

## 🔐 Login

- **Email:** `frlking2007@gmail.com` (faqat bu email)
- **Parol:** Supabase'da yaratilgan parol

## 📁 Loyiha Strukturasi

```
XPro/
├── src/
│   ├── components/     # React komponentlar
│   ├── pages/          # Sahifalar
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities (Supabase client)
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
├── supabase/
│   └── migrations/     # Database migrations
├── .env                 # Environment variables
└── package.json
```

## 🗄️ Database Schema

- **shifts** - Smenalar
- **transactions** - Operatsiyalar
- **customers** - Mijozlar

Batafsil: [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)

## 🚨 Muammolar

Agar muammo bo'lsa:
1. `SUPABASE_SETUP.md` faylini ko'ring
2. Browser Console'da xatolarni tekshiring
3. Supabase Dashboard'da jadvallarni tekshiring
4. `.env` fayl to'g'ri sozlanganligini tekshiring

## 📞 Aloqa

- Email: frlking2007@gmail.com
- Telefon: +998-95-017-78-83

## 📄 License

ISC
