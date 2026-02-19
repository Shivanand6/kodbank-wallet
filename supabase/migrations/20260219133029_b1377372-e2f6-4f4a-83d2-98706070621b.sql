
-- Drop overly permissive policies
DROP POLICY "Allow public registration insert" ON public.kod_user;
DROP POLICY "Users can read own data" ON public.kod_user;
DROP POLICY "Allow insert roles" ON public.user_roles;
DROP POLICY "Allow read roles" ON public.user_roles;
DROP POLICY "Allow insert tokens" ON public.user_token;
DROP POLICY "Allow read tokens" ON public.user_token;
DROP POLICY "Allow delete tokens" ON public.user_token;

-- Restrictive policies - all access goes through edge functions with service_role
CREATE POLICY "No direct access to kod_user" ON public.kod_user FOR ALL USING (false);
CREATE POLICY "No direct access to user_roles" ON public.user_roles FOR ALL USING (false);
CREATE POLICY "No direct access to user_token" ON public.user_token FOR ALL USING (false);
