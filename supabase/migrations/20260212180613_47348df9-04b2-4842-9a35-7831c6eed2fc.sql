
-- Table to track when users accepted the master disclaimer
CREATE TABLE public.disclaimer_acceptances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.disclaimer_acceptances ENABLE ROW LEVEL SECURITY;

-- Users can read their own acceptance
CREATE POLICY "Users can view own disclaimer acceptance"
  ON public.disclaimer_acceptances FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own acceptance
CREATE POLICY "Users can insert own disclaimer acceptance"
  ON public.disclaimer_acceptances FOR INSERT
  WITH CHECK (auth.uid() = user_id);
