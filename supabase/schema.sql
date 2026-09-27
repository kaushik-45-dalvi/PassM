-- ==========================================================================
-- VaultSync - Complete Supabase PostgreSQL Schema (Clerk Auth Compatible)
-- ==========================================================================

-- 1. Create or Update Encrypted Vault Items table
-- All passwords and sensitive fields are encrypted client-side in the browser
-- with AES-256-GCM before being transmitted or stored. Zero-knowledge architecture.
CREATE TABLE IF NOT EXISTS public.vault_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    username TEXT,
    encrypted_password TEXT NOT NULL,
    iv TEXT NOT NULL,
    auth_tag TEXT,
    category TEXT DEFAULT 'Work' CHECK (category IN ('Work', 'Entertainment', 'Productivity', 'Shopping', 'Finance', 'Other')),
    strength TEXT DEFAULT 'Strong' CHECK (strength IN ('Strong', 'Moderate', 'Weak')),
    notes_encrypted TEXT,
    notes_iv TEXT,
    url TEXT,
    icon_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vault_items DROP CONSTRAINT IF EXISTS vault_items_category_check;
ALTER TABLE public.vault_items ADD CONSTRAINT vault_items_category_check
    CHECK (category IN ('Logins', 'Work', 'Entertainment', 'Productivity', 'Shopping', 'Finance', 'Other'));

-- Migration support: If table was previously created with auth.users foreign key, alter column to TEXT
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'vault_items_user_id_fkey'
    ) THEN
        ALTER TABLE public.vault_items DROP CONSTRAINT vault_items_user_id_fkey;
    END IF;
    
    ALTER TABLE public.vault_items ALTER COLUMN user_id TYPE TEXT;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Add the dedicated IV needed for notes in databases created before this field.
ALTER TABLE public.vault_items ADD COLUMN IF NOT EXISTS notes_iv TEXT;

-- 2. Indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_vault_items_user_id ON public.vault_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_items_category ON public.vault_items(category);


-- 3. Row-Level Security Configuration
-- Clerk identity is verified in the Next.js API, which is the only code allowed
-- to use the service-role key. Do not create an `USING (true)` policy here:
-- that would let any browser holding the public anon key read every vault.
ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_items FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user operations on vault_items" ON public.vault_items;

-- 4. Enable Realtime Sync for vault_items table
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_items;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
