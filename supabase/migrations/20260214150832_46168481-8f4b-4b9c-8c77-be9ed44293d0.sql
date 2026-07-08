
-- Create analysis_history table for logging AI reports
CREATE TABLE public.analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL, -- 'stock' or 'game'
  model_used TEXT NOT NULL,  -- e.g. 'Elon', 'RSI', 'Phoenix'
  symbol TEXT,               -- stock symbol or game identifier
  report_data JSONB,         -- full report JSON for reconstruction
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own history
CREATE POLICY "Users can view own analysis history"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own analysis history"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete own analysis history"
  ON public.analysis_history FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
