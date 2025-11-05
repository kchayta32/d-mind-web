-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('emergency_article', 'academic_article', 'guide')),
  layout_type TEXT NOT NULL DEFAULT 'auto' CHECK (layout_type IN ('auto', 'manual')),
  slug TEXT UNIQUE,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS policies for articles
CREATE POLICY "Anyone can view published articles"
ON public.articles
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all articles"
ON public.articles
FOR SELECT
USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create articles"
ON public.articles
FOR INSERT
WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update articles"
ON public.articles
FOR UPDATE
USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_articles_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_type ON public.articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);