-- ==============================================================================
-- Schema Definition for Disaster & Weather Forecast Web Scraping System
-- Project: Supabase PostgreSQL Database
-- Tables:
--   1. natural_disasters (ข้อมูลภัยธรรมชาติ)
--   2. disaster_hazards  (ข้อมูลภัยพิบัติและเหตุฉุกเฉิน)
--   3. weather_forecasts (ข้อมูลพยากรณ์ต่างๆ และสภาพอากาศเตือนภัย)
-- ==============================================================================

-- 1. Table: natural_disasters (ภัยธรรมชาติ)
CREATE TABLE IF NOT EXISTS public.natural_disasters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    disaster_type TEXT NOT NULL,          -- 'earthquake', 'flood', 'storm', 'tsunami', 'landslide', 'volcano'
    description TEXT,
    location_name TEXT,
    province TEXT,
    country TEXT DEFAULT 'Thailand',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    magnitude DOUBLE PRECISION,
    depth_km DOUBLE PRECISION,
    severity_level TEXT DEFAULT 'เฝ้าระวัง', -- 'เฝ้าระวัง', 'เตือนภัย', 'วิกฤต/รุนแรง'
    source_name TEXT NOT NULL,            -- 'กรมอุตุนิยมวิทยา TMD', 'USGS', 'GDACS', 'ปภ. DDPM'
    source_url TEXT,
    image_url TEXT,
    event_time TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table: disaster_hazards (ภัยพิบัติและเหตุฉุกเฉิน)
CREATE TABLE IF NOT EXISTS public.disaster_hazards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    hazard_type TEXT NOT NULL,            -- 'fire', 'pm25_crisis', 'chemical_spill', 'industrial_accident', 'drought'
    description TEXT,
    location_name TEXT,
    province TEXT,
    severity_level TEXT DEFAULT 'ปานกลาง', -- 'ปานกลาง', 'รุนแรง', 'วิกฤตฉุกเฉิน'
    status TEXT DEFAULT 'กำลังเกิดขึ้น',   -- 'กำลังเกิดขึ้น', 'อยู่ระหว่างระงับเหตุ', 'คลี่คลายแล้ว'
    source_name TEXT NOT NULL,            -- 'Air4Thai คพ.', 'ปภ.', 'Thai PBS', 'ข่าวสด'
    source_url TEXT,
    image_url TEXT,
    incident_time TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: weather_forecasts (พยากรณ์ต่างๆ และสภาพอากาศเตือนภัย)
CREATE TABLE IF NOT EXISTS public.weather_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    forecast_type TEXT NOT NULL,          -- 'daily_forecast', 'heavy_rain_warning', 'marine_warning', 'heat_index', '7day_forecast'
    summary TEXT,
    detail TEXT,
    target_region TEXT,                   -- 'ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคกลาง', 'ภาคตะวันออก', 'ภาคใต้', 'กรุงเทพฯและปริมณฑล', 'ทั่วประเทศ'
    province TEXT,
    forecast_period TEXT,                 -- 'ประจำวัน', '24 ชั่วโมงข้างหน้า', '7 วันข้างหน้า'
    warning_level TEXT DEFAULT 'ปกติ',    -- 'ปกติ', 'เฝ้าระวัง', 'เตือนภัยฝนตกหนัก', 'เตือนภัยคลื่นลมแรง'
    temperature_max DOUBLE PRECISION,
    temperature_min DOUBLE PRECISION,
    rainfall_probability TEXT,
    source_name TEXT NOT NULL,            -- 'กรมอุตุนิยมวิทยา TMD', 'Open-Meteo Weather Center', 'สสน. HII'
    source_url TEXT,
    image_url TEXT,
    valid_from TIMESTAMPTZ,
    valid_to TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Create Indexes for Efficient Filtering and Search
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_natural_disasters_type ON public.natural_disasters (disaster_type);
CREATE INDEX IF NOT EXISTS idx_natural_disasters_severity ON public.natural_disasters (severity_level);
CREATE INDEX IF NOT EXISTS idx_natural_disasters_event_time ON public.natural_disasters (event_time DESC);
CREATE INDEX IF NOT EXISTS idx_natural_disasters_province ON public.natural_disasters (province);

CREATE INDEX IF NOT EXISTS idx_disaster_hazards_type ON public.disaster_hazards (hazard_type);
CREATE INDEX IF NOT EXISTS idx_disaster_hazards_severity ON public.disaster_hazards (severity_level);
CREATE INDEX IF NOT EXISTS idx_disaster_hazards_incident_time ON public.disaster_hazards (incident_time DESC);

CREATE INDEX IF NOT EXISTS idx_weather_forecasts_type ON public.weather_forecasts (forecast_type);
CREATE INDEX IF NOT EXISTS idx_weather_forecasts_region ON public.weather_forecasts (target_region);
CREATE INDEX IF NOT EXISTS idx_weather_forecasts_created ON public.weather_forecasts (created_at DESC);

-- ==============================================================================
-- Enable Row Level Security (RLS) and grant read-access to anon & authenticated
-- ==============================================================================
ALTER TABLE public.natural_disasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_forecasts ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'natural_disasters' AND policyname = 'Public Read natural_disasters') THEN
        CREATE POLICY "Public Read natural_disasters" ON public.natural_disasters FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disaster_hazards' AND policyname = 'Public Read disaster_hazards') THEN
        CREATE POLICY "Public Read disaster_hazards" ON public.disaster_hazards FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weather_forecasts' AND policyname = 'Public Read weather_forecasts') THEN
        CREATE POLICY "Public Read weather_forecasts" ON public.weather_forecasts FOR SELECT USING (true);
    END IF;
    
    -- Allow Service Role Full Access
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'natural_disasters' AND policyname = 'Service Role All natural_disasters') THEN
        CREATE POLICY "Service Role All natural_disasters" ON public.natural_disasters FOR ALL TO service_role USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disaster_hazards' AND policyname = 'Service Role All disaster_hazards') THEN
        CREATE POLICY "Service Role All disaster_hazards" ON public.disaster_hazards FOR ALL TO service_role USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weather_forecasts' AND policyname = 'Service Role All weather_forecasts') THEN
        CREATE POLICY "Service Role All weather_forecasts" ON public.weather_forecasts FOR ALL TO service_role USING (true);
    END IF;
END $$;
