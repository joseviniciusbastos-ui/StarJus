-- Storage Policies for client-documents bucket
-- Run this manually in Supabase SQL Editor after creating bucket

-- Create storage policies for client documents
CREATE POLICY "Users can view documents from their office"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-documents' AND
  auth.uid() IN (
    SELECT om.user_id 
    FROM office_members om
    JOIN client_documents cd ON cd.office_id = om.office_id
    WHERE cd.file_path = storage.objects.name
  )
);

CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'client-documents' AND
  auth.uid() IN (
    SELECT user_id FROM office_members
    WHERE role IN ('owner', 'admin', 'member')
  )
);

CREATE POLICY "Only admins can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'client-documents' AND
  auth.uid() IN (
    SELECT user_id FROM office_members
    WHERE role IN ('owner', 'admin')
  )
);
