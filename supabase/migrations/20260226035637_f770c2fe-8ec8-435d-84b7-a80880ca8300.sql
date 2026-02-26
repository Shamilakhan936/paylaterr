
-- Widget configurations per product per user
CREATE TABLE public.widget_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'Default Widget',
  color_primary TEXT NOT NULL DEFAULT '#6366f1',
  color_secondary TEXT NOT NULL DEFAULT '#8b5cf6',
  color_accent TEXT NOT NULL DEFAULT '#06b6d4',
  color_background TEXT NOT NULL DEFAULT '#ffffff',
  color_text TEXT NOT NULL DEFAULT '#1e293b',
  color_border TEXT NOT NULL DEFAULT '#e2e8f0',
  border_radius INTEGER NOT NULL DEFAULT 8,
  font_family TEXT NOT NULL DEFAULT 'Inter',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.widget_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own widget configs"
  ON public.widget_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own widget configs"
  ON public.widget_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own widget configs"
  ON public.widget_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own widget configs"
  ON public.widget_configs FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_widget_configs_updated_at
  BEFORE UPDATE ON public.widget_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Unique constraint: one config per product per user
CREATE UNIQUE INDEX idx_widget_configs_user_product ON public.widget_configs (user_id, product_id);
