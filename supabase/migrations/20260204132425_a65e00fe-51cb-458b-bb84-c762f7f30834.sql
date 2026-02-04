-- Create budget_settings table for storing user's total budget
CREATE TABLE public.budget_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_budget NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own budget settings"
  ON public.budget_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget settings"
  ON public.budget_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget settings"
  ON public.budget_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_budget_settings_updated_at
  BEFORE UPDATE ON public.budget_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create budget_expenses table
CREATE TABLE public.budget_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budget_expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own budget expenses"
  ON public.budget_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget expenses"
  ON public.budget_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget expenses"
  ON public.budget_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget expenses"
  ON public.budget_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_budget_expenses_updated_at
  BEFORE UPDATE ON public.budget_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();