-- Allow unauthenticated (anon) users to read auth_config
DROP POLICY IF EXISTS "Authenticated users can read auth config" ON public.auth_config;
CREATE POLICY "Anyone can read auth config"
  ON public.auth_config FOR SELECT
  TO anon, authenticated
  USING (true);
