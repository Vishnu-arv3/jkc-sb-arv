UPDATE storage.buckets SET public = false WHERE id = 'selfies';

DROP POLICY IF EXISTS "Selfies are publicly accessible" ON storage.objects;

CREATE POLICY "Users can read their own selfies" ON storage.objects
  FOR SELECT USING (bucket_id = 'selfies' AND auth.uid()::text = (storage.foldername(name))[1]);