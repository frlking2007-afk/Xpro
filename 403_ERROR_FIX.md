# 403 Error Fix - Tushuntirish

## 🔧 Qilingan O'zgarishlar

### 1. ✅ Supabase Client Tekshirildi
- `src/lib/supabase.ts` - `import.meta.env` ishlatilmoqda (to'g'ri)
- `process.env` yo'q - faqat `import.meta.env` (Vite uchun to'g'ri)
- Supabase client to'g'ri sozlangan

### 2. ✅ Error Handling Qo'shildi

#### `handleSupabaseError` funksiyasi yaratildi:
- 403 Forbidden xatolari uchun maxsus xabar
- 401 Unauthorized xatolari uchun maxsus xabar
- Network xatolari uchun maxsus xabar
- Boshqa xatolar uchun umumiy xabar

#### `ProtectedRoute.tsx`:
- 403 xatosi aniqlanadi
- "Ruxsat yo'q" yoki "Login muddati tugagan" xabari ko'rsatiladi
- Avtomatik sign out va login sahifasiga yo'naltirish

#### `useDashboardData.ts`:
- 403 xatosi handle qilinadi
- User avtomatik sign out qilinadi
- Tushunarli xabar ko'rsatiladi

#### `ErrorState.tsx`:
- 403 xatosi uchun "Login sahifasiga o'tish" tugmasi
- Boshqa xatolar uchun "Qayta urinish" tugmasi

#### `Dashboard.tsx`:
- 403 xatosi aniqlanadi
- ErrorState komponentiga `is403Error` prop'i uzatiladi

### 3. ✅ Vite Config Optimizatsiyasi
- `vite.config.ts` allaqachon optimallashtirilgan
- `manualChunks` sozlangan
- Barcha katta kutubxonalar alohida chunk'larga bo'lingan

---

## 🔑 Environment Variables

**Muhim:** Faqat quyidagi key'larni ishlating:

### ✅ To'g'ri (Frontend'da ishlatiladi):
```
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

### ❌ Noto'g'ri (Frontend'da ishlatilmaydi):
- `sb_secret_wuS3hAoVdKInwo8cnqlciw_lKtA4C-K` - Secret key (backend uchun)
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` - JWT token (kerak emas)

---

## 📝 403 Xatosi Sabablari

403 Forbidden xatosi quyidagi sabablarga ko'ra yuzaga kelishi mumkin:

1. **RLS (Row Level Security) Qoidalari:**
   - Database'da RLS qoidalari user'ga ruxsat bermaydi
   - Supabase Dashboard → Authentication → Policies'ni tekshiring

2. **Session Expired:**
   - User session muddati tugagan
   - Qayta login qilish kerak

3. **Noto'g'ri Key:**
   - Anon key noto'g'ri yoki o'zgartirilgan
   - Vercel'da environment variable'larni tekshiring

4. **CORS Muammosi:**
   - Supabase'da domain whitelist'ga qo'shilmagan
   - Supabase Dashboard → Settings → API'ni tekshiring

---

## ✅ Tekshirish

### 1. Vercel Environment Variables:
```
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

### 2. Browser Console (F12):
- 403 xatosi ko'rinmasligi kerak
- "Ruxsat yo'q" yoki "Login muddati tugagan" xabari ko'rsatilishi kerak (agar 403 bo'lsa)

### 3. Supabase Dashboard:
- Authentication → Users - user mavjudligini tekshiring
- Database → Tables → Policies - RLS qoidalarini tekshiring

---

## 🆘 Muammo Davom Etsa

1. **Vercel'da Redeploy qiling:**
   - Deployments → Latest → Redeploy

2. **Browser Cache'ni tozalang:**
   - Ctrl + Shift + R (Hard refresh)

3. **Supabase RLS Qoidalarini Tekshiring:**
   - Database → Tables → [table_name] → Policies
   - User'ga read/write ruxsati bo'lishi kerak

4. **Session'ni Tozalang:**
   - Browser → Application → Local Storage → Clear
   - Qayta login qiling

---

## 📚 Qo'shimcha Ma'lumot

- `handleSupabaseError` funksiyasi barcha Supabase xatolarini handle qiladi
- 403 xatosi avtomatik aniqlanadi va user login sahifasiga yo'naltiriladi
- Barcha error message'lar foydalanuvchiga tushunarli
