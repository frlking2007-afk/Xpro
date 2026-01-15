-- ============================================
-- QUICK FIX: Create user_profiles table
-- ============================================
-- Copy this entire SQL code to Supabase SQL Editor and run it

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Step 3: Create updated_at trigger function (if doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow anon and authenticated to read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow anon and authenticated to insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow anon and authenticated to update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow anon and authenticated to delete own profile" ON user_profiles;

-- Step 7: Create new policies for anon and authenticated
CREATE POLICY "Allow anon and authenticated to read own profile"
    ON user_profiles FOR SELECT
    TO anon, authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to insert own profile"
    ON user_profiles FOR INSERT
    TO anon, authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to update own profile"
    ON user_profiles FOR UPDATE
    TO anon, authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow anon and authenticated to delete own profile"
    ON user_profiles FOR DELETE
    TO anon, authenticated
    USING (auth.uid() = user_id);

-- Step 8: Verify table was created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Step 9: Test query (should return empty or your profile)
SELECT * FROM user_profiles WHERE user_id = auth.uid();
