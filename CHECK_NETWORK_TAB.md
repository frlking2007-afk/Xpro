# Network Tab'ni Tekshirish

## "Bad Request" xatosini topish uchun

### 1. Browser Developer Tools'ni oching
- **F12** tugmasini bosing
- **Network** tab'ini tanlang

### 2. Saytni yangilang va smena ochishni sinab ko'ring
- Saytni yangilang (F5)
- "Smenani Boshlash" tugmasini bosing

### 3. Network tab'da quyidagilarni qidiring

#### A. Supabase API so'rovlarini toping
- Filter'da `rest` yoki `supabase` yozing
- Quyidagi so'rovlarni qidiring:
  - `POST /rest/v1/shifts` - Smena ochish
  - `GET /rest/v1/transactions` - Ma'lumotlarni olish

#### B. So'rovni tanlang va quyidagilarni tekshiring

**Headers tab:**
- **Request URL:** To'g'rimi?
- **Request Method:** POST yoki GET
- **Status Code:** 400 (Bad Request) yoki boshqa?

**Payload tab (POST so'rovlar uchun):**
- Yuborilayotgan ma'lumotlar ko'rsatilganmi?
- Ma'lumotlar formati to'g'rimi?

**Response tab:**
- Xatolik xabari ko'rsatilganmi?
- Error code va message ko'rsatilganmi?

### 4. Xatolik ma'lumotlarini yuborish

Network tab'dan quyidagilarni nusxalab yuboring:

1. **Request URL** (to'liq URL)
2. **Status Code** (masalan: 400)
3. **Request Payload** (POST so'rovlar uchun)
4. **Response Body** (xatolik xabari)

### 5. Console tab'ni ham tekshiring

F12 → Console tab'da quyidagilarni qidiring:

```
🚀 Opening new shift...
📝 Insert data: {...}
📡 Sending request to Supabase...
📡 Supabase response received
❌ Full error details: ...
```

Barcha console xabarlarini nusxalab yuboring.

### 6. Qo'shimcha tekshirishlar

#### A. Environment Variables
Browser Console'da:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

#### B. Supabase Client
Browser Console'da:
```javascript
// Supabase client'ni tekshirish
import { supabase } from './lib/supabase';
console.log('Supabase client:', supabase);
```

### 7. Muammo bo'lsa

Agar Network tab'da 400 Bad Request ko'rsatilsa:

1. **Request Payload** ni tekshiring - ma'lumotlar to'g'rimi?
2. **Response Body** ni tekshiring - qanday xatolik?
3. **Headers** ni tekshiring - `apikey` header mavjudmi?

Barcha ma'lumotlarni yuboring - tahlil qilaman!
