
CREATE TABLE public.marketing_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit feedback
CREATE POLICY "Anyone can insert feedback"
  ON public.marketing_feedback
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.marketing_feedback
  FOR SELECT
  USING (auth.uid() = user_id);
