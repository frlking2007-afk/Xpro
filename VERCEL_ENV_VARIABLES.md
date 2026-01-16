# Vercel Environment Variables (Vite uchun)

## Vercel Dashboard'da quyidagilarni qo'shing:

**Settings → Environment Variables** ga kiring va quyidagilarni qo'shing:

### Production, Preview, Development uchun:

```
VITE_SUPABASE_URL=https://kjlhcwqlfvapnbjwcthq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbGhjd3FsZnZhcG5iandjdGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODI0NDQsImV4cCI6MjA4NDE1ODQ0NH0.b8yTGcSoH3WsYQzYcef4J69DIR2EAZfbUQhs2II-0cw
```

**YOKI** agar publishable key ishlatmoqchi bo'lsangiz:

```
VITE_SUPABASE_URL=https://kjlhcwqlfvapnbjwcthq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__t9UZGq2LVT8IMBbqbU2Cg_KikLX0Ru
```

## Muhim:

1. **`VITE_` prefiksi majburiy** (Next.js uchun `NEXT_PUBLIC_` emas!)
2. **Environment** ni tanlang: Production, Preview, Development (yoki hammasi)
3. **Save** tugmasini bosing
4. **Redeploy** qiling (yangi commit push qiling yoki manual redeploy)

## Test qilish:

1. Vercel'da redeploy qiling
2. Production saytni oching
3. F12 konsolida quyidagilarni qidiring:
   - `✅ Supabase client created`
   - `✅ Supabase database connection successful`
