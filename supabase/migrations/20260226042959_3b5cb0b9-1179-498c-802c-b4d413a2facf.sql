
-- Create risk_rules table for configurable risk engine rules
CREATE TABLE public.risk_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  field TEXT NOT NULL,
  operator TEXT NOT NULL DEFAULT 'gte',
  threshold NUMERIC NOT NULL DEFAULT 0,
  risk_action TEXT NOT NULL DEFAULT 'flag',
  severity TEXT NOT NULL DEFAULT 'medium',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.risk_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own risk rules" ON public.risk_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own risk rules" ON public.risk_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own risk rules" ON public.risk_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own risk rules" ON public.risk_rules FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_risk_rules_updated_at
  BEFORE UPDATE ON public.risk_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
