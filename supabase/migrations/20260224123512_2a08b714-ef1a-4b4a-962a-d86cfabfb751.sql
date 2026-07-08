
-- Table to store pending bonus credits for users who haven't registered yet
CREATE TABLE public.pending_bonus_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  bonus_credits INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (service role only - no direct user access needed)
ALTER TABLE public.pending_bonus_credits ENABLE ROW LEVEL SECURITY;

-- Insert the two pending bonuses
INSERT INTO public.pending_bonus_credits (email, bonus_credits, reason)
VALUES
  ('dannychuch@yahoo.com', 20, 'Feedback participation reward'),
  ('a13148467632@gmail.com', 20, 'Feedback participation reward');
