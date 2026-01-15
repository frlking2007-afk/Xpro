-- ============================================
-- QUICK FIX: Create expense_categories table
-- ============================================
-- Copy this entire SQL code to Supabase SQL Editor and run it

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_name)
);

-- Step 2: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);

-- Step 3: Create updated_at trigger function (if doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_expense_categories_updated_at ON expense_categories;
CREATE TRIGGER update_expense_categories_updated_at
    BEFORE UPDATE ON expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON expense_categories;
DROP POLICY IF EXISTS "Allow anon and authenticated to read own categories" ON expense_categories;
DROP POLICY IF EXISTS "Allow anon and authenticated to insert own categories" ON expense_categories;
DROP POLICY IF EXISTS "Allow anon and authenticated to update own categories" ON expense_categories;
DROP POLICY IF EXISTS "Allow anon and authenticated to delete own categories" ON expense_categories;

-- Step 7: Create new policies for anon and authenticated
CREATE POLICY "Allow anon and authenticated to read own categories"
  ON expense_categories
  FOR SELECT
  TO anon, authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to insert own categories"
  ON expense_categories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to update own categories"
  ON expense_categories
  FOR UPDATE
  TO anon, authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to delete own categories"
  ON expense_categories
  FOR DELETE
  TO anon, authenticated
  USING (auth.uid() = user_id);

-- Step 8: Verify table was created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'expense_categories' 
ORDER BY ordinal_position;

-- Step 9: Test query (should return empty or your categories)
SELECT * FROM expense_categories WHERE user_id = auth.uid();
