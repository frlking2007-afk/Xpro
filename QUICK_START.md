# XPro CRM - Tezkor Boshlash Qo'llanmasi

## ⚡ 5 Daqiqada Ishga Tushirish

### 1️⃣ Supabase Loyiha Yaratish (2 daqiqa)

1. https://app.supabase.com ga kiring
2. "New Project" tugmasini bosing
3. Loyiha nomi: "XPro CRM"
4. Parol yarating va saqlang
5. "Create new project" tugmasini bosing

### 2️⃣ Database Schema Yaratish (1 daqiqa)

1. Supabase Dashboard'da **SQL Editor** > **New Query**
2. `supabase/migrations/001_initial_schema.sql` faylini oching
3. Barcha kodni nusxalab SQL Editor'ga yopishtiring
4. **Run** tugmasini bosing

✅ Jadvalar yaratildi!

### 3️⃣ Environment Variables (1 daqiqa)

✅ **Supabase URL GitHub'dan topildi!**

`.env` faylida Supabase URL allaqachon mavjud:
- `VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co`

**Faqat Anon Key'ni qo'shishingiz kerak:**

1. Supabase Dashboard'da **Settings** > **API**
2. **`anon` `public`** key'ni nusxalang
3. `.env` faylini oching va `VITE_SUPABASE_ANON_KEY` qiymatini yangilang

```env
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here  # ← Bu yerni to'ldiring
```

📖 **Batafsil:** `GITHUB_SUPABASE_INFO.md` faylini ko'ring

### 4️⃣ User Yaratish (30 soniya)

1. **Authentication** > **Users** > **Add user**
2. Email: `frlking2007@gmail.com`
3. Parol yarating
4. **Auto Confirm User** ✅
5. **Create user**

### 5️⃣ Server Ishga Tushirish (30 soniya)

```bash
cd "C:\Users\10576\Pictures\Printer export\Yangi loiha\XPro"
npm run dev
```

Browser'da `http://localhost:5173/login` ga kiring va login qiling!

## ✅ Tayyor!

Endi siz:
- ✅ Smena ochishingiz mumkin
- ✅ Operatsiyalar qo'shishingiz mumkin
- ✅ Mijozlar boshqarishingiz mumkin
- ✅ Hisobotlarni ko'rishingiz mumkin

## 🆘 Muammo bo'lsa?

- `SUPABASE_SETUP.md` - Batafsil sozlash qo'llanmasi
- `SETUP.md` - Umumiy o'rnatish qo'llanmasi
- Browser Console'da xatolarni tekshiring
- Supabase Dashboard'da Table Editor'da jadvallarni tekshiring
