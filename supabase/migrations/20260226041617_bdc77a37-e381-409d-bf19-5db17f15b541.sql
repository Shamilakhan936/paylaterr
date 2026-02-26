
CREATE TABLE public.payment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  installments INTEGER NOT NULL DEFAULT 4,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  next_payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment plans"
  ON public.payment_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment plans"
  ON public.payment_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment plans"
  ON public.payment_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment plans"
  ON public.payment_plans FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_payment_plans_updated_at
  BEFORE UPDATE ON public.payment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
