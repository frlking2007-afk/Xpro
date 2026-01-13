-- Add category column to transactions table for expense categorization
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Add comment
COMMENT ON COLUMN transactions.category IS 'Category name for expense transactions (xarajat type only)';
