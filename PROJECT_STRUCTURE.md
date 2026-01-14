# XPro CRM - Loyiha Strukturasi

## 📁 Asosiy Papkalar va Fayllar

### 🚀 Entry Points (Kirish Nuqtalari)

#### `src/main.tsx`
- **Vazifa:** Ilovaning asosiy kirish nuqtasi
- **Funksiyalar:**
  - React ilovasini DOM'ga render qiladi
  - QueryProvider bilan ilovani o'ralaydi (TanStack Query)
  - Theme sozlamalarini yuklaydi (localStorage'dan)
  - StrictMode'ni faollashtiradi

#### `src/App.tsx`
- **Vazifa:** Ilovaning asosiy routing va layout komponenti
- **Funksiyalar:**
  - React Router bilan routing sozlaydi
  - Barcha sahifalarni lazy load qiladi (code splitting)
  - ProtectedRoute bilan himoyalangan route'larni boshqaradi
  - Toast notification (Sonner) sozlaydi
  - Vercel Speed Insights integratsiyasi

#### `index.html`
- **Vazifa:** HTML shablon
- **Funksiyalar:**
  - Favicon sozlaydi
  - Meta taglar (viewport, description)
  - Preconnect va modulepreload optimizatsiyalari

---

### 🎨 Components (Komponentlar)

#### `src/components/`
- **AddCategoryModal.tsx** - Yangi xarajat bo'limi qo'shish modal oynasi
- **EditCategoryModal.tsx** - Xarajat bo'limini tahrirlash modal oynasi
- **EditShiftNameModal.tsx** - Smena nomini tahrirlash modal oynasi
- **PasswordModal.tsx** - Parol so'rash modal oynasi (o'chirish operatsiyalari uchun)
- **SalesModal.tsx** - Savdo summasini kiritish modal oynasi
- **ConfirmModal.tsx** - Tasdiqlash modal oynasi
- **ProtectedRoute.tsx** - Route himoyasi (authentication tekshiruvi)
- **DateFilter.tsx** - Sana filtri komponenti
- **MetricSelector.tsx** - Metrika tanlov komponenti (grafiklar uchun)
- **ExportSettingsModal.tsx** - Eksport sozlamalari modal oynasi
- **ExpenseCategoriesTab.tsx** - Xarajat bo'limlari tab komponenti
- **StatCardSkeleton.tsx** - Statistik kartalar uchun skeleton loader
- **ChartSkeleton.tsx** - Grafiklar uchun skeleton loader
- **ErrorState.tsx** - Xatolik holati komponenti (retry funksiyasi bilan)

---

### 📄 Pages (Sahifalar)

