import concurrent.futures
import time
import logging
from datetime import datetime, timezone

from config import (
    TABLE_NATURAL_DISASTERS,
    TABLE_DISASTER_HAZARDS,
    TABLE_WEATHER_FORECASTS
)
from supabase_client import supabase_db
from .natural_disasters import NaturalDisasterScraper
from .disaster_hazards import DisasterHazardScraper
from .weather_forecasts import WeatherForecastScraper

logger = logging.getLogger("ScraperRunner")

class ScraperRunner:
    """
    Coordinates and executes all web scrapers concurrently,
    then automatically ingests separated data into Supabase tables.
    """
    def __init__(self):
        self.natural_scraper = NaturalDisasterScraper()
        self.hazard_scraper = DisasterHazardScraper()
        self.forecast_scraper = WeatherForecastScraper()
        self.is_running = False
        self.last_run_time = None
        self.last_results = {}

    def run_all(self):
        """Runs all scraping tasks concurrently and stores data into separate Supabase tables."""
        if self.is_running:
            logger.warning("Scraper is already running in background.")
            return {"status": "already_running", "message": "ระบบกำลังดึงข้อมูลอยู่ในขณะนี้"}

        self.is_running = True
        start_time = time.time()
        logger.info(">>> Starting automated web scraping across all disaster & forecast sources...")

        results = {
            "natural_disasters": {"scraped": 0, "inserted": 0, "status": "pending"},
            "disaster_hazards": {"scraped": 0, "inserted": 0, "status": "pending"},
            "weather_forecasts": {"scraped": 0, "inserted": 0, "status": "pending"},
        }

        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                future_natural = executor.submit(self.natural_scraper.scrape_all)
                future_hazard = executor.submit(self.hazard_scraper.scrape_all)
                future_forecast = executor.submit(self.forecast_scraper.scrape_all)

                # Process natural disasters
                try:
                    natural_items = future_natural.result(timeout=30)
                    inserted_nat = supabase_db.insert_items(TABLE_NATURAL_DISASTERS, natural_items)
                    results["natural_disasters"] = {
                        "scraped": len(natural_items),
                        "inserted": inserted_nat,
                        "status": "success"
                    }
                except Exception as e:
                    logger.error(f"Error in natural disaster scraper: {e}")
                    results["natural_disasters"]["status"] = f"error: {str(e)}"

                # Process disaster hazards
                try:
                    hazard_items = future_hazard.result(timeout=30)
                    inserted_haz = supabase_db.insert_items(TABLE_DISASTER_HAZARDS, hazard_items)
                    results["disaster_hazards"] = {
                        "scraped": len(hazard_items),
                        "inserted": inserted_haz,
                        "status": "success"
                    }
                except Exception as e:
                    logger.error(f"Error in disaster hazard scraper: {e}")
                    results["disaster_hazards"]["status"] = f"error: {str(e)}"

                # Process weather forecasts
                try:
                    forecast_items = future_forecast.result(timeout=30)
                    inserted_for = supabase_db.insert_items(TABLE_WEATHER_FORECASTS, forecast_items)
                    results["weather_forecasts"] = {
                        "scraped": len(forecast_items),
                        "inserted": inserted_for,
                        "status": "success"
                    }
                except Exception as e:
                    logger.error(f"Error in weather forecast scraper: {e}")
                    results["weather_forecasts"]["status"] = f"error: {str(e)}"

            elapsed = round(time.time() - start_time, 2)
            self.last_run_time = datetime.now(timezone.utc).isoformat()
            self.last_results = results

            total_scraped = sum(v.get("scraped", 0) for v in results.values())
            total_inserted = sum(v.get("inserted", 0) for v in results.values())

            logger.info(f"<<< Scraping finished in {elapsed}s. Total Scraped: {total_scraped}, Total New Inserted: {total_inserted}")

            return {
                "status": "success",
                "elapsed_seconds": elapsed,
                "timestamp": self.last_run_time,
                "summary": {
                    "total_scraped": total_scraped,
                    "total_inserted": total_inserted
                },
                "details": results
            }
        finally:
            self.is_running = False

# Global runner instance
scraper_runner = ScraperRunner()
