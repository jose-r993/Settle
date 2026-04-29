-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'painting', 'locks', 'internet', 'pest')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_user_id ON public.maintenance_requests(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON public.maintenance_requests(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_created_at ON public.maintenance_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own maintenance requests
CREATE POLICY "Users can view own maintenance requests"
  ON public.maintenance_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own maintenance requests
CREATE POLICY "Users can insert own maintenance requests"
  ON public.maintenance_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own maintenance requests
CREATE POLICY "Users can update own maintenance requests"
  ON public.maintenance_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own maintenance requests
CREATE POLICY "Users can delete own maintenance requests"
  ON public.maintenance_requests
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
