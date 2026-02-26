
-- Create linked_accounts table
CREATE TABLE public.linked_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  institution_name TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'checking',
  account_label TEXT,
  account_mask TEXT,
  status TEXT NOT NULL DEFAULT 'connected',
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own linked accounts" ON public.linked_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own linked accounts" ON public.linked_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own linked accounts" ON public.linked_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own linked accounts" ON public.linked_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_linked_accounts_updated_at
  BEFORE UPDATE ON public.linked_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
