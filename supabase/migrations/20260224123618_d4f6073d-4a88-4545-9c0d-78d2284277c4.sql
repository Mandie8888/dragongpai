
-- Allow authenticated users to read their own pending bonuses (by email match)
CREATE POLICY "Users can view own pending bonuses"
ON public.pending_bonus_credits
FOR SELECT
USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- Allow authenticated users to mark their own bonuses as claimed
CREATE POLICY "Users can claim own bonuses"
ON public.pending_bonus_credits
FOR UPDATE
USING (lower(email) = lower(auth.jwt() ->> 'email'))
WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));
