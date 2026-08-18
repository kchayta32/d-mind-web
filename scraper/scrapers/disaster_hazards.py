import feedparser
import re
from datetime import datetime, timezone
from .base import BaseScraper, logger

class DisasterHazardScraper(BaseScraper):
    """
    Scrapes catastrophe & disaster hazard incidents (Fires, Toxic/Chemical, PM2.5 Crisis, Drought, Emergency Incidents)
    from Air4Thai, DDPM, Matichon, Thairath, and Khaosod news feeds.
    """
    def __init__(self):
        super().__init__("DisasterHazardScraper")

    def scrape_all(self):
        results = []
        results.extend(self.scrape_air4thai_pm25())
        results.extend(self.scrape_news_hazards())
        logger.info(f"[{self.name}] Total disaster hazard records scraped: {len(results)}")
        return results

    def scrape_air4thai_pm25(self):
        """Scrapes Air4Thai PCD Thailand for high PM2.5 and pollution hazard alerts."""
        items = []
        url = "http://air4thai.pcd.go.th/services/getNewAQI_JSON.php"
        data = self.fetch(url, json_mode=True)
        if not data or "stations" not in data:
            return items

        stations = data.get("stations", [])
        for station in stations:
            try:
                aqi_data = station.get("AQI", {})
                pm25_val = aqi_data.get("PM25", {}).get("value")
                aqi_val = aqi_data.get("aqi", {}).get("value")
                
                if pm25_val is None or pm25_val == "-":
                    continue
                
                try:
                    pm25_float = float(pm25_val)
                except ValueError:
                    continue

                station_name = station.get("nameTH") or station.get("stationID", "")
                area = station.get("areaTH", "")
                lat = float(station.get("lat")) if station.get("lat") else None
                lng = float(station.get("long")) if station.get("long") else None

                province = ""
                if "จ." in area:
                    province = area.split("จ.")[1].split()[0].strip()
                elif "กรุงเทพ" in area:
                    province = "กรุงเทพมหานคร"

                # Capture stations with PM2.5 > 25.0 µg/m³ or high AQI
                if pm25_float >= 25.0 or (aqi_val and str(aqi_val).isdigit() and int(aqi_val) >= 70):
                    severity = "วิกฤตฉุกเฉิน" if pm25_float >= 75.0 else "รุนแรง" if pm25_float >= 50.0 else "ปานกลาง"
                    color_status = "สีแดง (กระทบต่อสุขภาพมาก)" if pm25_float >= 75.0 else "สีส้ม (เริ่มกระทบต่อสุขภาพ)" if pm25_float >= 37.5 else "สีเหลือง (เฝ้าระวัง)"
                    
                    title = f"เตือนภัยฝุ่น PM2.5 ระดับ{color_status} {pm25_float} µg/m³ บริเวณ {station_name}"
                    desc = f"รายงานสถานการณ์คุณภาพอากาศจากกรมควบคุมมลพิษ (Air4Thai): ตรวจวัดค่าฝุ่นละออง PM2.5 ได้ {pm25_float} มคก./ลบ.ม. (AQI: {aqi_val}) ในพื้นที่ {area} ขอให้ประชาชนในพื้นที่เสี่ยงสวมหน้ากากอนามัย N95 และหลีกเลี่ยงกิจกรรมกลางแจ้ง"

                    item = {
                        "title": title,
                        "hazard_type": "pm25_crisis",
                        "description": desc,
                        "location_name": f"{station_name} ({area})",
                        "province": province,
                        "severity_level": severity,
                        "status": "กำลังเกิดขึ้น",
                        "source_name": "กรมควบคุมมลพิษ (Air4Thai)",
                        "source_url": "http://air4thai.pcd.go.th/web.php",
                        "image_url": self.get_image("pm25_crisis"),
                        "incident_time": datetime.now(timezone.utc).isoformat(),
                        "metadata": {
                            "pm25": pm25_float,
                            "aqi": aqi_val,
                            "lat": lat,
                            "lng": lng
                        }
                    }
                    items.append(item)
            except Exception as e:
                logger.debug(f"Error parsing Air4Thai station: {e}")

        items.sort(key=lambda x: x.get("metadata", {}).get("pm25", 0), reverse=True)
        return items[:15]

    def scrape_news_hazards(self):
        """Scrapes Thai news RSS feeds for fires, chemical leaks, drought, and disaster hazard emergencies."""
        items = []
        feed_configs = [
            {"url": "https://www.khaosod.co.th/feed", "source": "ข่าวสด (Khaosod)"},
            {"url": "https://www.matichon.co.th/feed", "source": "มติชนออนไลน์"},
            {"url": "https://www.thairath.co.th/rss/news", "source": "ไทยรัฐออนไลน์"}
        ]

        hazard_keywords = {
            "fire": ["ไฟไหม้", "เพลิงไหม้", "ไฟป่า", "ไฟลุกลาม", "อัคคีภัย", "ไหม้วอด"],
            "chemical_spill": ["สารเคมี", "แก๊สรั่ว", "ก๊าซรั่ว", "โรงงานระเบิด", "มลพิษสารพิษ", "สารพิษ"],
            "drought": ["ภัยแล้ง", "ฝนแล้ง", "น้ำแห้งขอด", "วิกฤตน้ำ", "ฝนทิ้งช่วง", "แล้งจัด"],
            "industrial_accident": ["ถล่ม", "คานถล่ม", "สะพานทรุด", "เขื่อนพัง", "ระเบิด", "อุบัติภัย", "ฉุกเฉิน"]
        }

        provinces_th = [
            "กรุงเทพ", "เชียงใหม่", "เชียงราย", "ชลบุรี", "ระยอง", "สมุทรปราการ", "นนทบุรี", 
            "ปทุมธานี", "นครราชสีมา", "ขอนแก่น", "สุรินทร์", "ภูเก็ต", "สงขลา", "สุราษฎร์ธานี", 
            "อุบลราชธานี", "อยุธยา", "ลำปาง", "น่าน", "ตาก", "ประจวบ", "กระบี่"
        ]

        for cfg in feed_configs:
            raw = self.fetch(cfg["url"])
            if not raw:
                continue

            feed = feedparser.parse(raw)
            for entry in feed.entries:
                try:
                    title = self.clean_text(entry.title)
                    summary = self.clean_text(entry.get("summary", entry.title))
                    link = entry.link
                    pub_date = entry.get("published", "")

                    full_text = f"{title} {summary}".lower()
                    matched_type = None

                    for h_type, kws in hazard_keywords.items():
                        if any(kw in full_text for kw in kws):
                            matched_type = h_type
                            break

                    if not matched_type:
                        continue

                    # Extract province
                    province = ""
                    for p in provinces_th:
                        if p in title or p in summary:
                            province = p
                            break

                    severity = "ปานกลาง"
                    if any(w in full_text for w in ["ด่วน", "วิกฤต", "เสียชีวิต", "รุนแรง", "เผาวอด", "ระเบิดใหญ่", "ฉุกเฉิน"]):
                        severity = "วิกฤตฉุกเฉิน"
                    elif any(w in full_text for w in ["เตือน", "ลุกลาม", "กระทบหนัก", "เสียหาย"]):
                        severity = "รุนแรง"

                    item = {
                        "title": title,
                        "hazard_type": matched_type,
                        "description": summary or title,
                        "location_name": province or "ประเทศไทย",
                        "province": province,
                        "severity_level": severity,
                        "status": "กำลังเกิดขึ้น",
                        "source_name": cfg["source"],
                        "source_url": link,
                        "image_url": self.get_image(matched_type),
                        "incident_time": self.parse_thai_date(pub_date),
                        "metadata": {
                            "origin_feed": cfg["url"]
                        }
                    }
                    items.append(item)
                except Exception as e:
                    logger.debug(f"Error parsing hazard news item: {e}")

        return items
