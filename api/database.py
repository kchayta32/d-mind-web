import os
import time
import sqlite3
import requests
from datetime import datetime

DEFAULT_FIREBASE_RTDB_URL = "https://d-mind-e11fc-default-rtdb.asia-southeast1.firebasedatabase.app"

class Database:
    """
    Hybrid Database Manager:
    - Primary Storage: Firebase Realtime Database (Cloud Persistent & Realtime)
    - Fallback / Local Cache: SQLite Database (Local or Serverless /tmp)
    """
    def __init__(self, db_path=None, firebase_url=None):
        # Configure Firebase Realtime Database URL
        self.firebase_url = (
            firebase_url or 
            os.environ.get("FIREBASE_DATABASE_URL") or 
            os.environ.get("FIREBASE_RTDB_URL") or 
            DEFAULT_FIREBASE_RTDB_URL
        ).rstrip("/")
        
        # Configure SQLite Fallback Path
        if db_path is None:
            is_serverless = (
                os.environ.get("VERCEL") or 
                os.environ.get("VERCEL_ENV") or 
                os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or 
                os.environ.get("LAMBDA_TASK_ROOT") or
                not os.access(".", os.W_OK)
            )
            if is_serverless:
                self.db_path = "/tmp/ratings.db"
            else:
                self.db_path = os.environ.get("DB_PATH", "ratings.db")
        else:
            self.db_path = db_path
            
        self.init_sqlite_db()
        self.use_firebase = bool(self.firebase_url)

    # -------------------------------------------------------------------------
    # Firebase REST Helper Methods
    # -------------------------------------------------------------------------
    def _firebase_get(self, path):
        if not self.use_firebase:
            return None
        try:
            url = f"{self.firebase_url}/{path.lstrip('/')}.json"
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                return resp.json()
        except Exception as e:
            print(f"[Firebase RTDB] GET {path} Error: {e}")
        return None

    def _firebase_put(self, path, data):
        if not self.use_firebase:
            return False
        try:
            url = f"{self.firebase_url}/{path.lstrip('/')}.json"
            resp = requests.put(url, json=data, timeout=5)
            return resp.status_code in (200, 201, 204)
        except Exception as e:
            print(f"[Firebase RTDB] PUT {path} Error: {e}")
            return False

    def _firebase_patch(self, path, data):
        if not self.use_firebase:
            return False
        try:
            url = f"{self.firebase_url}/{path.lstrip('/')}.json"
            resp = requests.patch(url, json=data, timeout=5)
            return resp.status_code in (200, 204)
        except Exception as e:
            print(f"[Firebase RTDB] PATCH {path} Error: {e}")
            return False

    def _firebase_delete(self, path):
        if not self.use_firebase:
            return False
        try:
            url = f"{self.firebase_url}/{path.lstrip('/')}.json"
            resp = requests.delete(url, timeout=5)
            return resp.status_code in (200, 204)
        except Exception as e:
            print(f"[Firebase RTDB] DELETE {path} Error: {e}")
            return False

    # -------------------------------------------------------------------------
    # SQLite Setup & Helpers
    # -------------------------------------------------------------------------
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_sqlite_db(self):
        """Create SQLite tables if they do not exist (used as cache/fallback)."""
        try:
            with self.get_connection() as conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS queries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        query_text TEXT NOT NULL,
                        mode TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS model_responses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        query_id INTEGER NOT NULL,
                        model_name TEXT NOT NULL,
                        response_text TEXT,
                        latency_ms REAL,
                        status_code INTEGER,
                        rating REAL DEFAULT 0.0,
                        is_correct INTEGER DEFAULT 1,
                        is_hallucinated INTEGER DEFAULT 0,
                        FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE
                    )
                """)
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS contact_messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        phone TEXT,
                        subject TEXT,
                        message TEXT NOT NULL,
                        sent_to_telegram INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS telegram_subscribers (
                        chat_id TEXT PRIMARY KEY,
                        first_name TEXT,
                        username TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.commit()

                # Schema migration check
                cursor = conn.cursor()
                cursor.execute("PRAGMA table_info(model_responses)")
                columns = [row[1] for row in cursor.fetchall()]
                altered = False
                if "is_correct" not in columns:
                    conn.execute("ALTER TABLE model_responses ADD COLUMN is_correct INTEGER DEFAULT 1")
                    altered = True
                if "is_hallucinated" not in columns:
                    conn.execute("ALTER TABLE model_responses ADD COLUMN is_hallucinated INTEGER DEFAULT 0")
                    altered = True
                conn.execute("CREATE INDEX IF NOT EXISTS idx_model_responses_query_id ON model_responses(query_id)")
                conn.execute("CREATE INDEX IF NOT EXISTS idx_model_responses_model_name ON model_responses(model_name)")
                conn.execute("CREATE INDEX IF NOT EXISTS idx_queries_mode ON queries(mode)")
                if altered:
                    conn.commit()
        except Exception as e:
            print(f"[SQLite Init] Warning: {e}")

    # -------------------------------------------------------------------------
    # Core RAG Application Methods
    # -------------------------------------------------------------------------
    def save_query(self, query_text, mode):
        """Save a new user query and return its ID."""
        now_ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        query_id = int(time.time() * 1000)

        # 1. Save to Firebase Realtime Database
        if self.use_firebase:
            fb_data = {
                "id": query_id,
                "query_text": query_text,
                "mode": mode,
                "timestamp": now_ts
            }
            self._firebase_put(f"queries/{query_id}", fb_data)

        # 2. Save to SQLite cache
        try:
            with self.get_connection() as conn:
                conn.execute(
                    "INSERT INTO queries (id, query_text, mode, timestamp) VALUES (?, ?, ?, ?)",
                    (query_id, query_text, mode, now_ts)
                )
                conn.commit()
        except Exception as e:
            print(f"[SQLite save_query] {e}")

        return query_id

    def save_model_response(self, query_id, model_name, response_text, latency_ms, status_code, is_correct=1, is_hallucinated=0, default_rating=0.0):
        """Save an individual model's response details."""
        now_ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        safe_model = model_name.replace("/", "_").replace(".", "_").replace(":", "_")
        resp_id = int(time.time() * 1000)

        # 1. Save to Firebase Realtime Database
        if self.use_firebase:
            fb_data = {
                "id": resp_id,
                "query_id": query_id,
                "model_name": model_name,
                "response_text": response_text,
                "latency_ms": latency_ms,
                "status_code": status_code,
                "rating": default_rating,
                "is_correct": int(is_correct),
                "is_hallucinated": int(is_hallucinated),
                "timestamp": now_ts
            }
            self._firebase_put(f"model_responses/{query_id}_{safe_model}", fb_data)

        # 2. Save to SQLite cache
        try:
            with self.get_connection() as conn:
                conn.execute(
                    """INSERT INTO model_responses 
                       (id, query_id, model_name, response_text, latency_ms, status_code, rating, is_correct, is_hallucinated) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (resp_id, query_id, model_name, response_text, latency_ms, status_code, default_rating, is_correct, is_hallucinated)
                )
                conn.commit()
        except Exception as e:
            print(f"[SQLite save_model_response] {e}")

        return resp_id

    def update_rating(self, response_id, rating):
        """Update the user's accuracy rating for a specific response."""
        try:
            with self.get_connection() as conn:
                conn.execute(
                    "UPDATE model_responses SET rating = ? WHERE id = ?",
                    (rating, response_id)
                )
                conn.commit()
        except Exception:
            pass

    def update_rating_by_query_model(self, query_id, model_name, rating):
        """Update rating using query ID and model name."""
        safe_model = model_name.replace("/", "_").replace(".", "_").replace(":", "_")
        if self.use_firebase:
            self._firebase_patch(f"model_responses/{query_id}_{safe_model}", {"rating": rating})

        try:
            with self.get_connection() as conn:
                conn.execute(
                    "UPDATE model_responses SET rating = ? WHERE query_id = ? AND model_name = ?",
                    (rating, query_id, model_name)
                )
                conn.commit()
        except Exception:
            pass

    def update_evaluation(self, query_id, model_name, is_correct, is_hallucinated):
        """Update is_correct and is_hallucinated values for a specific response."""
        safe_model = model_name.replace("/", "_").replace(".", "_").replace(":", "_")
        patch_data = {}
        if is_correct is not None:
            patch_data["is_correct"] = int(is_correct)
        if is_hallucinated is not None:
            patch_data["is_hallucinated"] = int(is_hallucinated)

        # 1. Update Firebase RTDB
        if self.use_firebase and patch_data:
            self._firebase_patch(f"model_responses/{query_id}_{safe_model}", patch_data)

        # 2. Update SQLite
        try:
            with self.get_connection() as conn:
                if is_correct is not None:
                    conn.execute(
                        "UPDATE model_responses SET is_correct = ? WHERE query_id = ? AND model_name = ?",
                        (int(is_correct), query_id, model_name)
                    )
                if is_hallucinated is not None:
                    conn.execute(
                        "UPDATE model_responses SET is_hallucinated = ? WHERE query_id = ? AND model_name = ?",
                        (int(is_hallucinated), query_id, model_name)
                    )
                conn.commit()
        except Exception:
            pass

    def get_query_history(self, limit=50):
        """Get list of queries and all their responses."""
        if self.use_firebase:
            fb_queries = self._firebase_get("queries")
            fb_responses = self._firebase_get("model_responses")

            if fb_queries:
                responses_by_query = {}
                if isinstance(fb_responses, dict):
                    for resp_key, r in fb_responses.items():
                        if isinstance(r, dict):
                            qid = str(r.get("query_id"))
                            if qid not in responses_by_query:
                                responses_by_query[qid] = []
                            responses_by_query[qid].append({
                                "id": r.get("id"),
                                "model_name": r.get("model_name"),
                                "response_text": r.get("response_text"),
                                "latency_ms": r.get("latency_ms", 0),
                                "status_code": r.get("status_code", 200),
                                "rating": r.get("rating", 0.0),
                                "is_correct": r.get("is_correct", 1),
                                "is_hallucinated": r.get("is_hallucinated", 0)
                            })

                query_list = []
                for q_key, q in fb_queries.items():
                    if isinstance(q, dict):
                        qid_str = str(q.get("id") or q_key)
                        query_list.append({
                            "id": q.get("id") or q_key,
                            "query_text": q.get("query_text", ""),
                            "mode": q.get("mode", "mode1"),
                            "timestamp": q.get("timestamp", ""),
                            "responses": responses_by_query.get(qid_str, [])
                        })

                query_list.sort(key=lambda x: str(x.get("timestamp") or x.get("id")), reverse=True)
                return query_list[:limit]

        # Fallback to SQLite
        try:
            with self.get_connection() as conn:
                queries = conn.execute(
                    "SELECT * FROM queries ORDER BY timestamp DESC LIMIT ?", 
                    (limit,)
                ).fetchall()
                
                history = []
                for q in queries:
                    q_id = q["id"]
                    responses = conn.execute(
                        "SELECT * FROM model_responses WHERE query_id = ?", 
                        (q_id,)
                    ).fetchall()
                    
                    resp_list = []
                    for r in responses:
                        resp_list.append({
                            "id": r["id"],
                            "model_name": r["model_name"],
                            "response_text": r["response_text"],
                            "latency_ms": r["latency_ms"],
                            "status_code": r["status_code"],
                            "rating": r["rating"],
                            "is_correct": r["is_correct"],
                            "is_hallucinated": r["is_hallucinated"]
                        })
                        
                    history.append({
                        "id": q["id"],
                        "query_text": q["query_text"],
                        "mode": q["mode"],
                        "timestamp": q["timestamp"],
                        "responses": resp_list
                    })
                return history
        except Exception:
            return []

    def get_statistics(self):
        """Calculate counts and aggregate ratings/latencies per model based on criteria."""
        if self.use_firebase:
            fb_queries = self._firebase_get("queries") or {}
            fb_responses = self._firebase_get("model_responses") or {}

            query_modes = {}
            mode1_count = 0
            mode2_count = 0
            if isinstance(fb_queries, dict):
                for qk, q in fb_queries.items():
                    if isinstance(q, dict):
                        qid = str(q.get("id") or qk)
                        q_mode = q.get("mode", "mode1")
                        query_modes[qid] = q_mode
                        if q_mode == "mode1":
                            mode1_count += 1
                        elif q_mode == "mode2":
                            mode2_count += 1

            total_questions = len(query_modes)
            stats = {
                "mode1_count": mode1_count,
                "mode2_count": mode2_count,
                "total_questions": total_questions,
                "models": {},
                "models_by_mode": {}
            }

            if total_questions == 0 or not fb_responses:
                return stats

            model_aggs = {}
            model_mode_aggs = {}

            if isinstance(fb_responses, dict):
                for rk, r in fb_responses.items():
                    if not isinstance(r, dict):
                        continue
                    if r.get("status_code", 200) != 200:
                        continue

                    m_name = r.get("model_name")
                    if not m_name:
                        continue

                    qid = str(r.get("query_id"))
                    q_mode = query_modes.get(qid, "mode1")

                    is_corr = int(r.get("is_correct", 1))
                    is_hall = int(r.get("is_hallucinated", 0))
                    lat = float(r.get("latency_ms", 0.0))

                    if m_name not in model_aggs:
                        model_aggs[m_name] = {"count": 0, "correct": 0, "hallucinated": 0, "latency": 0.0}
                    model_aggs[m_name]["count"] += 1
                    model_aggs[m_name]["correct"] += is_corr
                    model_aggs[m_name]["hallucinated"] += is_hall
                    model_aggs[m_name]["latency"] += lat

                    if m_name not in model_mode_aggs:
                        model_mode_aggs[m_name] = {}
                    if q_mode not in model_mode_aggs[m_name]:
                        model_mode_aggs[m_name][q_mode] = {"count": 0, "correct": 0, "hallucinated": 0, "latency": 0.0}
                    model_mode_aggs[m_name][q_mode]["count"] += 1
                    model_mode_aggs[m_name][q_mode]["correct"] += is_corr
                    model_mode_aggs[m_name][q_mode]["hallucinated"] += is_hall
                    model_mode_aggs[m_name][q_mode]["latency"] += lat

            for m_name, agg in model_aggs.items():
                cnt = agg["count"] or 1
                avg_acc = (agg["correct"] / cnt) * 100
                avg_lat = agg["latency"] / cnt
                avg_hall = (agg["hallucinated"] / cnt) * 100
                stats["models"][m_name] = {
                    "avg_rating": round(avg_acc, 2),
                    "avg_accuracy": round(avg_acc, 2),
                    "avg_latency": round(avg_lat, 1),
                    "avg_hallucination": round(avg_hall, 2),
                    "count": agg["count"]
                }

            for m_name, modes in model_mode_aggs.items():
                stats["models_by_mode"][m_name] = {}
                for m_mode, agg in modes.items():
                    cnt = agg["count"] or 1
                    avg_acc = (agg["correct"] / cnt) * 100
                    avg_lat = agg["latency"] / cnt
                    avg_hall = (agg["hallucinated"] / cnt) * 100
                    stats["models_by_mode"][m_name][m_mode] = {
                        "avg_rating": round(avg_acc, 2),
                        "avg_accuracy": round(avg_acc, 2),
                        "avg_latency": round(avg_lat, 1),
                        "avg_hallucination": round(avg_hall, 2),
                        "count": agg["count"]
                    }

            return stats

        # Fallback to SQLite
        try:
            with self.get_connection() as conn:
                total_questions = conn.execute("SELECT COUNT(*) FROM queries").fetchone()[0]
                mode1_count = conn.execute("SELECT COUNT(*) FROM queries WHERE mode = 'mode1'").fetchone()[0]
                mode2_count = conn.execute("SELECT COUNT(*) FROM queries WHERE mode = 'mode2'").fetchone()[0]
                
                stats = {
                    "mode1_count": mode1_count,
                    "mode2_count": mode2_count,
                    "total_questions": total_questions,
                    "models": {},
                    "models_by_mode": {}
                }
                
                if total_questions == 0:
                    return stats
                    
                model_stats = conn.execute("""
                    SELECT 
                        model_name,
                        COUNT(*) as total_responses,
                        SUM(is_correct) as sum_correct,
                        SUM(is_hallucinated) as sum_hallucinated,
                        SUM(latency_ms) as sum_latency_ms
                    FROM model_responses
                    WHERE status_code = 200
                    GROUP BY model_name
                """).fetchall()
                
                for row in model_stats:
                    m_name = row["model_name"]
                    total_resp = row["total_responses"] or 1
                    sum_correct = row["sum_correct"] if row["sum_correct"] is not None else 0
                    sum_hallucinated = row["sum_hallucinated"] if row["sum_hallucinated"] is not None else 0
                    sum_latency_ms = row["sum_latency_ms"] if row["sum_latency_ms"] is not None else 0
                    
                    avg_accuracy = (sum_correct / total_resp) * 100
                    avg_latency = (sum_latency_ms / total_resp)
                    avg_hallucination = (sum_hallucinated / total_resp) * 100
                    
                    stats["models"][m_name] = {
                        "avg_rating": round(avg_accuracy, 2),
                        "avg_accuracy": round(avg_accuracy, 2),
                        "avg_latency": round(avg_latency, 1),
                        "avg_hallucination": round(avg_hallucination, 2),
                        "count": row["total_responses"]
                    }
                    
                model_stats_by_mode = conn.execute("""
                    SELECT 
                        r.model_name,
                        q.mode,
                        COUNT(*) as mode_resp_count,
                        SUM(r.is_correct) as sum_correct,
                        SUM(r.is_hallucinated) as sum_hallucinated,
                        SUM(r.latency_ms) as sum_latency_ms
                    FROM model_responses r
                    JOIN queries q ON r.query_id = q.id
                    WHERE r.status_code = 200
                    GROUP BY r.model_name, q.mode
                """).fetchall()
                
                for row in model_stats_by_mode:
                    model = row["model_name"]
                    mode = row["mode"]
                    mode_resp_count = row["mode_resp_count"] or 1
                    sum_correct = row["sum_correct"] if row["sum_correct"] is not None else 0
                    sum_hallucinated = row["sum_hallucinated"] if row["sum_hallucinated"] is not None else 0
                    sum_latency_ms = row["sum_latency_ms"] if row["sum_latency_ms"] is not None else 0
                    
                    avg_accuracy = (sum_correct / mode_resp_count) * 100
                    avg_latency = (sum_latency_ms / mode_resp_count)
                    avg_hallucination = (sum_hallucinated / mode_resp_count) * 100
                        
                    if model not in stats["models_by_mode"]:
                        stats["models_by_mode"][model] = {}
                    stats["models_by_mode"][model][mode] = {
                        "avg_rating": round(avg_accuracy, 2),
                        "avg_accuracy": round(avg_accuracy, 2),
                        "avg_latency": round(avg_latency, 1),
                        "avg_hallucination": round(avg_hallucination, 2),
                        "count": row["mode_resp_count"]
                    }
                    
                return stats
        except Exception:
            return {"mode1_count": 0, "mode2_count": 0, "total_questions": 0, "models": {}, "models_by_mode": {}}

    def delete_query(self, query_id):
        """Delete a specific query and all its responses."""
        qid_str = str(query_id)
        if self.use_firebase:
            self._firebase_delete(f"queries/{qid_str}")
            fb_responses = self._firebase_get("model_responses") or {}
            if isinstance(fb_responses, dict):
                for rk, r in fb_responses.items():
                    if isinstance(r, dict) and str(r.get("query_id")) == qid_str:
                        self._firebase_delete(f"model_responses/{rk}")

        try:
            with self.get_connection() as conn:
                conn.execute("PRAGMA foreign_keys = ON")
                conn.execute("DELETE FROM model_responses WHERE query_id = ?", (query_id,))
                conn.execute("DELETE FROM queries WHERE id = ?", (query_id,))
                conn.commit()
        except Exception:
            pass

    def clear_history(self):
        """Reset history."""
        if self.use_firebase:
            self._firebase_delete("queries")
            self._firebase_delete("model_responses")

        try:
            with self.get_connection() as conn:
                conn.execute("DELETE FROM model_responses")
                conn.execute("DELETE FROM queries")
                conn.commit()
        except Exception:
            pass

    def save_contact_message(self, name, email, phone, subject, message, sent_to_telegram=0):
        """Save a new contact message and return its ID."""
        msg_id = int(time.time() * 1000)
        now_ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        if self.use_firebase:
            fb_data = {
                "id": msg_id,
                "name": name,
                "email": email,
                "phone": phone,
                "subject": subject,
                "message": message,
                "sent_to_telegram": sent_to_telegram,
                "created_at": now_ts
            }
            self._firebase_put(f"contact_messages/{msg_id}", fb_data)

        try:
            with self.get_connection() as conn:
                conn.execute(
                    """INSERT INTO contact_messages (id, name, email, phone, subject, message, sent_to_telegram, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (msg_id, name, email, phone, subject, message, sent_to_telegram, now_ts)
                )
                conn.commit()
        except Exception:
            pass

        return msg_id

    def save_telegram_subscriber(self, chat_id, first_name="", username=""):
        """Register or update a Telegram subscriber."""
        cid = str(chat_id)
        now_ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        if self.use_firebase:
            fb_data = {
                "chat_id": cid,
                "first_name": first_name or "",
                "username": username or "",
                "created_at": now_ts
            }
            self._firebase_put(f"telegram_subscribers/{cid}", fb_data)

        try:
            with self.get_connection() as conn:
                conn.execute(
                    """INSERT INTO telegram_subscribers (chat_id, first_name, username, created_at)
                       VALUES (?, ?, ?, ?)
                       ON CONFLICT(chat_id) DO UPDATE SET 
                       first_name=excluded.first_name, 
                       username=excluded.username""",
                    (cid, first_name or "", username or "", now_ts)
                )
                conn.commit()
        except Exception:
            pass

    def get_telegram_subscribers(self):
        """Get list of registered Telegram chat IDs."""
        if self.use_firebase:
            fb_subs = self._firebase_get("telegram_subscribers")
            if isinstance(fb_subs, dict):
                return [str(cid) for cid in fb_subs.keys()]

        try:
            with self.get_connection() as conn:
                rows = conn.execute("SELECT chat_id FROM telegram_subscribers").fetchall()
                return [str(r["chat_id"]) for r in rows]
        except Exception:
            return []

    def get_contact_messages(self, limit=50):
        """Get latest contact form submissions."""
        if self.use_firebase:
            fb_msgs = self._firebase_get("contact_messages")
            if isinstance(fb_msgs, dict):
                msg_list = [v for v in fb_msgs.values() if isinstance(v, dict)]
                msg_list.sort(key=lambda x: str(x.get("created_at") or x.get("id")), reverse=True)
                return msg_list[:limit]

        try:
            with self.get_connection() as conn:
                rows = conn.execute(
                    "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?",
                    (limit,)
                ).fetchall()
                return [dict(r) for r in rows]
        except Exception:
            return []
