-- Add OAuth provider tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
ADD COLUMN IF NOT EXISTS oauth_provider_id TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_profiles_oauth_provider ON public.profiles(oauth_provider, oauth_provider_id);

-- Update the handle_new_user function to support OAuth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    role,
    oauth_provider,
    oauth_provider_id,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    'user',
    NEW.raw_app_meta_data->>'provider',
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add OAuth configuration to auth_config
INSERT INTO public.auth_config (config_key, config_value) 
VALUES ('oauth_providers', '{
  "google": {
    "enabled": true,
    "scopes": ["email", "profile"],
    "buttonText": "Continue with Google",
    "icon": "google"
  },
  "github": {
    "enabled": false,
    "scopes": ["user:email"],
    "buttonText": "Continue with GitHub",
    "icon": "github"
  },
  "azure": {
    "enabled": false,
    "scopes": ["email", "profile"],
    "buttonText": "Continue with Microsoft",
    "icon": "microsoft"
  }
}'::jsonb)
ON CONFLICT (config_key) 
DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  updated_at = timezone('utc'::text, now());

-- Create a function to get OAuth redirect URL
CREATE OR REPLACE FUNCTION public.get_oauth_redirect_url()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.settings.oauth_redirect_url', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.oauth_provider IS 'OAuth provider used for authentication (google, github, azure, etc.)';
COMMENT ON COLUMN public.profiles.oauth_provider_id IS 'Unique identifier from the OAuth provider';
COMMENT ON COLUMN public.profiles.avatar_url IS 'Profile picture URL from OAuth provider';
