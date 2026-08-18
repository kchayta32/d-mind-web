import requests
import re
import urllib3
import logging
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import dateutil.parser

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("BaseScraper")

DEFAULT_IMAGES = {
    "earthquake": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&auto=format&fit=crop&q=80",
    "flood": "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80",
    "storm": "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80",
    "tsunami": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=80",
    "landslide": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    "fire": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80",
    "pm25_crisis": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=80",
    "chemical_spill": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80",
    "drought": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
    "daily_forecast": "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&auto=format&fit=crop&q=80",
    "heavy_rain_warning": "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&auto=format&fit=crop&q=80",
    "marine_warning": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    "default": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
}

class BaseScraper:
    def __init__(self, name="BaseScraper"):
        self.name = name
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8",
            "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    def fetch(self, url, params=None, timeout=12, json_mode=False):
        """Fetches URL with automatic encoding detection and SSL fallback."""
        try:
            res = requests.get(url, headers=self.headers, params=params, timeout=timeout, verify=False)
            res.raise_for_status()
            
            # Detect and set encoding for Thai content
            if res.encoding is None or res.encoding == 'ISO-8859-1':
                res.encoding = 'utf-8'
                
            if json_mode:
                return res.json()
            return res.text
        except Exception as e:
            logger.warning(f"[{self.name}] Error fetching {url}: {e}")
            return None

    def clean_text(self, text):
        """Removes HTML tags, multiple spaces, and normalizes Thai text."""
        if not text:
            return ""
        # Remove HTML only if markup tags exist
        if "<" in text and ">" in text:
            try:
                text = BeautifulSoup(text, "html.parser").get_text(separator=" ")
            except Exception:
                pass
        # Clean extra whitespaces
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def get_image(self, item_type, custom_image=None):
        """Returns valid image URL with proper fallback."""
        if custom_image and custom_image.startswith("http") and not custom_image.endswith("svg"):
            return custom_image
        return DEFAULT_IMAGES.get(item_type, DEFAULT_IMAGES["default"])

    def parse_thai_date(self, date_str):
        """Converts common Thai/ISO date formats into standard ISO timestamp."""
        if not date_str:
            return datetime.now(timezone.utc).isoformat()

        # Month mapping
        thai_months = {
            'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
            'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
            'มกราคม': 1, 'กุมภาพันธ์': 2, 'มีนาคม': 3, 'เมษายน': 4, 'พฤษภาคม': 5, 'มิถุนายน': 6,
            'กรกฎาคม': 7, 'สิงหาคม': 8, 'กันยายน': 9, 'ตุลาคม': 10, 'พฤศจิกายน': 11, 'ธันวาคม': 12
        }

        try:
            # Check for Thai date string like '18 สิงหาคม 2569 เวลา 11:34 น.'
            match = re.search(r'(\d{1,2})\s+([^\s\d]+)\s+(\d{4})(?:\s+.*(\d{1,2}):(\d{2}))?', date_str)
            if match:
                day = int(match.group(1))
                m_name = match.group(2)
                year = int(match.group(3))
                # If Buddhist Era (BE > 2400), convert to CE
                if year > 2400:
                    year -= 543
                month = thai_months.get(m_name, 1)
                hour = int(match.group(4)) if match.group(4) else 0
                minute = int(match.group(5)) if match.group(5) else 0
                dt = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
                return dt.isoformat()

            # Try dateutil parser
            parsed = dateutil.parser.parse(date_str)
            if not parsed.tzinfo:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.isoformat()
        except Exception:
            return datetime.now(timezone.utc).isoformat()
