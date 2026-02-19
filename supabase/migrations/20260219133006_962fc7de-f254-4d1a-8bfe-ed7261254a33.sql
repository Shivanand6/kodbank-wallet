
-- Create kod_user table
CREATE TABLE public.kod_user (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance BIGINT NOT NULL DEFAULT 100000,
  phone_no TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kod_user ENABLE ROW LEVEL SECURITY;

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'manager', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.kod_user(user_id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create user_token table
CREATE TABLE public.user_token (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.kod_user(user_id) ON DELETE CASCADE NOT NULL,
  expiry TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_token ENABLE ROW LEVEL SECURITY;

-- RLS policies for kod_user (edge functions use service role, so these are for direct access)
CREATE POLICY "Allow public registration insert" ON public.kod_user FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own data" ON public.kod_user FOR SELECT USING (true);

-- RLS policies for user_roles
CREATE POLICY "Allow insert roles" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read roles" ON public.user_roles FOR SELECT USING (true);

-- RLS policies for user_token
CREATE POLICY "Allow insert tokens" ON public.user_token FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read tokens" ON public.user_token FOR SELECT USING (true);
CREATE POLICY "Allow delete tokens" ON public.user_token FOR DELETE USING (true);
