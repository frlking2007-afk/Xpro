# Vercel'da Environment Variables Qo'shish - To'liq Qo'llanma

## 📝 Qadam-Baqadam Ko'rsatma

### 1️⃣ Vercel Dashboard'ga Kirish

1. **Brauzer'da oching:**
   - https://vercel.com/dashboard
   - Yoki https://vercel.com ga kiring va "Log In" tugmasini bosing

2. **Login qiling:**
   - GitHub, GitLab yoki Bitbucket orqali login qiling
   - Agar account yo'q bo'lsa, "Sign Up" tugmasini bosing

---

### 2️⃣ Loyihani Tanlash

1. **Dashboard'da loyihangizni toping:**
   - Vercel Dashboard'da barcha loyihalar ro'yxati ko'rinadi
   - **"Xpro"** yoki **"xpro-one"** nomli loyihani toping
   - Loyiha nomiga bosing

2. **Loyiha sahifasiga o'ting:**
   - Endi siz loyiha sahifasidasiz
   - Yuqorida "Overview", "Deployments", "Settings" va boshqa tab'lar ko'rinadi

---

### 3️⃣ Settings'ga O'tish

1. **Settings tab'ini bosing:**
   - Yuqoridagi menu'da **"Settings"** yozuviga bosing
   - Yoki quyidagi yo'l: **Settings** → (chap tomonda menu)

2. **Environment Variables'ni toping:**
   - Settings sahifasida chap tomonda menu ko'rinadi
   - **"Environment Variables"** yozuviga bosing
   - Yoki to'g'ridan-to'g'ri: https://vercel.com/[your-project]/settings/environment-variables

---

### 4️⃣ Birinchi Environment Variable Qo'shish

1. **"Add New" yoki "+" tugmasini bosing:**
   - Environment Variables sahifasida yuqorida **"Add New"** tugmasi ko'rinadi
   - Yoki **"+"** belgisi bo'lishi mumkin

2. **Key'ni kiriting:**
   - **Key** maydoniga quyidagini kiriting:
   ```
   VITE_SUPABASE_URL
   ```
   - Eslatma: Katta-kichik harflar muhim! To'g'ri yozing.

3. **Value'ni kiriting:**
   - **Value** maydoniga quyidagini kiriting:
   ```
   https://uhxbduojbebxgkgwcjpo.supabase.co
   ```
   - Eslatma: Boshida va oxirida bo'sh joy bo'lmasligi kerak!

4. **Environment'ni tanlang:**
   - Quyidagi 3 ta checkbox ko'rinadi:
     - ☑️ **Production** - Production sayt uchun
     - ☑️ **Preview** - Preview (test) sayt uchun
     - ☑️ **Development** - Development uchun
   - **Hammasini tanlang** (3 tasini ham ☑️ qiling)

5. **"Save" tugmasini bosing:**
   - Pastda **"Save"** yoki **"Add"** tugmasi ko'rinadi
   - Tugmani bosing

---

### 5️⃣ Ikkinchi Environment Variable Qo'shish

1. **Yana "Add New" tugmasini bosing:**
   - Birinchi variable qo'shilgandan keyin, yana **"Add New"** tugmasini bosing

2. **Key'ni kiriting:**
   - **Key** maydoniga quyidagini kiriting:
   ```
   VITE_SUPABASE_ANON_KEY
   ```
   - Eslatma: Katta-kichik harflar muhim!

3. **Value'ni kiriting:**
   - **Value** maydoniga quyidagini kiriting:
   ```
   sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
   ```
   - Eslatma: To'liq key'ni ko'chirib qo'ying, boshida va oxirida bo'sh joy bo'lmasligi kerak!

4. **Environment'ni tanlang:**
   - Quyidagi 3 ta checkbox:
     - ☑️ **Production**
     - ☑️ **Preview**
     - ☑️ **Development**
   - **Hammasini tanlang** (3 tasini ham ☑️ qiling)

5. **"Save" tugmasini bosing:**
   - **"Save"** yoki **"Add"** tugmasini bosing

---

### 6️⃣ Tekshirish

