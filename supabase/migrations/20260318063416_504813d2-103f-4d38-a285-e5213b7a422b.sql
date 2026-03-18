
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_instagram text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_twitter text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_facebook text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_seen_tutorial boolean NOT NULL DEFAULT false;
CREATE POLICY "Anyone can view public videos" ON public.videos FOR SELECT TO anon, authenticated USING (visibility = 'public');
