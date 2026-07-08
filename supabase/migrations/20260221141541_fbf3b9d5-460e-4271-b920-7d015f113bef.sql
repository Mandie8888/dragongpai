
-- Create a secure server-side function to deduct exactly 1 credit
CREATE OR REPLACE FUNCTION public.deduct_credit(p_report_type text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
BEGIN
  -- Validate input
  IF p_report_type IS NULL OR p_report_type NOT IN ('game', 'stock') THEN
    RAISE EXCEPTION 'Invalid report type';
  END IF;

  -- Get current balance with row lock
  SELECT credit_balance INTO current_balance
  FROM user_credits
  WHERE user_id = auth.uid()
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'No credit record found';
  END IF;

  IF current_balance <= 0 THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct exactly 1 credit
  UPDATE user_credits
  SET credit_balance = credit_balance - 1,
      updated_at = now()
  WHERE user_id = auth.uid();

  RETURN current_balance - 1;
END;
$$;

-- Remove the UPDATE policy so users cannot directly modify their credits
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
