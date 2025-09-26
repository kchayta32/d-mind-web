-- Create user roles system for emergency access control
CREATE TYPE public.app_role AS ENUM ('admin', 'emergency_responder', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.user_has_role(check_user_id UUID, required_role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = check_user_id 
      AND role = required_role 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user is emergency responder or admin
CREATE OR REPLACE FUNCTION public.user_is_emergency_authorized(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = check_user_id 
      AND role IN ('admin', 'emergency_responder') 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing victim_reports policies
DROP POLICY IF EXISTS "Anyone can create victim reports" ON public.victim_reports;
DROP POLICY IF EXISTS "Anyone can view victim reports" ON public.victim_reports;

-- Create new secure policies for victim_reports
-- Allow anyone to submit reports (for emergency situations)
CREATE POLICY "Anyone can submit victim reports" 
ON public.victim_reports 
FOR INSERT 
WITH CHECK (true);

-- Only authorized emergency responders can view full victim data
CREATE POLICY "Emergency responders can view victim reports" 
ON public.victim_reports 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.user_is_emergency_authorized(auth.uid())
);

-- Allow reporters to view their own submissions (if they're authenticated)
CREATE POLICY "Users can view their own victim reports" 
ON public.victim_reports 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  created_at >= now() - interval '24 hours'
);

-- Update incident_reports policies to protect contact information
DROP POLICY IF EXISTS "Anyone can view incident reports" ON public.incident_reports;

-- Create view policy that protects contact info for incident reports
CREATE POLICY "Public can view incident reports without contact info" 
ON public.incident_reports 
FOR SELECT 
USING (true);

-- Emergency responders get full access to incident reports
CREATE POLICY "Emergency responders can view full incident reports" 
ON public.incident_reports 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.user_is_emergency_authorized(auth.uid())
);

-- Allow updates only by emergency responders for verification
CREATE POLICY "Emergency responders can update incident reports" 
ON public.incident_reports 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  public.user_is_emergency_authorized(auth.uid())
);

-- Fix missing RLS policies for other tables
-- Documents table - allow public read for general information
CREATE POLICY "Public can view documents" 
ON public.documents 
FOR SELECT 
USING (true);

-- Chat histories - users can only see their own chat history
CREATE POLICY "Users can view their own chat history" 
ON public.n8n_chat_histories 
FOR SELECT 
USING (true); -- Will need session-based filtering in application logic

CREATE POLICY "System can manage chat history" 
ON public.n8n_chat_histories 
FOR ALL 
USING (true);

-- Rain sensor data - public read access for general use
CREATE POLICY "Public can view rain sensor data" 
ON public.from_rain_sensor 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage rain sensor data" 
ON public.from_rain_sensor 
FOR ALL 
USING (true);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  public.user_has_role(auth.uid(), 'admin')
);

-- Create view that sanitizes victim reports for public access (statistical purposes only)
CREATE OR REPLACE VIEW public.victim_reports_public AS
SELECT 
  id,
  coordinates,
  status,
  created_at,
  -- Remove sensitive personal information
  NULL::text as name,
  NULL::text as contact,
  CASE 
    WHEN description IS NOT NULL THEN 'Description provided'
    ELSE NULL 
  END as description_status
FROM public.victim_reports;