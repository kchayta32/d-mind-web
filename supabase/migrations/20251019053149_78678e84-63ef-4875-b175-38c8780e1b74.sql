-- Create table for demo app surveys
CREATE TABLE public.demo_app_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gender TEXT NOT NULL,
  age TEXT NOT NULL,
  occupation TEXT NOT NULL,
  device TEXT NOT NULL,
  ux_ratings JSONB NOT NULL,
  useful_features TEXT[] NOT NULL DEFAULT '{}',
  likes TEXT,
  improvements TEXT,
  mobile_app_interest TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.demo_app_surveys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (anonymous surveys)
CREATE POLICY "Anyone can submit demo app surveys"
ON public.demo_app_surveys
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated users to view all surveys
CREATE POLICY "Authenticated users can view demo app surveys"
ON public.demo_app_surveys
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create table for booth surveys
CREATE TABLE public.booth_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gender TEXT NOT NULL,
  age TEXT NOT NULL,
  status TEXT NOT NULL,
  knew_before TEXT NOT NULL,
  booth_ratings JSONB NOT NULL,
  most_liked TEXT,
  improvements TEXT,
  follow_interest TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booth_surveys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (anonymous surveys)
CREATE POLICY "Anyone can submit booth surveys"
ON public.booth_surveys
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated users to view all surveys
CREATE POLICY "Authenticated users can view booth surveys"
ON public.booth_surveys
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_demo_app_surveys_created_at ON public.demo_app_surveys(created_at DESC);
CREATE INDEX idx_booth_surveys_created_at ON public.booth_surveys(created_at DESC);