-- Replace the overly permissive INSERT policy on marketing_feedback
-- Require authentication to submit feedback
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.marketing_feedback;

CREATE POLICY "Authenticated users can insert feedback"
  ON public.marketing_feedback
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);