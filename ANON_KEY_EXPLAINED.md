# VITE_SUPABASE_ANON_KEY Tushuntirishi

## 🔑 Anon Key Nima?

`VITE_SUPABASE_ANON_KEY` - bu Supabase'ning **anon (anonymous) public key**'i. Bu key:

- ✅ **Public** - Frontend'da ishlatiladi (xavfsiz)
- ✅ **Row Level Security (RLS)** - Database'da xavfsizlik qoidalari bilan himoyalangan
- ✅ **Cheklangan** - Faqat RLS qoidalariga bo'ysunadi

---

## ❓ Sizga Biron Bir Key Kiritish Kerakmi?

### ✅ **HA, kerak!**

Siz allaqachon key'ni oldingiz:

```
sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

Bu key'ni **Vercel'da** environment variable sifatida qo'shishingiz kerak.

---

## 📝 Qayerdan Olinadi?

### 1. Supabase Dashboard'ga kiring
- https://supabase.com/dashboard
- Loyihangizni tanlang

### 2. Settings → API ga o'ting

### 3. Quyidagilarni toping:

```
Project URL: https://uhxbduojbebxgkgwcjpo.supabase.co
anon public key: sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

---

## 🔐 Key Turlari

Supabase'da 2 xil key bor:

### 1. **Anon Key** (Public) ✅
```
sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```
- Frontend'da ishlatiladi
- RLS qoidalariga bo'ysunadi
- Xavfsiz (public bo'lsa ham)

### 2. **Service Role Key** (Private) ❌
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- **ASLA frontend'da ishlatilmaydi!**
- Faqat backend'da
- Barcha RLS qoidalarini bypass qiladi
- **Xavfsizlik xavfi!**

---

## ✅ To'g'ri Sozlash

### Vercel'da:

1. **Vercel Dashboard** → **Settings** → **Environment Variables**

2. **Qo'shing:**
   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
   Environment: Production, Preview, Development (hammasini tanlang)
   ```

3. **Save** va **Redeploy**

### Local Development uchun:

`.env.local` fayl yarating (`.gitignore` da, GitHub'ga push qilinmaydi):

```bash
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

---

## ⚠️ Xavfsizlik Eslatmalari

### ✅ To'g'ri:
- ✅ Anon key frontend'da ishlatiladi
- ✅ Anon key GitHub'ga push qilinishi mumkin (public)
- ✅ RLS qoidalari xavfsizlikni ta'minlaydi

### ❌ Noto'g'ri:
- ❌ Service Role key frontend'da ishlatilmaydi
- ❌ Service Role key GitHub'ga push qilinmaydi
- ❌ Anon key'ni o'zgartirish kerak emas

---

## 🔍 Key Tekshirish

Agar key to'g'ri sozlangan bo'lsa:

1. **Browser Console'da** (F12):
   ```javascript
   // Xatolik bo'lmasligi kerak
   // "Supabase environment variables are missing!" ko'rinmasligi kerak
   ```

2. **Sayt ishlashi kerak:**
   - Login sahifasi ko'rinadi
   - Database'ga ulanish ishlaydi

---

## 📝 Xulosa

**Javob:** ✅ **HA, sizga key kerak!**

Sizning key'ingiz:
```
sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

Bu key'ni:
1. ✅ Vercel'da environment variable sifatida qo'shing
2. ✅ Local development uchun `.env.local` faylga qo'shing
3. ✅ Key'ni o'zgartirmaslik (bu Supabase'dan olingan to'g'ri key)

**Muhim:** Bu key **public** va **xavfsiz** - frontend'da ishlatilishi mumkin!
