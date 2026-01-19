# Vercel Debug Checklist

## 1. Vercel Dashboard tekshirish
- https://vercel.com/dashboard ga kirish
- XPro proyektini tanlash
- "Deployments" tab'ini tekshirish
- Oxirgi deployment qachon bo'lgan?

## 2. GitHub integratsiyasi
- Vercel → Settings → Git Integrations
- GitHub ulanganligini tekshirish
- Branch: main tanlanganligini tekshirish

## 3. Build log'lari
- Oxirgi deployment log'larini ko'rish
- Xatolik bormi?
- Environment variables to'g'ri yozilganmi?

## 4. Manual redeploy
```bash
# Vercel CLI orqali
npx vercel --prod

# Yoki Vercel Dashboard'da "Redeploy" tugmasi
```

## 5. Environment variables tekshirish
Vercel → Settings → Environment Variables:
- VITE_SUPABASE_URL ✅
- VITE_SUPABASE_ANON_KEY ✅

## 6. Build komandasi tekshirish
package.json da:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## 7. Agar hamma narsa to'g'ri bo'lsa
Yangi commit qilish uchun:
```bash
# Bo'sh commit qilish (trigger qilish uchun)
git commit --allow-empty -m "trigger vercel redeploy"
git push origin main
```
