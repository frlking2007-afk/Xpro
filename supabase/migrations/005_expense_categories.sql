-- Create expense_categories table to store user-specific expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own categories
CREATE POLICY "Users can view their own categories"
  ON expense_categories
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own categories
CREATE POLICY "Users can insert their own categories"
  ON expense_categories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own categories
CREATE POLICY "Users can update their own categories"
  ON expense_categories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own categories
CREATE POLICY "Users can delete their own categories"
  ON expense_categories
  FOR DELETE
  USING (auth.uid() = user_id);
