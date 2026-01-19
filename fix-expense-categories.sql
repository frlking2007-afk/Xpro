-- QUICK FIX: Create expense_categories table
-- Run this in Supabase Dashboard → SQL Editor

-- Create expense_categories table
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nomi TEXT NOT NULL,
  summa DECIMAL(12,2) NOT NULL CHECK (summa >= 0),
  tavsif TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own expense_categories" ON public.expense_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expense_categories" ON public.expense_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expense_categories" ON public.expense_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expense_categories" ON public.expense_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS expense_categories_user_id_idx ON public.expense_categories(user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_expense_categories_updated_at
  BEFORE UPDATE ON public.expense_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.expense_categories TO authenticated;

-- Test data (optional - remove in production)
INSERT INTO public.expense_categories (user_id, nomi, summa, tavsif)
VALUES 
  ('test-user-id', 'Kafeterya', 50000, 'Ishga ketish uchun'),
  ('test-user-id', 'Transport', 30000, 'Yo\'l haqi')
ON CONFLICT DO NOTHING;

COMMIT;
