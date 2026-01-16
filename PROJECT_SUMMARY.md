# Xpro Loyihasi - Qisqa Eslatma

## Ko'rinish:
- Dark theme (qora fon)
- Modern UI/UX dizayn
- Framer Motion animatsiyalar
- Tailwind CSS styling
- Responsive dizayn

## Asosiy Funksiyalar:

### 1. Dashboard
- Jami Foyda (KASSA tab'dagi + operatsiyalar yig'indisi)
- Olim aka (KASSA tab'dagi - operatsiyalar, "Olim aka" tavsif bilan)
- Azam aka (KASSA tab'dagi - operatsiyalar, "Azam aka" tavsif bilan)
- Kassa (KASSA tab'dagi - operatsiyalar, "Kassa" tavsif bilan)

### 2. Xpro Operations
- **KASSA Tab**: Kassa operatsiyalari (foyda/zarar), operatsiyalar tarixi
- **CLICK Tab**: Click to'lovlari
- **UZCARD Tab**: Uzcard to'lovlari
- **HUMO Tab**: Humo to'lovlari
- **XARAJAT Tab**: Xarajat kategoriyalari (Travel, Meals, Office Supplies, Tabaka, va boshqalar)
  - Har bir kategoriya uchun summa va tavsif input
  - Umumiy xarajat ko'rsatish
  - Statistika tugmasi
  - Kategoriya qo'shish/o'zgartirish/o'chirish
- **EKSPORT Tab**: Xarajatlar bo'limlari eksporti, Tabaka eksporti

### 3. Reports
- Operatsiyalar ro'yxati
- Smenalar ro'yxati (ochilgan/ochiq/yopilgan)
- Smena o'chirish (CASCADE DELETE bilan)

### 4. Settings
- Foydalanuvchi profil sozlamalari
- Parol o'rnatish

### 5. Login
- Qora fon
- Supabase authentication

## Texnologiyalar:
- React 18
- TypeScript
- Vite
- Supabase (Backend)
- Tailwind CSS
- Framer Motion
- React Router
- Recharts (grafiklar - keyinroq olib tashlandi)
- Sonner (toast notifications)

## Database (Supabase):
- shifts (smenalar)
- transactions (operatsiyalar)
- expense_categories (xarajat kategoriyalari)
- user_profiles (foydalanuvchi profillari)
- customers (mijozlar)

## Muhim Xususiyatlar:
- Smena ochish/yopish
- Operatsiyalarni qo'shish/tahrirlash/o'chirish
- Kategoriyalar bo'yicha xarajatlar statistikasi
- HTML formatda eksport (receipt)
- Parol himoyasi (kategoriya o'chirish uchun)
- Row Level Security (RLS) policies
