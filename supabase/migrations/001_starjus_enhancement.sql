-- StarJus Database Schema Enhancement
-- This migration adds multi-currency support, permissions, and RLS policies

-- ============================================================================
-- PART 1: Enhance financial_records table for multi-currency
-- ============================================================================

ALTER TABLE financial_records 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'BRL',
ADD COLUMN IF NOT EXISTS amount_brl NUMERIC(15, 2),
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(10, 6) DEFAULT 1;

-- Update existing records to have BRL equivalents
UPDATE financial_records 
SET amount_brl = amount_numeric,
    currency = 'BRL',
    exchange_rate = 1
WHERE amount_brl IS NULL;

-- ============================================================================
-- PART 2: Create office_invites table for invite code system
-- ============================================================================

CREATE TABLE IF NOT EXISTS office_invites (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  office_id INTEGER NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_office_invites_code ON office_invites(code);
CREATE INDEX IF NOT EXISTS idx_office_invites_office ON office_invites(office_id);

-- ============================================================================
-- PART 3: Add role column to office_members
-- ============================================================================

ALTER TABLE office_members
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'member';

-- Set first member as owner
DO $$
DECLARE
  office_record RECORD;
  first_member_id UUID;
BEGIN
  FOR office_record IN SELECT id FROM offices LOOP
    SELECT user_id INTO first_member_id
    FROM office_members
    WHERE office_id = office_record.id
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_member_id IS NOT NULL THEN
      UPDATE office_members
      SET role = 'owner'
      WHERE office_id = office_record.id AND user_id = first_member_id;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 4: Create client_documents table for document management
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,  -- Supabase Storage path
  file_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  office_id INTEGER NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_documents_client ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_office ON client_documents(office_id);

-- ============================================================================
-- PART 5: RLS Policies for all tables
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE condominiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own office data" ON clients;
DROP POLICY IF EXISTS "Users can insert own office data" ON clients;
DROP POLICY IF EXISTS "Users can update own office data" ON clients;
DROP POLICY IF EXISTS "Users can delete own office data" ON clients;

-- Clients RLS Policies
CREATE POLICY "Users can view clients from their office"
  ON clients FOR SELECT
  USING (
    office_id IN (
      SELECT office_id FROM office_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert clients to their office"
  ON clients FOR INSERT
  WITH CHECK (
    office_id IN (
      SELECT office_id FROM office_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update clients in their office"
  ON clients FOR UPDATE
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Only admins can delete clients"
  ON clients FOR DELETE
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Processes RLS Policies
CREATE POLICY "Users can view processes from their office"
  ON processes FOR SELECT
  USING (
    office_id IN (
      SELECT office_id FROM office_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert processes to their office"
  ON processes FOR INSERT
  WITH CHECK (
    office_id IN (
      SELECT office_id FROM office_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update processes in their office"
  ON processes FOR UPDATE
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Only admins can delete processes"
  ON processes FOR DELETE
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Financial Records RLS Policies (Only admins)
CREATE POLICY "Only admins can view financial records"
  ON financial_records FOR SELECT
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Only admins can manage financial records"
  ON financial_records FOR ALL
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Client Documents RLS Policies
CREATE POLICY "Users can view documents from their office"
  ON client_documents FOR SELECT
  USING (
    office_id IN (
      SELECT office_id FROM office_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents"
  ON client_documents FOR INSERT
  WITH CHECK (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Only admins can delete documents"
  ON client_documents FOR DELETE
  USING (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Office Invites RLS
CREATE POLICY "Only admins can create invites"
  ON office_invites FOR INSERT
  WITH CHECK (
    office_id IN (
      SELECT office_id FROM office_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Anyone can view unused invites to redeem"
  ON office_invites FOR SELECT
  USING (used = FALSE AND expires_at > NOW());

-- ============================================================================
-- PART 6: Create Supabase Storage bucket for documents
-- ============================================================================

-- Note: This needs to be run via Supabase dashboard or API, not SQL
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('client-documents', 'client-documents', false);

-- Create storage policy for documents bucket
-- CREATE POLICY "Users can upload documents to their office"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'client-documents' AND
--   auth.uid() IN (
--     SELECT user_id FROM office_members
--   )
-- );

COMMENT ON TABLE financial_records IS 'Enhanced with multi-currency support and exchange rates';
COMMENT ON TABLE office_invites IS 'Invite code system for adding members to offices';
COMMENT ON TABLE client_documents IS 'Document storage metadata for client files';
