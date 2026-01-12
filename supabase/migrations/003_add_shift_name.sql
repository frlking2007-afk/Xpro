-- Add name column to shifts table
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS name TEXT;

-- Set default name for existing shifts based on opened_at date
UPDATE shifts 
SET name = 'Smena ' || TO_CHAR(opened_at, 'DD.MM.YYYY HH24:MI')
WHERE name IS NULL;

-- Make name required for new shifts (set default in application code)
-- For now, we'll allow NULL but handle it in the application
