CREATE TABLE public.explorer_profiles (
  user_id UUID PRIMARY KEY,
  display_name TEXT,
  quiz_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.explorer_profiles TO authenticated;
GRANT ALL ON public.explorer_profiles TO service_role;
ALTER TABLE public.explorer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.explorer_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.explorer_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.explorer_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_explorer()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.explorer_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_explorer AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_explorer();

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER explorer_profiles_touch BEFORE UPDATE ON public.explorer_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();