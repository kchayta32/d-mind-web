
-- Create damage_assessments table
CREATE TABLE public.damage_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incident_reports(id),
  image_url TEXT NOT NULL,
  original_filename TEXT,
  assessment_result JSONB NOT NULL DEFAULT '{}',
  damage_level TEXT CHECK (damage_level IN ('none', 'minor', 'moderate', 'severe', 'critical')),
  confidence_score DECIMAL(5,4) DEFAULT 0.0,
  detected_categories TEXT[] DEFAULT '{}',
  estimated_cost DECIMAL(15,2),
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.damage_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view damage assessments (public data)
CREATE POLICY "Anyone can view damage assessments" 
  ON public.damage_assessments 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow anyone to create damage assessments
CREATE POLICY "Anyone can create damage assessments" 
  ON public.damage_assessments 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow anyone to update damage assessments
CREATE POLICY "Anyone can update damage assessments" 
  ON public.damage_assessments 
  FOR UPDATE 
  TO public
  USING (true);

-- Create storage bucket for damage assessment images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('damage-assessment-images', 'damage-assessment-images', true);

-- Create policy for damage assessment images bucket with unique names
CREATE POLICY "Damage Assessment Select" ON storage.objects 
FOR SELECT TO public USING (bucket_id = 'damage-assessment-images');

CREATE POLICY "Damage Assessment Insert" ON storage.objects 
FOR INSERT TO public WITH CHECK (bucket_id = 'damage-assessment-images');

CREATE POLICY "Damage Assessment Update" ON storage.objects 
FOR UPDATE TO public USING (bucket_id = 'damage-assessment-images');

CREATE POLICY "Damage Assessment Delete" ON storage.objects 
FOR DELETE TO public USING (bucket_id = 'damage-assessment-images');

-- Create function to update assessment timestamps
CREATE OR REPLACE FUNCTION public.update_damage_assessment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_damage_assessments_updated_at
    BEFORE UPDATE ON public.damage_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_damage_assessment_updated_at();
