# Load environment variables if .env exists
def _load_env():
    current = os.path.dirname(os.path.abspath(__file__))
    for _ in range(3):
        env_file = os.path.join(current, ".env")
        if os.path.isfile(env_file):
            try:
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"\'')
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass
            break
        current = os.path.dirname(current)

_load_env()

# Supabase Credentials & Settings
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://evxjnivabxdlgfvncdcu.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
# Service role key for backend data ingestion and table operations
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "") or os.environ.get("SUPABASE_SERVICE_KEY", "")

# Server Configuration
SERVER_PORT = int(os.environ.get("PORT", 5050))
DEBUG_MODE = os.environ.get("DEBUG", "True").lower() == "true"

# Scraper Settings
SCRAPE_INTERVAL_MINUTES = 30
REQUEST_TIMEOUT = 12
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 DisasterNewsBot/1.0"

# Table Names in Supabase
TABLE_NATURAL_DISASTERS = "natural_disasters"
TABLE_DISASTER_HAZARDS = "disaster_hazards"
TABLE_WEATHER_FORECASTS = "weather_forecasts"
