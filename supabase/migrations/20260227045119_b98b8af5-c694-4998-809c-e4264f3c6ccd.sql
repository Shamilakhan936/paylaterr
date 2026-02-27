
-- Installment Schedules: generated payment schedules for BNPL, Bills, etc.
CREATE TABLE public.installment_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product TEXT NOT NULL DEFAULT 'bnpl_bills',
  customer_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  installment_count INTEGER NOT NULL DEFAULT 4,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.installment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedules" ON public.installment_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own schedules" ON public.installment_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schedules" ON public.installment_schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own schedules" ON public.installment_schedules FOR DELETE USING (auth.uid() = user_id);

-- Installment Items: individual payment line items within a schedule
CREATE TABLE public.installment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.installment_schedules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.installment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items" ON public.installment_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own items" ON public.installment_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.installment_items FOR UPDATE USING (auth.uid() = user_id);

-- Autopay Configs
CREATE TABLE public.autopay_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  schedule_id UUID NOT NULL REFERENCES public.installment_schedules(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL DEFAULT 'ach',
  account_last4 TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  retry_on_failure BOOLEAN NOT NULL DEFAULT true,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.autopay_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own autopay" ON public.autopay_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own autopay" ON public.autopay_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own autopay" ON public.autopay_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own autopay" ON public.autopay_configs FOR DELETE USING (auth.uid() = user_id);

-- Ledger Entries: double-entry style transaction log
CREATE TABLE public.ledger_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  schedule_id UUID REFERENCES public.installment_schedules(id) ON DELETE SET NULL,
  entry_type TEXT NOT NULL,
  debit NUMERIC NOT NULL DEFAULT 0,
  credit NUMERIC NOT NULL DEFAULT 0,
  balance_after NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ledger" ON public.ledger_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own ledger" ON public.ledger_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Late Fee Rules
CREATE TABLE public.late_fee_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product TEXT NOT NULL DEFAULT 'bnpl_bills',
  grace_period_days INTEGER NOT NULL DEFAULT 5,
  fee_type TEXT NOT NULL DEFAULT 'flat',
  fee_amount NUMERIC NOT NULL DEFAULT 0,
  fee_percentage NUMERIC NOT NULL DEFAULT 0,
  max_fee NUMERIC,
  compound BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.late_fee_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own late fee rules" ON public.late_fee_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own late fee rules" ON public.late_fee_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own late fee rules" ON public.late_fee_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own late fee rules" ON public.late_fee_rules FOR DELETE USING (auth.uid() = user_id);

-- Biller Disbursements
CREATE TABLE public.biller_disbursements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  schedule_id UUID REFERENCES public.installment_schedules(id) ON DELETE SET NULL,
  biller_name TEXT NOT NULL,
  biller_account TEXT,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  disbursed_at TIMESTAMPTZ,
  reference_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.biller_disbursements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disbursements" ON public.biller_disbursements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own disbursements" ON public.biller_disbursements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own disbursements" ON public.biller_disbursements FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_installment_schedules_updated_at BEFORE UPDATE ON public.installment_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_autopay_configs_updated_at BEFORE UPDATE ON public.autopay_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_late_fee_rules_updated_at BEFORE UPDATE ON public.late_fee_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
