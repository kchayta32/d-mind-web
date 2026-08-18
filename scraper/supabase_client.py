import os
import json
import logging
import requests
from datetime import datetime, timezone
import hashlib

from config import (
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY,
    TABLE_NATURAL_DISASTERS,
    TABLE_DISASTER_HAZARDS,
    TABLE_WEATHER_FORECASTS
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("SupabaseClient")

class SupabaseManager:
    """
    Manages all database operations for Disaster and Weather Forecast tables in Supabase.
    Includes automated deduplication, query filters, search, and local cache fallback.
    """
    def __init__(self):
        self.base_url = SUPABASE_URL.rstrip('/') + '/rest/v1/'
        self.service_key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
        self.anon_key = SUPABASE_ANON_KEY
        
        self.headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Local JSON cache directory for fallback and offline persistence
        self.cache_dir = os.path.join(os.path.dirname(__file__), "data_cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        
        self.table_status = {}
        self.check_all_tables()

    def _get_cache_file(self, table_name):
        return os.path.join(self.cache_dir, f"{table_name}.json")

    def _read_local_cache(self, table_name):
        path = self._get_cache_file(table_name)
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error reading local cache for {table_name}: {e}")
        return []

    def _write_local_cache(self, table_name, items):
        path = self._get_cache_file(table_name)
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error writing local cache for {table_name}: {e}")

    def check_table_exists(self, table_name):
        """Checks if a table exists in Supabase schema."""
        try:
            url = f"{self.base_url}{table_name}?select=id&limit=1"
            res = requests.get(url, headers=self.headers, timeout=6)
            exists = (res.status_code == 200)
            self.table_status[table_name] = exists
            return exists
        except Exception as e:
            logger.warning(f"Failed to check table {table_name} on Supabase: {e}")
            self.table_status[table_name] = False
            return False

    def check_all_tables(self):
        """Verifies existence of all 3 required tables."""
        for tbl in [TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS]:
            self.check_table_exists(tbl)
        return self.table_status

    def _generate_hash(self, item):
        """Generates unique hash key based on title, source, and event time for deduplication."""
        unique_str = f"{item.get('title', '')}_{item.get('source_name', '')}_{item.get('source_url', '')}_{item.get('event_time', '')}_{item.get('incident_time', '')}"
        return hashlib.md5(unique_str.encode('utf-8')).hexdigest()

    def insert_items(self, table_name, new_items):
        """
        Inserts new items into the specified Supabase table with deduplication.
        Also persists into local cache as a reliable buffer.
        """
        if not new_items:
            return 0

        # Read local cache for deduplication
        cached = self._read_local_cache(table_name)
        existing_hashes = {self._generate_hash(x) for x in cached}
        existing_titles = {x.get("title", "").strip().lower() for x in cached if x.get("title")}

        items_to_add = []
        for item in new_items:
            h = self._generate_hash(item)
            title = item.get("title", "").strip().lower()
            if h not in existing_hashes and title not in existing_titles:
                # Add ISO timestamp if missing
                if "created_at" not in item:
                    item["created_at"] = datetime.now(timezone.utc).isoformat()
                items_to_add.append(item)
                existing_hashes.add(h)
                existing_titles.add(title)

        if not items_to_add:
            logger.info(f"No new unique items to insert into {table_name}.")
            return 0

        # Update local cache
        updated_cache = items_to_add + cached
        # Keep up to 500 items in cache
        updated_cache = updated_cache[:500]
        self._write_local_cache(table_name, updated_cache)

        # Attempt to insert into Supabase if table exists
        supabase_inserted = 0
        if self.table_status.get(table_name, False) or self.check_table_exists(table_name):
            try:
                url = f"{self.base_url}{table_name}"
                res = requests.post(url, headers=self.headers, json=items_to_add, timeout=12)
                if res.status_code in [200, 201]:
                    supabase_inserted = len(items_to_add)
                    logger.info(f"Successfully inserted {supabase_inserted} items into Supabase table '{table_name}'.")
                else:
                    logger.warning(f"Supabase insert warning for {table_name} ({res.status_code}): {res.text}")
            except Exception as e:
                logger.error(f"Error inserting into Supabase table {table_name}: {e}")
        else:
            logger.info(f"Table '{table_name}' not yet created in Supabase. Saved {len(items_to_add)} items into local database cache.")

        return len(items_to_add)

    def get_items(self, table_name, limit=50, offset=0, severity=None, search=None):
        """
        Retrieves items from Supabase or local cache fallback.
        """
        items = []
        # 1. Try Supabase REST if available
        if self.table_status.get(table_name, False):
            try:
                params = [f"select=*", f"limit={limit}", f"offset={offset}", "order=created_at.desc"]
                if severity:
                    params.append(f"severity_level=eq.{severity}")
                if search:
                    params.append(f"title=ilike.*{search}*")
                
                query_url = f"{self.base_url}{table_name}?" + "&".join(params)
                res = requests.get(query_url, headers=self.headers, timeout=8)
                if res.status_code == 200:
                    items = res.json()
            except Exception as e:
                logger.warning(f"Error fetching from Supabase table {table_name}: {e}. Falling back to cache.")

        # 2. If Supabase returned empty or is not yet configured, use local cache
        if not items:
            items = self._read_local_cache(table_name)
            # Apply in-memory filters
            if severity:
                items = [x for x in items if x.get("severity_level") == severity or x.get("warning_level") == severity]
            if search:
                s = search.lower()
                items = [x for x in items if s in x.get("title", "").lower() or s in x.get("description", "").lower() or s in x.get("province", "").lower()]
            
            # Sort by created_at or event_time desc
            items.sort(key=lambda x: x.get("created_at") or x.get("event_time") or "", reverse=True)
            items = items[offset:offset+limit]

        # Add category tag to each item
        for item in items:
            item["table_source"] = table_name
            if table_name == TABLE_NATURAL_DISASTERS:
                item["category_label"] = "ภัยธรรมชาติ"
                item["category_icon"] = "🌊"
                item["category_id"] = "natural"
            elif table_name == TABLE_DISASTER_HAZARDS:
                item["category_label"] = "ภัยพิบัติและเหตุฉุกเฉิน"
                item["category_icon"] = "🔥"
                item["category_id"] = "hazard"
            elif table_name == TABLE_WEATHER_FORECASTS:
                item["category_label"] = "พยากรณ์อากาศและเตือนภัย"
                item["category_icon"] = "🌦️"
                item["category_id"] = "forecast"

        return items

    def get_all_news(self, limit=60, category=None, severity=None, source=None, search=None):
        """
        Retrieves unified news stream across all 3 tables with unified filtering.
        """
        all_news = []
        tables_to_query = []

        if not category or category == "all":
            tables_to_query = [TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS]
        elif category == "natural":
            tables_to_query = [TABLE_NATURAL_DISASTERS]
        elif category == "hazard":
            tables_to_query = [TABLE_DISASTER_HAZARDS]
        elif category == "forecast":
            tables_to_query = [TABLE_WEATHER_FORECASTS]

        for tbl in tables_to_query:
            table_items = self.get_items(tbl, limit=100, severity=severity, search=search)
            all_news.extend(table_items)

        # Filter by source if requested
        if source and source != "all":
            all_news = [x for x in all_news if source.lower() in x.get("source_name", "").lower()]

        # Filter by general search keyword across title, desc, province
        if search:
            q = search.strip().lower()
            all_news = [
                x for x in all_news
                if q in str(x.get("title", "")).lower()
                or q in str(x.get("description", "")).lower()
                or q in str(x.get("summary", "")).lower()
                or q in str(x.get("location_name", "")).lower()
                or q in str(x.get("province", "")).lower()
            ]

        # Sort all news by latest timestamp
        def parse_item_time(item):
            t_str = item.get("event_time") or item.get("incident_time") or item.get("created_at") or ""
            return t_str

        all_news.sort(key=parse_item_time, reverse=True)
        return all_news[:limit]

    def get_stats(self):
        """
        Calculates aggregated statistics across the three tables.
        """
        counts = {
            TABLE_NATURAL_DISASTERS: len(self._read_local_cache(TABLE_NATURAL_DISASTERS)),
            TABLE_DISASTER_HAZARDS: len(self._read_local_cache(TABLE_DISASTER_HAZARDS)),
            TABLE_WEATHER_FORECASTS: len(self._read_local_cache(TABLE_WEATHER_FORECASTS)),
        }
        total_count = sum(counts.values())

        # Collect severity distribution
        severity_counts = {
            "วิกฤต/รุนแรง": 0,
            "เตือนภัย": 0,
            "เฝ้าระวัง": 0,
            "ปกติ": 0
        }

        all_items = (
            self._read_local_cache(TABLE_NATURAL_DISASTERS) +
            self._read_local_cache(TABLE_DISASTER_HAZARDS) +
            self._read_local_cache(TABLE_WEATHER_FORECASTS)
        )

        for itm in all_items:
            sev = itm.get("severity_level") or itm.get("warning_level") or ""
            if "วิกฤต" in sev or "รุนแรง" in sev or "ฉุกเฉิน" in sev:
                severity_counts["วิกฤต/รุนแรง"] += 1
            elif "เตือน" in sev:
                severity_counts["เตือนภัย"] += 1
            elif "เฝ้าระวัง" in sev:
                severity_counts["เฝ้าระวัง"] += 1
            else:
                severity_counts["ปกติ"] += 1

        # Check Supabase live connectivity
        supabase_connected = any(self.table_status.values()) or self.check_table_exists(TABLE_NATURAL_DISASTERS)

        return {
            "total_news": total_count,
            "counts": {
                "natural_disasters": counts[TABLE_NATURAL_DISASTERS],
                "disaster_hazards": counts[TABLE_DISASTER_HAZARDS],
                "weather_forecasts": counts[TABLE_WEATHER_FORECASTS],
            },
            "severity": severity_counts,
            "supabase_status": {
                "url": SUPABASE_URL,
                "connected": supabase_connected,
                "tables": self.table_status
            },
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

    def get_map_points(self):
        """
        Extracts geographic coordinates for all active disaster events and weather warnings.
        """
        points = []
        natural_items = self._read_local_cache(TABLE_NATURAL_DISASTERS)
        hazard_items = self._read_local_cache(TABLE_DISASTER_HAZARDS)

        for item in natural_items:
            lat = item.get("latitude")
            lng = item.get("longitude")
            if lat is not None and lng is not None:
                try:
                    points.append({
                        "id": item.get("id", ""),
                        "title": item.get("title", ""),
                        "category": "natural",
                        "type": item.get("disaster_type", "disaster"),
                        "severity": item.get("severity_level", "เฝ้าระวัง"),
                        "lat": float(lat),
                        "lng": float(lng),
                        "magnitude": item.get("magnitude"),
                        "location": item.get("location_name") or item.get("province", ""),
                        "time": item.get("event_time", item.get("created_at", "")),
                        "source": item.get("source_name", "")
                    })
                except (ValueError, TypeError):
                    continue

        for item in hazard_items:
            meta = item.get("metadata", {})
            lat = meta.get("lat") or item.get("latitude")
            lng = meta.get("lng") or item.get("longitude")
            if lat is not None and lng is not None:
                try:
                    points.append({
                        "id": item.get("id", ""),
                        "title": item.get("title", ""),
                        "category": "hazard",
                        "type": item.get("hazard_type", "hazard"),
                        "severity": item.get("severity_level", "ปานกลาง"),
                        "lat": float(lat),
                        "lng": float(lng),
                        "location": item.get("location_name") or item.get("province", ""),
                        "time": item.get("incident_time", item.get("created_at", "")),
                        "source": item.get("source_name", "")
                    })
                except (ValueError, TypeError):
                    continue

        return points

# Global singleton instance
supabase_db = SupabaseManager()
