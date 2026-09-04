import os
import requests
import json
import re

# Set PyThaiNLP data directory to /tmp for read-only serverless environments
if "PYTHAINLP_DATA_DIR" not in os.environ:
    os.environ["PYTHAINLP_DATA_DIR"] = "/tmp/pythainlp_data"

try:
    from pythainlp.tokenize import word_tokenize
    HAS_PYTHAINLP = True
except Exception:
    HAS_PYTHAINLP = False


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

# Descriptions for all 30 tables and views in schema public
TABLE_DESCRIPTIONS = {
    'api_keys': 'คีย์ API สำหรับการเข้าถึงระบบ',
    'banner_events': 'บันทึกการคลิกและการแสดงผลแบนเนอร์แจ้งเตือน/กิจกรรม',
    'booth_surveys': 'แบบสำรวจความคิดเห็นจากผู้เข้าชมนิทรรศการ/บูธ',
    'damage_assessments': 'รายงานการประเมินความเสียหายจากภัยพิบัติ',
    'demo_app_surveys': 'แบบสำรวจความคิดเห็นและประสบการณ์ผู้ใช้ (UX) แอปพลิเคชัน',
    'disaster_alerts': 'ข้อมูลการแจ้งเตือนภัยฉุกเฉินแบบเรียลไทม์จากเซ็นเซอร์',
    'disaster_hazards': 'รายงานภัยพิบัติ เหตุอันตราย และอุบัติภัยในพื้นที่ต่างๆ',
    'documents': 'เอกสาร คู่มือ และแนวทางการเตรียมตัวรับมือภัยพิบัติ',
    'environment_logs': 'บันทึกค่าสิ่งแวดล้อม (อุณหภูมิ ความชื้น ความกดอากาศ ดัชนีความร้อน จุดน้ำค้าง)',
    'from_rain_sensor': 'ข้อมูลเซ็นเซอร์ตรวจวัดฝนและความชื้นแบบเรียลไทม์',
    'incident_reports': 'รายงานการแจ้งเหตุฉุกเฉินและอุบัติเหตุจากประชาชน',
    'motion_logs': 'บันทึกเซ็นเซอร์ตรวจจับการเคลื่อนไหว การเอียง (Pitch/Roll/Yaw) และความเร่ง',
    'n8n_chat_histories': 'ประวัติการสนทนาและข้อความแชทของผู้ใช้กับระบบ AI',
    'natural_disasters': 'สถิติและข้อมูลเหตุการณ์ภัยธรรมชาติ (แผ่นดินไหว สึนามิ อุทกภัย)',
    'notifications': 'ประวัติการส่งการแจ้งเตือนไปยังผู้ใช้',
    'pm_logs': 'บันทึกค่าฝุ่นละอองในอากาศ (PM1.0, PM2.5, PM10 และดัชนี AQI)',
    'realtime_alerts': 'ระบบแจ้งเตือนแบบเรียลไทม์',
    'satisfaction_surveys': 'แบบประเมินความพึงพอใจและข้อเสนอแนะในการใช้งานระบบ',
    'sensor_logs': 'บันทึกค่ารวมของเซ็นเซอร์ทั้งหมด (ระดับน้ำ, ฝุ่น, สภาพแวดล้อม, การเอียง)',
    'shared_disaster_data': 'ข้อมูลภัยพิบัติที่แชร์กับหน่วยงานภายนอก',
    'thesis_docs': 'เอกสารวิทยานิพนธ์และงานวิจัยที่เกี่ยวข้อง',
    'user_alert_subscriptions': 'การสมัครรับการแจ้งเตือนภัยพิบัติของผู้ใช้',
    'user_locations': 'พิกัดตำแหน่งทางภูมิศาสตร์ของผู้ใช้',
    'user_preferences': 'การตั้งค่าส่วนบุคคลของผู้ใช้งาน',
    'user_roles': 'การกำหนดสิทธิ์และบทบาทของผู้ใช้งานในระบบ',
    'v_active_disaster_alerts': 'วิว (View) แสดงการแจ้งเตือนภัยพิบัติที่ยังคงมีผลอยู่ในปัจจุบัน',
    'v_latest_sensor_reading': 'วิว (View) แสดงค่าอ่านล่าสุดจากเซ็นเซอร์ทุกประเภทในระบบ',
    'victim_reports': 'รายงานข้อมูลผู้ประสบภัยและผู้ที่ต้องการความช่วยเหลือเร่งด่วน',
    'water_level_logs': 'บันทึกข้อมูลระดับน้ำและระยะห่างจากผิวน้ำ',
    'weather_forecasts': 'ข้อมูลพยากรณ์อากาศและสภาพอากาศรายวันแต่ละภูมิภาค'
}


