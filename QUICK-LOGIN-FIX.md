# 🚨 Login Xatolik Tezkor Yechimi

## Muammo: "Invalid login credentials"

## 🎯 Tezkor Yechim (3 daqiqada)

### 1-qadam: Supabase Dashboard → Authentication → Users
1. https://supabase.com/dashboard/project/mdqgvtrysmeulcmjgvvr/auth/users
2. "Add user" tugmasini bosing
3. **Email:** `frlking2007@gmail.com`
4. **Password:** `123456` (yoki istalgan parol)
5. **Auto-confirm:** ✅ belgilang
6. "Save" tugmasini bosing

### 2-qadam: Profile yaratish (agar kerak bo'lsa)
Supabase Dashboard → SQL Editor → quyidagini yozing:

```sql
INSERT INTO public.profiles (id, username, full_name)
SELECT 
  u.id,
  'frlking2007',
  'FRL King'
FROM auth.users u 
WHERE u.email = 'frlking2007@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();
```

### 3-qadam: Login test
- **Email:** `frlking2007@gmail.com`
- **Password:** `123456`

## 🔍 Agar ishlamasa:

### Browser Console da tekshirish:
```javascript
// Direct API test
fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/auth/v1/token?grant_type=password', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'frlking2007@gmail.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(data => console.log('Login result:', data))
```

### Xatolik turlari:
- **401:** Parol noto'g'ri
- **400:** Email yoki parol format xato
- **429:** Juda ko'p urinish

## 📋 Koddan tekshirish:

Login.tsx 80-qatorda faqat `frlking2007@gmail.com` ga ruxsat bor:
```typescript
if (data.user?.email !== 'frlking2007@gmail.com') {
  // Ruxsatsiz kirish
}
```

Bu to'g'ri - faqat sizning emailingizga ruxsat berilgan.

## 🚀 Oxirgi variant:

Agar hammasi ishlamasa, yangi foydalanuvchi yarating:
1. **Email:** `admin@xpro.uz`
2. **Password:** `admin123`
3. Keyin Login.tsx 80-qatorni yangi emailga o'zgartiring
