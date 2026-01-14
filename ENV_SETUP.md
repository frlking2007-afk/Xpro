# Environment Variables Setup (Vercel)

## 🔑 Supabase Credentials

Quyidagi ma'lumotlarni Vercel'da environment variable sifatida qo'shing:

```
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

## 📝 Vercel Dashboard'da Qo'shish:

### 1. Vercel Dashboard'ga kiring
- https://vercel.com/dashboard
- Xpro loyihangizni tanlang

### 2. Settings → Environment Variables ga o'ting

### 3. Har bir o'zgaruvchini qo'shing:

**Birinchi o'zgaruvchi:**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://uhxbduojbebxgkgwcjpo.supabase.co`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

**Ikkinchi o'zgaruvchi:**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### 4. Save tugmasini bosing

### 5. Redeploy qiling:
- Deployments → Latest deployment → ... (3 nuqta) → Redeploy
- Yoki yangi commit push qiling (avtomatik redeploy)

---

## ✅ Tekshirish

Environment variable'larni qo'shgandan keyin:
1. Redeploy qiling
2. Saytni yangilang
3. Browser Console'ni oching (F12)
4. Xatoliklar yo'qligini tekshiring

---

## 🖥️ Local Development uchun

Agar local'da ishlatmoqchi bo'lsangiz, `.env.local` fayl yarating:

```bash
# .env.local
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

**Eslatma:** `.env.local` fayl `.gitignore` da bo'lgani uchun GitHub'ga push qilinmaydi.