#### `src/pages/`
- **Login.tsx** - Kirish sahifasi (authentication)
- **Dashboard.tsx** - Asosiy dashboard (statistika va grafiklar)
- **XproLanding.tsx** - Xpro operatsiyalar sahifasining landing page
- **XproOperations.tsx** - Asosiy operatsiyalar sahifasi (kassa, to'lovlar, xarajatlar)
- **ExpenseStatistics.tsx** - Umumiy xarajatlar statistikasi
- **CategoryExpenseStatistics.tsx** - Bo'lim bo'yicha xarajatlar statistikasi
- **Reports.tsx** - Hisobotlar sahifasi
- **Settings.tsx** - Sozlamalar sahifasi
- **Customers.tsx** - Mijozlar sahifasi

---

### 🎣 Hooks (Custom Hooks)

#### `src/hooks/`
- **useDashboardData.ts** - Dashboard ma'lumotlarini olish (TanStack Query bilan)
  - Supabase'dan transaction ma'lumotlarini oladi
  - Statistikani hisoblaydi (foyda, zarar, o'zgarishlar)
  - Grafik ma'lumotlarini tayyorlaydi
  - Cache va retry sozlamalari bilan

- **useShift.ts** - Smena boshqaruvi hook'i
  - Joriy smenani olish
  - Yangi smena ochish
  - Smena yopish

---

### 🔧 Utils (Yordamchi Funksiyalar)

#### `src/utils/`
- **export.ts** - Receipt/Chek eksport funksiyalari
  - `generateExpenseReceiptHTML()` - Xarajat bo'limlari uchun chek HTML yaratadi
  - `generatePaymentReceiptHTML()` - To'lov turlari uchun chek HTML yaratadi
  - `printReceipt()` - Chekni print qiladi
  - Export sozlamalarini localStorage'da saqlaydi
  - Xprinter uchun optimallashtirilgan format

- **currency.ts** - Valyuta formatlash funksiyalari
  - `formatCurrency()` - Summani formatlash (UZS)
  - `getCurrencySymbol()` - Valyuta belgisi olish

- **password.ts** - Parol boshqaruvi
  - Parol tekshirish
  - Parol saqlash/olish (localStorage)

- **cn.ts** - Class name utility (Tailwind merge)

---

### 🗄️ Lib (Kutubxonalar)

#### `src/lib/`
- **supabase.ts** - Supabase client sozlash
  - Supabase client yaratadi
  - Environment variable'lardan URL va key oladi
  - Barcha Supabase operatsiyalari uchun asosiy client

- **utils.ts** - Umumiy utility funksiyalar

---

### 🎭 Providers (Context Providers)

#### `src/providers/`
- **QueryProvider.tsx** - TanStack Query provider
  - QueryClient sozlaydi (staleTime, gcTime, retry)
  - ReactQueryDevtools'ni faqat development'da yuklaydi
  - Barcha query operatsiyalarini boshqaradi

---

### 📐 Layouts (Layout Komponentlar)

#### `src/layouts/`
- **DashboardLayout.tsx** - Dashboard layout
  - Sidebar navigatsiya
  - Header
  - Asosiy kontent maydoni
  - Barcha dashboard sahifalari uchun umumiy layout

---

### 📝 Types (TypeScript Type'lar)

#### `src/types/`
- **index.ts** - Barcha TypeScript interface va type'lar
  - `Customer` - Mijoz ma'lumotlari
  - `Transaction` - Transaction ma'lumotlari
  - `DashboardStats` - Dashboard statistikasi
  - `ChartDataPoint` - Grafik ma'lumotlari
  - `DashboardData` - Dashboard ma'lumotlari
  - `ExportSettings` - Eksport sozlamalari

---

## 🔄 Data Flow (Ma'lumotlar Oqimi)

1. **Authentication:** Login.tsx → Supabase Auth
2. **Data Fetching:** Pages → Hooks (useDashboardData, useShift) → Supabase
3. **State Management:** TanStack Query (cache, refetch, error handling)
4. **UI Updates:** React state + TanStack Query state
5. **Export:** Pages → export.ts → Print Window

---

## 📦 Asosiy Texnologiyalar

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching va caching
- **Supabase** - Backend (PostgreSQL + Auth)
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animatsiyalar
- **Recharts** - Grafiklar
- **Sonner** - Toast notifications

---

## 🎯 Muhim Fayllar Xulosa

| Fayl | Vazifa |
|------|--------|
| `main.tsx` | Ilovani boshlash, QueryProvider bilan o'ralash |
| `App.tsx` | Routing, lazy loading, protected routes |
| `export.ts` | Receipt/chek generatsiya va print qilish |
| `useDashboardData.ts` | Dashboard ma'lumotlarini Supabase'dan olish |
| `supabase.ts` | Supabase client sozlash |
| `QueryProvider.tsx` | TanStack Query sozlash |
| `DashboardLayout.tsx` | Dashboard uchun umumiy layout |

---

## ✅ GitHub Ulanishi

- **Repository:** https://github.com/frlking2007-afk/Xpro.git
- **Branch:** `main`
- **Status:** ✅ To'g'ri ulanadi va push qilinadi
