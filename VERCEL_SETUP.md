# Vercel Deployment Setup Guide

## 🔧 Environment Variables (Muhim!)

Sayt to'g'ri ishlashi uchun Vercel'da quyidagi environment variable'larni sozlash kerak:

### 1. Vercel Dashboard'ga kiring
- https://vercel.com/dashboard
- Xpro loyihangizni tanlang

### 2. Settings → Environment Variables ga o'ting

### 3. Quyidagi o'zgaruvchilarni qo'shing:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Qayerdan topish:**
- Supabase Dashboard → Settings → API
- `Project URL` → `VITE_SUPABASE_URL` ga qo'ying
- `anon public` key → `VITE_SUPABASE_ANON_KEY` ga qo'ying

### 4. Environment'ni tanlang:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Save tugmasini bosing

### 6. Redeploy qiling:
- Deployments → Latest deployment → ... → Redeploy

---

## ⚠️ Muammo: Blank Page (Hech narsa ko'rinmayapti)

Agar sayt blank page ko'rsatayotgan bo'lsa:

1. **Environment Variables tekshiring:**
   - Vercel Dashboard → Settings → Environment Variables
   - `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` mavjudligini tekshiring

2. **Browser Console'ni oching:**
   - F12 → Console tab
   - Xatoliklar bor-yo'qligini tekshiring

3. **Network tab'ni tekshiring:**
   - F12 → Network tab
   - JavaScript fayllari yuklanayotganini tekshiring

4. **Redeploy qiling:**
   - Environment variable'larni qo'shgandan keyin mutlaka redeploy qiling

---

## 🔍 Debugging

### Browser Console'da quyidagilarni tekshiring:

```javascript
// Supabase URL tekshirish
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Supabase Key tekshirish (faqat development'da)
if (import.meta.env.DEV) {
  console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
}
```

### Xatoliklar:

- **"Supabase URL va Anon Key topilmadi"** → Environment variable'lar sozlanmagan
- **"Failed to fetch"** → Network muammosi yoki CORS xatosi
- **Blank page** → JavaScript yuklanmagan yoki build xatosi

---

## 📝 Build Settings

Vercel avtomatik ravishda quyidagilarni aniqlaydi:
- **Framework Preset:** Vite
- **Build Command:** `npm run build` (yoki `vite build`)
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Agar muammo bo'lsa, `vercel.json` faylida quyidagilarni tekshiring:
- `rewrites` - SPA routing uchun
- `headers` - Cache control uchun

---

## ✅ Tekshirish

Deploy qilgandan keyin:
1. Sayt yuklanayotganini tekshiring
2. Login sahifasi ko'rinayotganini tekshiring
3. Browser Console'da xatoliklar yo'qligini tekshiring
4. Network tab'da barcha fayllar yuklanayotganini tekshiring

---

## 🆘 Yordam

Agar muammo davom etsa:
1. Vercel Logs'ni tekshiring (Deployments → Latest → Logs)
2. Browser Console'dagi xatoliklarni ko'ring
3. Environment variable'larni qayta tekshiring
4. Redeploy qiling
