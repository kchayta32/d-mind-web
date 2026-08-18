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
        
        # Complete fallback list of all known tables in Supabase
        self.fallback_tables = [
            'natural_disasters', 'disaster_hazards', 'weather_forecasts', 
            'from_rain_sensor', 'documents', 'thesis_docs', 'victim_reports', 
            'incident_reports', 'satisfaction_surveys', 'demo_app_surveys', 
            'booth_surveys', 'user_roles', 'n8n_chat_histories', 
            'user_locations', 'user_alert_subscriptions', 'shared_disaster_data', 
            'user_preferences', 'damage_assessments', 'realtime_alerts', 
            'sensor_logs', 'notifications'
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

        for table in self.tables:
            try:
                # Fetch all rows (supporting pagination if table has >= 1000 rows)
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
                        print(f"[SupabaseHelper] Warning: Table {table} returned status {response.status_code}")
                        break

                self.db_cache[table] = all_rows
                self.table_row_counts[table] = len(all_rows)
                if len(all_rows) > 0:
                    print(f"  [+] Cached table '{table}': {len(all_rows)} rows")
                else:
                    print(f"  [-] Table '{table}' is empty (0 rows)")

            except Exception as e:
                self.db_cache[table] = []
                self.table_row_counts[table] = 0
                print(f"[SupabaseHelper] Error caching table {table}: {e}")

        total_rows = sum(len(r) for r in self.db_cache.values())
        print(f"[SupabaseHelper] Cache refreshed successfully: {len(self.db_cache)} tables, {total_rows} total rows.")

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

    def search(self, query, limit=12):
        """
        Search for query keywords across ALL tables in Supabase.
        Returns a list of match details sorted by relevance with multi-table diversity.
        """
        self.ensure_cache_loaded()
        query_clean = query.strip().lower()
        if not query_clean:
            return []

        tokens = self.tokenize_query(query)
        if not tokens:
            tokens = [query_clean]

        # Primary high-importance columns that describe content
        primary_columns = {
            'title', 'name', 'summary', 'detail', 'description', 'content', 
            'location_name', 'province', 'country', 'hazard_type', 'disaster_type', 
            'forecast_type', 'target_region', 'source_name', 'most_useful_feature', 
            'suggestions', 'likes', 'improvements', 'status', 'role', 'file_name'
        }

        # Table topic aliases for query intention matching across all 21 tables
        table_aliases = {
            'natural_disasters': ['แผ่นดินไหว', 'ภัยธรรมชาติ', 'natural_disasters', 'แผ่นดิน', 'สึนามิ', 'earthquake', 'disaster', 'สถิติภัยพิบัติ', 'ศูนย์กลางแผ่นดินไหว', 'magnitude'],
            'weather_forecasts': ['พยากรณ์อากาศ', 'สภาพอากาศ', 'อากาศ', 'อุณหภูมิ', 'weather_forecasts', 'forecast', 'ฝนตกหนัก', 'ภาคเหนือ', 'ภาคใต้', 'ภาคกลาง', 'ภาคตะวันออกเฉียงเหนือ', 'กรุงเทพ', 'ลม', 'โอกาสเกิดฝน'],
            'disaster_hazards': ['อันตราย', 'อุบัติเหตุ', 'เตือนภัย', 'disaster_hazards', 'hazard', 'ไฟไหม้', 'ดินถล่ม', 'น้ำท่วม', 'ข่าวเตือนภัย', 'khaosod', 'อุบัติภัย'],
            'from_rain_sensor': ['เซ็นเซอร์', 'ฝน', 'วัดน้ำฝน', 'ความชื้น', 'from_rain_sensor', 'sensor', 'rain', 'humidity', 'is_raining', 'ปริมาณฝน', 'อุปกรณ์วัด'],
            'documents': ['เอกสาร', 'คู่มือ', 'แนวทาง', 'เตรียมตัว', 'documents', 'doc', 'global disaster', 'การเตรียมพร้อม'],
            'thesis_docs': ['วิทยานิพนธ์', 'thesis', 'thesis_docs', 'บรรณานุกรม', 'บทที่', 'เล่มวิทยานิพนธ์', 'งานวิจัย', 'บทนำ'],
            'victim_reports': ['ผู้ประสบภัย', 'เหยื่อ', 'ขอความช่วยเหลือ', 'victim_reports', 'victim', 'ผู้บาดเจ็บ', 'ผู้สูญหาย', 'kitti', 'chaita', 'สถานะผู้ประสบภัย', 'พิกัดช่วยเหลือ'],
            'incident_reports': ['รายงานเหตุการณ์', 'แจ้งเหตุ', 'incident_reports', 'incident', 'แจ้งเรื่อง', 'รับแจ้งเหตุ', 'เหตุด่วน'],
            'satisfaction_surveys': ['ความพึงพอใจ', 'แบบประเมิน', 'satisfaction_surveys', 'survey', 'ข้อเสนอแนะ', 'คะแนน', 'ประเมินความพึงพอใจ', 'overall_rating', 'suggestions'],
            'demo_app_surveys': ['แอปพลิเคชัน', 'demo', 'demo_app_surveys', 'ux', 'ฟีเจอร์', 'การใช้งานแอป', 'ux_ratings'],
            'booth_surveys': ['บูธ', 'นิทรรศการ', 'booth', 'booth_surveys', 'งานจัดแสดง', 'ผู้เข้าชมบูธ'],
            'user_roles': ['สิทธิ์ผู้ใช้', 'บทบาท', 'admin', 'user_roles', 'role', 'ผู้ดูแลระบบ', 'สิทธิ์การใช้งาน'],
            'n8n_chat_histories': ['ประวัติแชท', 'ข้อความแชท', 'บทสนทนา', 'n8n_chat_histories', 'chat', 'session', 'ประวัติการสนทนา'],
            'damage_assessments': ['ประเมินความเสียหาย', 'ความเสียหาย', 'damage_assessments', 'damage'],
            'realtime_alerts': ['แจ้งเตือนเรียลไทม์', 'realtime_alerts', 'alert'],
            'sensor_logs': ['ประวัติเซ็นเซอร์', 'sensor_logs', 'log'],
            'notifications': ['การแจ้งเตือน', 'notifications', 'notification'],
            'user_locations': ['ตำแหน่งผู้ใช้', 'พิกัดผู้ใช้', 'user_locations'],
            'user_alert_subscriptions': ['การสมัครรับแจ้งเตือน', 'user_alert_subscriptions', 'subscriptions'],
            'shared_disaster_data': ['ข้อมูลภัยพิบัติที่แชร์', 'shared_disaster_data'],
            'user_preferences': ['การตั้งค่าผู้ใช้', 'user_preferences']
        }

        all_matches = []
        for table_name, rows in self.db_cache.items():
            if not rows:
                continue

            # Check if user query explicitly mentions or targets this table
            table_bonus = 0
            if table_name.lower() in query_clean:
                table_bonus += 35
            for alias in table_aliases.get(table_name, []):
                if alias in query_clean:
                    table_bonus += 20
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
                if (col_score_total >= 8) or (table_bonus >= 20):
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
        max_per_table = max(3, limit // 2)

        for match in all_matches:
            tbl = match["table"]
            current_count = table_counts.get(tbl, 0)
            if current_count < max_per_table or len(selected_results) < limit:
                selected_results.append(match)
                table_counts[tbl] = current_count + 1
                if len(selected_results) >= limit:
                    break

        return selected_results

    def format_context_for_llm(self, search_results, max_chars_per_field=1000, max_total_chars=12000):
        """Format search results into a clean text context block for LLM prompt."""
        if not search_results:
            return "ไม่พบข้อมูลที่เกี่ยวข้องในฐานข้อมูล Supabase"

        context_parts = []
        # Group by table to make it easy for the LLM to identify sources
        by_table = {}
        for res in search_results:
            table = res["table"]
            if table not in by_table:
                by_table[table] = []
            by_table[table].append(res["row_data"])

        total_chars = 0
        for table_name, rows in by_table.items():
            table_header = f"=== ข้อมูลจากตาราง [{table_name}] ==="
            context_parts.append(table_header)
            total_chars += len(table_header) + 1

            for idx, row in enumerate(rows, 1):
                if total_chars >= max_total_chars:
                    break

                # Clean up dense embeddings or truncate excessively long text fields
                row_clean = {}
                for k, v in row.items():
                    if k in ('embedding',):
                        continue
                    if isinstance(v, str) and len(v) > max_chars_per_field:
                        row_clean[k] = v[:max_chars_per_field] + "... [ตัดข้อความให้กระชับ]"
                    else:
                        row_clean[k] = v

                row_json = json.dumps(row_clean, ensure_ascii=False)
                row_line = f"แถวที่ {idx}: {row_json}"
                context_parts.append(row_line)
                total_chars += len(row_line) + 1

            context_parts.append("")  # Empty line separator

        return "\n".join(context_parts)
