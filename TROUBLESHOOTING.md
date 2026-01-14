# Blank Page Troubleshooting Guide

## 🔍 Asosiy Muammo: Blank Page (Oq Sahifa)

Agar sayt blank page ko'rsatayotgan bo'lsa, quyidagilarni tekshiring:

## 1. ✅ Environment Variables (Muhim!)

Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://uhxbduojbebxgkgwcjpo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
```

**Tekshirish:**
- Har ikkala o'zgaruvchi mavjudligini tekshiring
- Production, Preview, Development - hammasida qo'shiling
- Redeploy qiling (mutlaka!)

## 2. 🔍 Browser Console'ni Tekshiring

F12 → Console tab'ni oching va quyidagilarni tekshiring:

### Xatoliklar:
- ❌ `Supabase environment variables are missing!` → Environment variable'lar yo'q
- ❌ `Failed to fetch` → Network muammosi yoki CORS
- ❌ `Cannot read property 'render' of null` → Root element topilmadi
- ❌ `Module not found` → Build muammosi

### JavaScript yuklanayotganini tekshiring:
- Network tab → JS fayllar yuklanayotganini tekshiring
- `/assets/js/index-*.js` fayli yuklanayotganini tekshiring

## 3. 📦 Build Tekshirish

Vercel Dashboard → Deployments → Latest → Logs:

### Build xatoliklari:
- ❌ `Build failed` → Dependencies muammosi
- ❌ `Module not found` → Import xatosi
- ❌ `TypeScript error` → Type xatosi

### Build muvaffaqiyatli bo'lsa:
- ✅ `Build completed` ko'rinishi kerak
- ✅ `dist/` papkada fayllar bo'lishi kerak

## 4. 🌐 Network Tekshirish

F12 → Network tab:

### Tekshirish:
- ✅ `index.html` → 200 status
- ✅ `/assets/js/index-*.js` → 200 status
- ✅ `/assets/css/index-*.css` → 200 status
- ❌ 404 → Fayl topilmadi
- ❌ 500 → Server xatosi

## 5. 🔄 Cache Muammosi

Agar hali ham muammo bo'lsa:

1. **Hard Refresh:** Ctrl + Shift + R (yoki Ctrl + F5)
2. **Clear Cache:** Browser Settings → Clear browsing data
3. **Incognito Mode:** Yashirin rejimda ochib ko'ring

## 6. 🛠️ Vercel Logs

Vercel Dashboard → Deployments → Latest → Logs:

### Qidirish:
- `Error:` - Xatoliklar
- `Warning:` - Ogohlantirishlar
- `Build completed` - Build muvaffaqiyatli

## 7. 📝 Tekshirish Ro'yxati

- [ ] Environment variable'lar qo'shilgan
- [ ] Redeploy qilingan
- [ ] Browser Console'da xatoliklar yo'q
- [ ] Network tab'da JS fayllar yuklanayapti
- [ ] Build muvaffaqiyatli
- [ ] Hard refresh qilingan
- [ ] Incognito mode'da tekshirilgan

## 8. 🆘 Yordam

Agar hali ham muammo bo'lsa:

1. Vercel Logs'ni to'liq ko'ring
2. Browser Console'dagi barcha xatoliklarni screenshot qiling
3. Network tab'dagi failed request'larni ko'ring
4. Environment variable'larni qayta tekshiring

## 9. ✅ To'g'ri Ishlash Belgilari

Sayt to'g'ri ishlayotganida:
- ✅ Login sahifasi ko'rinadi
- ✅ Browser Console'da xatoliklar yo'q
- ✅ Network tab'da barcha fayllar 200 status
- ✅ Loading spinner ko'rinadi (agar kerak bo'lsa)
