import feedparser
import re
from datetime import datetime, timezone
from .base import BaseScraper, logger

class NaturalDisasterScraper(BaseScraper):
    """
    Scrapes natural disaster data (Earthquakes, Floods, Storms, Tsunamis, Landslides)
    from TMD, USGS, GDACS, and Thai Disaster agencies.
    """
    def __init__(self):
        super().__init__("NaturalDisasterScraper")

    def scrape_all(self):
        results = []
        results.extend(self.scrape_tmd_earthquakes())
        results.extend(self.scrape_usgs_earthquakes())
        results.extend(self.scrape_gdacs_disasters())
        logger.info(f"[{self.name}] Total natural disaster records scraped: {len(results)}")
        return results

    def scrape_tmd_earthquakes(self):
        """Scrapes earthquake feed from TMD Thailand."""
        items = []
        urls = [
            "https://earthquake.tmd.go.th/feed/rss_inside.xml",
            "https://earthquake.tmd.go.th/feed/rss_all.xml"
        ]

        for feed_url in urls:
            raw_content = self.fetch(feed_url)
            if not raw_content:
                continue

            feed = feedparser.parse(raw_content)
            for entry in feed.entries:
                try:
                    title = self.clean_text(entry.title)
                    link = entry.link
                    summary = self.clean_text(entry.get("summary", entry.title))
                    pub_date = entry.get("published", "")

                    # Extract coordinates (lat, lng)
                    # Example: แผ่นดินไหว ประเทศเมียนมา (21.796,96.512) ขนาด 2.5 วันที่ ...
                    coord_match = re.search(r'\(([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\)', title)
                    lat = float(coord_match.group(1)) if coord_match else None
                    lng = float(coord_match.group(2)) if coord_match else None

                    # Extract magnitude
                    mag_match = re.search(r'ขนาด\s*([\d\.]+)', title)
                    magnitude = float(mag_match.group(1)) if mag_match else None

                    # Extract location / province
                    loc_match = re.search(r'แผ่นดินไหว\s+(?:ประเทศ|อ\.|ต\.|จ\.)?([^\(\d]+)', title)
                    location = loc_match.group(1).strip() if loc_match else "ภูมิภาคเอเชียตะวันออกเฉียงใต้"
                    
                    province = "เมียนมา" if "เมียนมา" in title else "เวียดนาม" if "เวียดนาม" in title else "ลาว" if "ลาว" in title else ""
                    if "เชียงใหม่" in title: province = "เชียงใหม่"
                    elif "เชียงราย" in title: province = "เชียงราย"
                    elif "แม่ฮ่องสอน" in title: province = "แม่ฮ่องสอน"
                    elif "ลำปาง" in title: province = "ลำปาง"
                    elif "กาญจนบุรี" in title: province = "กาญจนบุรี"

                    # Determine severity
                    severity = "เฝ้าระวัง"
                    if magnitude:
                        if magnitude >= 5.5:
                            severity = "วิกฤต/รุนแรง"
                        elif magnitude >= 4.0:
                            severity = "เตือนภัย"

                    item = {
                        "title": title,
                        "disaster_type": "earthquake",
                        "description": f"รายงานเหตุแผ่นดินไหวจากกองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา: {summary}",
                        "location_name": location,
                        "province": province,
                        "country": "Thailand" if province and province not in ["เมียนมา", "เวียดนาม", "ลาว"] else "ประเทศเพื่อนบ้าน/ภูมิภาค",
                        "latitude": lat,
                        "longitude": lng,
                        "magnitude": magnitude,
                        "depth_km": 10.0,
                        "severity_level": severity,
                        "source_name": "กองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา TMD",
                        "source_url": link,
                        "image_url": self.get_image("earthquake"),
                        "event_time": self.parse_thai_date(pub_date or title),
                        "metadata": {
                            "origin_feed": feed_url,
                            "original_title": entry.title
                        }
                    }
                    items.append(item)
                except Exception as e:
                    logger.debug(f"Error parsing TMD item: {e}")

        return items

    def scrape_usgs_earthquakes(self):
        """Scrapes USGS Real-Time Earthquakes (Focusing on M3.0+ SE Asia & Significant events)."""
        items = []
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
        data = self.fetch(url, json_mode=True)
        if not data or "features" not in data:
            return items

        for feat in data.get("features", [])[:25]:
            try:
                props = feat.get("properties", {})
                geom = feat.get("geometry", {})
                coords = geom.get("coordinates", [0, 0, 0])

                lng = float(coords[0])
                lat = float(coords[1])
                depth = float(coords[2]) if len(coords) > 2 else 10.0

                mag = props.get("mag")
                place = props.get("place") or "Global Location"
                time_epoch = props.get("time", 0) / 1000.0
                event_time = datetime.fromtimestamp(time_epoch, tzinfo=timezone.utc).isoformat()
                link = props.get("url") or f"https://earthquake.usgs.gov/earthquakes/eventpage/{props.get('code')}"

                # Severity classification
                severity = "เฝ้าระวัง"
                if mag and mag >= 6.0:
                    severity = "วิกฤต/รุนแรง"
                elif mag and mag >= 4.5:
                    severity = "เตือนภัย"

                title = f"แผ่นดินไหวขนาด M {mag} บริเวณ {place}"
                
                item = {
                    "title": title,
                    "disaster_type": "earthquake",
                    "description": f"USGS ตรวจพบเหตุการณ์แผ่นดินไหวขนาด {mag} แมกนิจูด ที่ความลึก {depth} กิโลเมตร บริเวณ {place}",
                    "location_name": place,
                    "province": "",
                    "country": "สากล/ทั่วโลก",
                    "latitude": lat,
                    "longitude": lng,
                    "magnitude": float(mag) if mag else None,
                    "depth_km": depth,
                    "severity_level": severity,
                    "source_name": "USGS Earthquake Hazards Program",
                    "source_url": link,
                    "image_url": self.get_image("earthquake"),
                    "event_time": event_time,
                    "metadata": {
                        "tsunami_alert": props.get("tsunami", 0),
                        "usgs_code": props.get("code")
                    }
                }
                items.append(item)
            except Exception as e:
                logger.debug(f"Error parsing USGS item: {e}")

        return items

    def scrape_gdacs_disasters(self):
        """Scrapes GDACS RSS for international natural disaster alerts (Cyclones, Floods, Volcanoes)."""
        items = []
        feed_url = "https://www.gdacs.org/xml/rss.xml"
        raw = self.fetch(feed_url)
        if not raw:
            return items

        feed = feedparser.parse(raw)
        type_mapping = {
            "EQ": ("earthquake", "แผ่นดินไหว"),
            "TC": ("storm", "พายุไซโคลน/พายุหมุนเขตร้อน"),
            "FL": ("flood", "อุทกภัย/น้ำท่วมใหญ่"),
            "VO": ("volcano", "ภูเขาไฟปะทุ"),
            "TS": ("tsunami", "สึนามิ"),
            "DR": ("drought", "ภัยแล้งวิกฤต")
        }

        for entry in feed.entries[:20]:
            try:
                title = self.clean_text(entry.title)
                summary = self.clean_text(entry.get("summary", ""))
                link = entry.link
                alert_level = getattr(entry, "gdacs_alertlevel", "Green").capitalize()
                event_type_code = getattr(entry, "gdacs_eventtype", "FL")
                
                disaster_type, th_type = type_mapping.get(event_type_code, ("flood", "ภัยธรรมชาติ"))
                
                # Parse coordinates if available
                lat = None
                lng = None
                if hasattr(entry, "geo_lat") and hasattr(entry, "geo_long"):
                    lat = float(entry.geo_lat)
                    lng = float(entry.geo_long)
                elif hasattr(entry, "point"):
                    parts = entry.point.split()
                    if len(parts) == 2:
                        lat = float(parts[0])
                        lng = float(parts[1])

                severity = "เฝ้าระวัง"
                if alert_level == "Red":
                    severity = "วิกฤต/รุนแรง"
                elif alert_level == "Orange":
                    severity = "เตือนภัย"

                th_title = f"เตือนภัย{th_type}: {title}"

                item = {
                    "title": th_title,
                    "disaster_type": disaster_type,
                    "description": f"การแจ้งเตือนระดับสากลจาก GDACS (Global Disaster Alert): {summary or title}",
                    "location_name": getattr(entry, "gdacs_country", "นานาชาติ"),
                    "province": "",
                    "country": getattr(entry, "gdacs_country", "นานาชาติ"),
                    "latitude": lat,
                    "longitude": lng,
                    "magnitude": None,
                    "depth_km": None,
                    "severity_level": severity,
                    "source_name": "GDACS Global Disaster Alert",
                    "source_url": link,
                    "image_url": self.get_image(disaster_type),
                    "event_time": self.parse_thai_date(entry.get("published", "")),
                    "metadata": {
                        "alert_color": alert_level,
                        "event_code": event_type_code
                    }
                }
                items.append(item)
            except Exception as e:
                logger.debug(f"Error parsing GDACS item: {e}")

        return items
