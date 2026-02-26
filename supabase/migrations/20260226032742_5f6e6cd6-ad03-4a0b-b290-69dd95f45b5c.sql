
-- Drop the overly permissive policy
DROP POLICY "Service can insert request logs" ON public.api_request_logs;

-- Replace with a policy that only allows the service role (via auth.uid check for authenticated users)
-- Edge functions use service_role key which bypasses RLS, so no INSERT policy needed for them
-- This ensures no regular user can insert logs directly