1. **Qo'shilgan variable'larni ko'ring:**
   - Environment Variables sahifasida quyidagilar ko'rinishi kerak:
   
   ```
   VITE_SUPABASE_URL
   https://uhxbduojbebxgkgwcjpo.supabase.co
   Production, Preview, Development
   
   VITE_SUPABASE_ANON_KEY
   sb_publishable_U9OqCN-cXfxYPnXTEGUj_Q_Rw3QyR83
   Production, Preview, Development
   ```

2. **To'g'riligini tekshiring:**
   - Key'lar to'g'ri yozilganligini tekshiring
   - Value'lar to'g'ri yozilganligini tekshiring
   - Environment'lar tanlanganligini tekshiring

---

### 7️⃣ Redeploy Qilish (Muhim!)

1. **Deployments tab'iga o'ting:**
   - Yuqoridagi menu'da **"Deployments"** tab'iga bosing

2. **Latest deployment'ni toping:**
   - Eng yuqorida oxirgi deployment ko'rinadi
   - Unga bosing

3. **Redeploy qiling:**
   - Deployment sahifasida yuqorida o'ng tomonda **"..."** (3 nuqta) tugmasi ko'rinadi
   - Tugmani bosing
   - **"Redeploy"** yozuviga bosing
   - Tasdiqlash oynasida **"Redeploy"** tugmasini bosing

4. **Kutib turing:**
   - Redeploy 1-3 daqiqa davom etadi
   - Status **"Building"** → **"Ready"** bo'lguncha kuting

---

### 8️⃣ Tekshirish

1. **Saytni oching:**
   - https://xpro-one.vercel.app ga kiring
   - Yoki Vercel'da ko'rsatilgan URL'ga kiring

2. **Browser Console'ni oching:**
   - F12 tugmasini bosing
   - **"Console"** tab'iga o'ting

3. **Xatoliklarni tekshiring:**
   - Quyidagi xatoliklar **ko'rinmasligi** kerak:
     - ❌ "Supabase environment variables are missing!"
     - ❌ "403 Forbidden"
     - ❌ "Unauthorized"
   - Agar xatoliklar ko'rinmasa, hammasi to'g'ri ishlayapti! ✅

---

## ⚠️ Muhim Eslatmalar

### ✅ To'g'ri:
- Key'lar katta harf bilan boshlanadi: `VITE_SUPABASE_URL`
- Value'larda boshida va oxirida bo'sh joy yo'q
- Barcha 3 environment tanlangan (Production, Preview, Development)
- Redeploy qilingan

### ❌ Noto'g'ri:
- Key'lar kichik harf bilan: `vite_supabase_url` ❌
- Value'larda ortiqcha bo'sh joylar ❌
- Faqat 1 environment tanlangan ❌
- Redeploy qilinmagan ❌

---

## 🆘 Muammo Bo'lsa

### Agar variable'lar ko'rinmasa:
1. **Sahifani yangilang** (F5)
2. **Boshqa brauzer'da** ochib ko'ring
3. **Vercel'ga qayta login** qiling

### Agar sayt hali ham ishlamasa:
1. **Redeploy qiling** (7-qadam)
2. **Browser cache'ni tozalang** (Ctrl + Shift + Delete)
3. **Hard refresh** qiling (Ctrl + Shift + R)

### Agar xatoliklar ko'rinayotgan bo'lsa:
1. **Variable'larni qayta tekshiring** (6-qadam)
2. **Key'lar to'g'ri yozilganligini** tekshiring
3. **Value'lar to'g'ri yozilganligini** tekshiring

---

## 📸 Screenshot'lar (Tavsiya)

Agar muammo bo'lsa, quyidagi screenshot'larni oling:
1. Environment Variables sahifasi
2. Browser Console'dagi xatoliklar
3. Vercel Deployment logs

---

## ✅ Muvaffaqiyatli Sozlash Belgilari

Quyidagilar bo'lsa, hammasi to'g'ri:
- ✅ 2 ta environment variable qo'shilgan
- ✅ Barcha 3 environment tanlangan
- ✅ Redeploy qilingan va muvaffaqiyatli
- ✅ Sayt ishlayapti
- ✅ Browser Console'da xatoliklar yo'q

---

## 📞 Yordam

Agar hali ham muammo bo'lsa:
1. Vercel Dashboard → Deployments → Latest → Logs'ni ko'ring
2. Browser Console'dagi xatoliklarni screenshot qiling
3. Environment Variables sahifasini screenshot qiling