class SupabaseHelper:
    def __init__(self, lazy=False):
        raw_url = os.environ.get("SUPABASE_URL", "https://evxjnivabxdlgfvncdcu.supabase.co")
        if not raw_url.endswith("/"):
            raw_url += "/"
        if not raw_url.endswith("rest/v1/"):
            raw_url += "rest/v1/"
        self.url = raw_url

        key = (
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
            os.environ.get("SUPABASE_SERVICE_KEY") or
            os.environ.get("SUPABASE_ANON_KEY") or
            os.environ.get("SUPABASE_KEY", "")
        )
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}" if key else ""
        }
        
        # Complete fallback list of all 30 known tables/views in Supabase schema public
        self.fallback_tables = [
            'api_keys', 'banner_events', 'booth_surveys', 'damage_assessments', 
            'demo_app_surveys', 'disaster_alerts', 'disaster_hazards', 'documents', 
            'environment_logs', 'from_rain_sensor', 'incident_reports', 'motion_logs', 
            'n8n_chat_histories', 'natural_disasters', 'notifications', 'pm_logs', 
            'realtime_alerts', 'satisfaction_surveys', 'sensor_logs', 'shared_disaster_data', 
            'thesis_docs', 'user_alert_subscriptions', 'user_locations', 'user_preferences', 
            'user_roles', 'v_active_disaster_alerts', 'v_latest_sensor_reading', 
            'victim_reports', 'water_level_logs', 'weather_forecasts'
        ]
        self.tables = list(self.fallback_tables)
        self.db_cache = {}
        self.table_row_counts = {}
        if not lazy:
            self.refresh_cache()

    def ensure_cache_loaded(self):
        """Ensure cache is populated before searching."""
        if not self.db_cache:
            self.refresh_cache()

    def discover_tables(self):
        """
        Dynamically discover all available tables from Supabase OpenAPI schema.
        Falls back to known table list if unavailable.
        """
        try:
            response = requests.get(self.url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                paths = data.get("paths", {})
                discovered = []
                for path in paths.keys():
                    if path != "/" and not path.startswith("/rpc/"):
                        table_name = path.strip("/")
                        if table_name and table_name not in discovered:
                            discovered.append(table_name)
                
                # Merge with fallback to ensure full coverage
                all_tables = list(dict.fromkeys(discovered + self.fallback_tables))
                print(f"[SupabaseHelper] Discovered {len(discovered)} tables from OpenAPI schema (Total: {len(all_tables)})")
                return sorted(all_tables)
            else:
                print(f"[SupabaseHelper] Warning: OpenAPI schema returned {response.status_code}, using fallback table list.")
        except Exception as e:
            print(f"[SupabaseHelper] Error discovering tables: {e}, using fallback table list.")
            
        return list(self.fallback_tables)

    def refresh_cache(self):
        """Fetch all rows from every table in Supabase and store in memory."""
        print("[SupabaseHelper] Refreshing Supabase cache for ALL tables...")
        self.tables = self.discover_tables()
        self.db_cache = {}
        self.table_row_counts = {}
        from concurrent.futures import ThreadPoolExecutor

        def fetch_table(table):
            try:
                all_rows = []
                offset = 0
                page_size = 1000
                while True:
                    table_url = f"{self.url}{table}?select=*&limit={page_size}&offset={offset}"
                    response = requests.get(table_url, headers=self.headers, timeout=15)
                    if response.status_code == 200:
                        rows = response.json()
                        if not rows:
                            break
                        all_rows.extend(rows)
                        if len(rows) < page_size:
                            break
                        offset += page_size
                    else:
                        break
                return table, all_rows
            except Exception as e:
                print(f"[SupabaseHelper] Error caching table {table}: {e}")
                return table, []

        with ThreadPoolExecutor(max_workers=10) as executor:
            results = executor.map(fetch_table, self.tables)

        for table, rows in results:
            self.db_cache[table] = rows
            self.table_row_counts[table] = len(rows)

        total_rows = sum(len(r) for r in self.db_cache.values())
        print(f"[SupabaseHelper] Cache refreshed successfully (parallel): {len(self.db_cache)} tables, {total_rows} total rows.")

    def get_schema_catalog(self):
        """
        Generate a concise, comprehensive text catalog of ALL 30 tables in schema public.
        Includes table names, row counts, descriptions, and list of columns.
        """
        self.ensure_cache_loaded()
        lines = [
            "=== แคตตาล็อกตารางใน Supabase Schema Public (ทั้งหมด 30 ตาราง) ===",
            "ระบบเชื่อมต่อและอ่านข้อมูลจากทุกตารางที่เปิดอยู่ใน Schema Public ดังนี้:\n"
        ]

        active_tables = []
        empty_tables = []

        for table in sorted(self.tables):
            rows = self.db_cache.get(table, [])
            count = len(rows)
            desc = TABLE_DESCRIPTIONS.get(table, "ตารางข้อมูลระบบ")
            
            # Determine column names (excluding embedding)
            cols = []
            if rows:
                cols = [c for c in rows[0].keys() if c != 'embedding']
            
            if count > 0:
                cols_str = f" [คอลัมน์: {', '.join(cols[:10])}]" if cols else ""
                active_tables.append(f"- {table} ({count} แถว): {desc}{cols_str}")
            else:
                empty_tables.append(f"{table} ({desc})")

        lines.append("[ตารางที่มีข้อมูลพร้อมใช้งาน]:")
        lines.extend(active_tables)
        
        if empty_tables:
            lines.append("\n[ตารางที่เปิดไว้แต่ยังไม่มีข้อมูลในปัจจุบัน (0 แถว)]:")
            lines.append(", ".join(empty_tables))

        return "\n".join(lines)

    def tokenize_query(self, query):
        """
        Tokenize Thai & English query text using PyThaiNLP and regex splitting.
        Generates individual tokens, n-grams, and sub-tokens for deep search,
        filtering out single-character tokens and common stopwords.
        """
        query_clean = query.strip().lower()
        tokens = set()
        
        stopwords = {
            'การ', 'ความ', 'ที่', 'ใน', 'ของ', 'เป็น', 'มี', 'ให้', 'ได้', 'กับ', 
            'และ', 'หรือ', 'จะ', 'ว่า', 'นี้', 'นั้น', 'อะไร', 'ทำ', 'วิธี', 'อย่าง', 
            'เช่น', 'มาก', 'ไป', 'มา', 'อยู่', 'โดย', 'จาก', 'เพื่อ', 'แต่', 'ถ้า', 
            'จึง', 'ซึ่ง', 'กัน', 'ทั้ง', 'คือ', 'หน่อย', 'บ้าง', 'ครับ', 'ค่ะ', 
            'นะคะ', 'หน่อยครับ', 'หน่อยค่ะ', 'ด้วย', 'ใคร', 'ที่ไหน', 'เมื่อไหร่', 
            'ทำไม', 'อย่างไร', 'เท่าไหร่', 'อันไหน', 'ขอ', 'ดู', 'ช่วย', 'บอก',
            'วิธีทำ', 'วิธีการ', 'ข้อมูล', 'เรื่อง', 'รายละเอียด', 'เกี่ยวกับ', 
            'เกี่ยวกับการ', 'คำถาม', 'สรุป', 'ค้นหา', 'ค้น', 'แสดง', 'ตรวจ',
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or'
        }

        # 1. Whitespace tokens
        for t in re.split(r'[\s,;:!?\'"(){}\[\]]+', query_clean):
            t_clean = t.strip()
            if len(t_clean) > 1 and t_clean not in stopwords:
                tokens.add(t_clean)

        # 2. PyThaiNLP dictionary tokenization
        if HAS_PYTHAINLP:
            try:
                thai_tokens = word_tokenize(query_clean, engine="newmm", keep_whitespace=False)
                for t in thai_tokens:
                    t_str = t.strip()
                    if len(t_str) > 1 and t_str not in stopwords:
                        tokens.add(t_str)
                        
                # 2-word n-grams for compound phrases
                for i in range(len(thai_tokens) - 1):
                    t1 = thai_tokens[i].strip()
                    t2 = thai_tokens[i+1].strip()
                    if t1 and t2:
                        ngram = t1 + t2
                        if len(ngram) > 2 and ngram not in stopwords:
                            tokens.add(ngram)
            except Exception:
                pass
                
        # 3. Fallback character n-grams for Thai strings without space
        if len(tokens) == 0 and len(query_clean) > 3:
            for size in [3, 4, 5]:
                for i in range(len(query_clean) - size + 1):
                    sub = query_clean[i:i+size]
                    if sub not in stopwords:
                        tokens.add(sub)

        return list(tokens)

    def search(self, query, limit=16):
        """
        Search for query keywords across ALL tables in Supabase schema public.
        Handles both targeted queries and broad database overview queries.
        """
        self.ensure_cache_loaded()
        query_clean = query.strip().lower()
        if not query_clean:
            return []

        # Check if query is asking for broad database overview or all tables
        broad_keywords = [
            'ทั้งหมด', 'ทุกตาราง', 'schema', 'public', 'ฐานข้อมูล', 'มีอะไรบ้าง', 
            'สรุป', 'ตารางอะไร', 'ตารางไหน', 'database', 'มีตาราง', 'โครงสร้าง',
            'ภาพรวม', 'สถิติ', 'ข้อมูลระบบ', 'แคตตาล็อก'
        ]
        is_broad_query = any(bw in query_clean for bw in broad_keywords)

        tokens = self.tokenize_query(query)
        if not tokens:
            tokens = [query_clean]

        # Primary high-importance columns that describe content
        primary_columns = {
            'title', 'name', 'summary', 'detail', 'description', 'content', 
            'location_name', 'province', 'country', 'hazard_type', 'disaster_type', 
            'forecast_type', 'target_region', 'source_name', 'most_useful_feature', 
            'suggestions', 'likes', 'improvements', 'status', 'role', 'file_name',
            'alert_type', 'message', 'aqi_category', 'device_id', 'water_level',
            'is_raining', 'humidity', 'temperature', 'event_type'
        }

        # Table topic aliases for query intention matching across all 30 tables
        table_aliases = {
            'api_keys': ['api_keys', 'api key', 'คีย์'],
            'banner_events': ['banner_events', 'banner', 'แบนเนอร์', 'คลิกแบนเนอร์', 'กิจกรรม'],
            'booth_surveys': ['booth_surveys', 'บูธ', 'นิทรรศการ', 'booth', 'ผู้เข้าชมบูธ'],
            'damage_assessments': ['damage_assessments', 'ความเสียหาย', 'ประเมินความเสียหาย', 'damage'],
            'demo_app_surveys': ['demo_app_surveys', 'แอปพลิเคชัน', 'demo', 'ux', 'ฟีเจอร์', 'การใช้งานแอป', 'ux_ratings'],
            'disaster_alerts': ['disaster_alerts', 'เตือนภัยฉุกเฉิน', 'alert', 'เซ็นเซอร์เตือนภัย', 'แจ้งเตือนภัย'],
            'disaster_hazards': ['disaster_hazards', 'อันตราย', 'อุบัติเหตุ', 'เตือนภัย', 'hazard', 'ไฟไหม้', 'ดินถล่ม', 'น้ำท่วม', 'ข่าวเตือนภัย', 'อุบัติภัย'],
            'documents': ['documents', 'เอกสาร', 'คู่มือ', 'แนวทาง', 'เตรียมตัว', 'doc', 'global disaster', 'การเตรียมพร้อม'],
            'environment_logs': ['environment_logs', 'สิ่งแวดล้อม', 'อุณหภูมิ', 'ความชื้น', 'ความกดอากาศ', 'heat index', 'dew point'],
            'from_rain_sensor': ['from_rain_sensor', 'เซ็นเซอร์', 'ฝน', 'วัดน้ำฝน', 'ความชื้น', 'sensor', 'rain', 'humidity', 'is_raining', 'ปริมาณฝน'],
            'incident_reports': ['incident_reports', 'รายงานเหตุการณ์', 'แจ้งเหตุ', 'incident', 'แจ้งเรื่อง', 'รับแจ้งเหตุ', 'เหตุด่วน'],
            'motion_logs': ['motion_logs', 'การเคลื่อนไหว', 'การเอียง', 'pitch', 'roll', 'yaw', 'ความเร่ง', 'accel'],
            'n8n_chat_histories': ['n8n_chat_histories', 'ประวัติแชท', 'ข้อความแชท', 'บทสนทนา', 'chat', 'session', 'ประวัติการสนทนา'],
            'natural_disasters': ['natural_disasters', 'แผ่นดินไหว', 'ภัยธรรมชาติ', 'แผ่นดิน', 'สึนามิ', 'earthquake', 'disaster', 'สถิติภัยพิบัติ', 'ศูนย์กลางแผ่นดินไหว', 'magnitude'],
            'notifications': ['notifications', 'การแจ้งเตือน', 'notification'],
            'pm_logs': ['pm_logs', 'ฝุ่น', 'pm25', 'pm2.5', 'pm1', 'pm10', 'aqi', 'คุณภาพอากาศ', 'ละอองฝุ่น'],
            'realtime_alerts': ['realtime_alerts', 'แจ้งเตือนเรียลไทม์'],
            'satisfaction_surveys': ['satisfaction_surveys', 'ความพึงพอใจ', 'แบบประเมิน', 'survey', 'ข้อเสนอแนะ', 'คะแนน', 'ประเมินความพึงพอใจ', 'overall_rating', 'suggestions'],
            'sensor_logs': ['sensor_logs', 'เซ็นเซอร์รวม', 'ประวัติเซ็นเซอร์', 'log', 'sensor reading'],
            'shared_disaster_data': ['shared_disaster_data', 'ข้อมูลภัยพิบัติที่แชร์'],
            'thesis_docs': ['thesis_docs', 'วิทยานิพนธ์', 'thesis', 'บรรณานุกรม', 'บทที่', 'เล่มวิทยานิพนธ์', 'งานวิจัย', 'บทนำ'],
            'user_alert_subscriptions': ['user_alert_subscriptions', 'การสมัครรับแจ้งเตือน'],
            'user_locations': ['user_locations', 'ตำแหน่งผู้ใช้', 'พิกัดผู้ใช้'],
            'user_preferences': ['user_preferences', 'การตั้งค่าผู้ใช้'],
            'user_roles': ['user_roles', 'สิทธิ์ผู้ใช้', 'บทบาท', 'admin', 'role', 'ผู้ดูแลระบบ', 'สิทธิ์การใช้งาน'],
            'v_active_disaster_alerts': ['v_active_disaster_alerts', 'เตือนภัยล่าสุด', 'active alerts'],
            'v_latest_sensor_reading': ['v_latest_sensor_reading', 'เซ็นเซอร์ล่าสุด', 'latest sensor', 'ค่าเซ็นเซอร์ปัจจุบัน'],
            'victim_reports': ['victim_reports', 'ผู้ประสบภัย', 'เหยื่อ', 'ขอความช่วยเหลือ', 'victim', 'ผู้บาดเจ็บ', 'ผู้สูญหาย', 'kitti', 'chaita', 'สถานะผู้ประสบภัย', 'พิกัดช่วยเหลือ'],
            'water_level_logs': ['water_level_logs', 'ระดับน้ำ', 'น้ำท่วม', 'water level', 'distance_cm'],
            'weather_forecasts': ['weather_forecasts', 'พยากรณ์อากาศ', 'สภาพอากาศ', 'อากาศ', 'อุณหภูมิ', 'forecast', 'ฝนตกหนัก', 'ภาคเหนือ', 'ภาคใต้', 'ภาคกลาง', 'กรุงเทพ', 'ลม', 'โอกาสเกิดฝน']
        }

        all_matches = []

        # If broad query, gather top recent records from all non-empty tables
        if is_broad_query:
            for table_name, rows in self.db_cache.items():
                if not rows:
                    continue
                # For each table, grab the most recent/first 2-3 rows as representative data
                sample_rows = rows[-3:] if len(rows) > 3 else rows
                for r in sample_rows:
                    row_parts = [f"{k}: {str(v)[:70]}" for k, v in r.items() if k not in ('id', 'created_at', 'embedding') and v is not None]
                    summary_text = " | ".join(row_parts[:4]) if row_parts else f"ID: {r.get('id', '')}"
                    all_matches.append({
                        "table": table_name,
                        "row_data": r,
                        "matched_columns": {k: {"value": str(v)[:100]} for k, v in list(r.items())[:3] if k != 'embedding'},
                        "score": 30,
                        "summary": summary_text
                    })
            return all_matches[:limit]

        for table_name, rows in self.db_cache.items():
            if not rows:
                continue

            # Check if user query explicitly mentions or targets this table
            table_bonus = 0
            if table_name.lower() in query_clean:
                table_bonus += 40
            for alias in table_aliases.get(table_name, []):
                if alias in query_clean:
                    table_bonus += 25
                    break

            for row in rows:
                matched_cols = {}
                row_str_parts = []
                col_score_total = 0

                for col, val in row.items():
                    if val is None or col in ('embedding',):
                        continue

                    # Convert value to string and check matches
                    if isinstance(val, (dict, list)):
                        val_str = json.dumps(val, ensure_ascii=False).lower()
                        display_val = json.dumps(val, ensure_ascii=False)
                    else:
                        val_str = str(val).lower()
                        display_val = str(val)

                    # Build row summary representation
                    if col not in ('id', 'created_at', 'updated_at', 'metadata'):
                        row_str_parts.append(f"{col}: {display_val[:80]}")

                    col_score = 0
                    is_primary = col in primary_columns

                    # 1. Exact query match in column
                    if query_clean in val_str:
                        col_score += 25 if is_primary else 15

                    # 2. Sub-token and keyword matches
                    token_matches = 0
                    for token in tokens:
                        if token in val_str:
                            token_matches += 1
                            # Weight by token length
                            weight = 5 if len(token) >= 4 else 3
                            if is_primary:
                                weight = int(weight * 1.5)
                            col_score += weight

                    if col_score > 0:
                        matched_cols[col] = {
                            "value": display_val[:200],
                            "score": col_score,
                            "token_matches": token_matches
                        }
                        col_score_total += col_score

                # Cap column score per row to prevent huge texts from completely overshadowing structured data
                capped_col_score = min(col_score_total, 50)
                final_row_score = table_bonus + capped_col_score

                # If the table or row has a positive match
                if (col_score_total >= 8) or (table_bonus >= 25):
                    summary_text = " | ".join(row_str_parts[:4]) if row_str_parts else f"ID: {row.get('id', '')}"
                    all_matches.append({
                        "table": table_name,
                        "row_data": row,
                        "matched_columns": matched_cols,
                        "score": final_row_score,
                        "summary": summary_text
                    })

        # Sort all matches by score descending
        all_matches.sort(key=lambda x: x["score"], reverse=True)

        # Multi-table diversification: ensure balanced representation across matched tables
        selected_results = []
        table_counts = {}
        max_per_table = max(4, limit // 2)

        for match in all_matches:
            tbl = match["table"]
            current_count = table_counts.get(tbl, 0)
            if current_count < max_per_table or len(selected_results) < limit:
                selected_results.append(match)
                table_counts[tbl] = current_count + 1
                if len(selected_results) >= limit:
                    break

        return selected_results

    def format_context_for_llm(self, search_results, max_chars_per_field=600, max_total_chars=12000):
        """
        Format comprehensive context for LLM:
        1. Always includes Schema Public Table Catalog (all 30 tables, row counts, descriptions).
        2. Followed by the extracted rows grouped by table.
        """
        catalog = self.get_schema_catalog()
        context_parts = [catalog, "\n=== ข้อมูลแถวรายละเอียดจากตารางที่เกี่ยวข้อง ==="]
        total_chars = len(catalog)

        if not search_results:
            context_parts.append("(ไม่พบคีย์เวิร์ดตรงกับแถวข้อมูลเฉพาะเจาะจง แต่สามารถอ้างอิงรายชื่อและสถานะของตารางทั้ง 30 ตารางข้างต้นได้)")
            return "\n".join(context_parts)

        # Group by table to make it easy for the LLM to identify sources
        by_table = {}
        for res in search_results:
            table = res["table"]
            if table not in by_table:
                by_table[table] = []
            by_table[table].append(res["row_data"])

        for table_name, rows in by_table.items():
            table_desc = TABLE_DESCRIPTIONS.get(table_name, "")
            table_header = f"\n--- ตาราง [{table_name}] ({len(rows)} แถวที่ดึงมา) : {table_desc} ---"
            context_parts.append(table_header)
            total_chars += len(table_header) + 1

            for idx, row in enumerate(rows, 1):
                if total_chars >= max_total_chars:
                    context_parts.append("... [ตัดทอนเพื่อให้อยู่ในขอบเขตหน่วยความจำ]")
                    break

                # Clean up dense embeddings or truncate excessively long text fields
                row_clean = {}
                for k, v in row.items():
                    if k in ('embedding',):
                        continue
                    if isinstance(v, str) and len(v) > max_chars_per_field:
                        row_clean[k] = v[:max_chars_per_field] + "... [ย่อข้อความ]"
                    else:
                        row_clean[k] = v

                row_json = json.dumps(row_clean, ensure_ascii=False)
                row_line = f"แถวที่ {idx}: {row_json}"
                context_parts.append(row_line)
                total_chars += len(row_line) + 1

        return "\n".join(context_parts)
