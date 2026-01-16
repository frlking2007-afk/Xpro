-- Fix shift deletion by adding CASCADE DELETE to foreign key constraint
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_shift_id_fkey;

-- Step 2: Add new foreign key constraint with CASCADE DELETE
ALTER TABLE transactions
ADD CONSTRAINT transactions_shift_id_fkey
FOREIGN KEY (shift_id)
REFERENCES shifts(id)
ON DELETE CASCADE;

-- This means: when a shift is deleted, all related transactions will be automatically deleted too
