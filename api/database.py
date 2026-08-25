import sqlite3
import os
from datetime import datetime

class Database:
    def __init__(self, db_path=None):
        if db_path is None:
            # Detect any serverless or read-only environment
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
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Create tables if they do not exist."""
        with self.get_connection() as conn:
            # Table to store questions/queries
            conn.execute("""
                CREATE TABLE IF NOT EXISTS queries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    query_text TEXT NOT NULL,
                    mode TEXT NOT NULL, -- 'mode1' or 'mode2'
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            # Table to store responses from each LLM model
            conn.execute("""
                CREATE TABLE IF NOT EXISTS model_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    query_id INTEGER NOT NULL,
                    model_name TEXT NOT NULL,
                    response_text TEXT,
                    latency_ms REAL,
                    status_code INTEGER,
                    rating REAL DEFAULT 0.0, -- rating out of 100 or 5 stars (retained for compatibility)
                    is_correct INTEGER DEFAULT 1, -- 1 = Correct, 0 = Incorrect
                    is_hallucinated INTEGER DEFAULT 0, -- 1 = Hallucinated, 0 = Not Hallucinated
                    FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE
                )
            """)
            # Table to store contact form messages
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
            # Table to store Telegram subscribers / active chat IDs
            conn.execute("""
                CREATE TABLE IF NOT EXISTS telegram_subscribers (
                    chat_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    username TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()

            # Schema migration in case database already exists
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
            
            if altered:
                conn.commit()

    def save_query(self, query_text, mode):
        """Save a new user query and return its ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO queries (query_text, mode) VALUES (?, ?)", 
                (query_text, mode)
            )
            conn.commit()
            return cursor.lastrowid

    def save_model_response(self, query_id, model_name, response_text, latency_ms, status_code, is_correct=1, is_hallucinated=0, default_rating=0.0):
        """Save an individual model's response details."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO model_responses 
                   (query_id, model_name, response_text, latency_ms, status_code, rating, is_correct, is_hallucinated) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (query_id, model_name, response_text, latency_ms, status_code, default_rating, is_correct, is_hallucinated)
            )
            conn.commit()
            return cursor.lastrowid

    def update_rating(self, response_id, rating):
        """Update the user's accuracy rating for a specific response."""
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE model_responses SET rating = ? WHERE id = ?",
                (rating, response_id)
            )
            conn.commit()

    def update_rating_by_query_model(self, query_id, model_name, rating):
        """Update rating using query ID and model name (for compatibility)."""
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE model_responses SET rating = ? WHERE query_id = ? AND model_name = ?",
                (rating, query_id, model_name)
            )
            conn.commit()

    def update_evaluation(self, query_id, model_name, is_correct, is_hallucinated):
        """Update is_correct and is_hallucinated values for a specific response."""
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

    def get_query_history(self, limit=50):
        """Get list of queries and all their responses."""
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

    def get_statistics(self):
        """Calculate counts and aggregate ratings/latencies per model based on criteria."""
        with self.get_connection() as conn:
            # Total questions in database
            total_questions = conn.execute("SELECT COUNT(*) FROM queries").fetchone()[0]
            
            # Counts by mode
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
                
            # Aggregate data per model (overall)
            # Sum of correct (is_correct=1), hallucinated (is_hallucinated=1), and latency_ms
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
                sum_correct = row["sum_correct"] if row["sum_correct"] is not None else 0
                sum_hallucinated = row["sum_hallucinated"] if row["sum_hallucinated"] is not None else 0
                sum_latency_ms = row["sum_latency_ms"] if row["sum_latency_ms"] is not None else 0
                
                # Formulas:
                # 1. ความถูกต้องเฉลี่ย (%) = จำนวนคำตอบที่ถูกต้อง ÷ จำนวนคำถามทั้งหมด × 100
                avg_accuracy = (sum_correct / total_questions) * 100
                
                # 2. เวลาตอบกลับเฉลี่ย (วินาที) = ผลรวมเวลาตอบกลับของทุกคำถาม ÷ จำนวนคำถามทั้งหมด
                # Note: We return avg_latency in ms for front-end compatibility, which divides by 1000 in index.js
                avg_latency = (sum_latency_ms / total_questions)
                
                # 3. อัตราการหลอนของเอไอ (%) = จำนวนคำตอบที่สร้างข้อมูลเองโดยไม่มีแหล่งอ้างอิง ÷ จำนวนคำถามทั้งหมด × 100
                avg_hallucination = (sum_hallucinated / total_questions) * 100
                
                stats["models"][m_name] = {
                    "avg_rating": round(avg_accuracy, 2), # for compatibility with old components
                    "avg_accuracy": round(avg_accuracy, 2),
                    "avg_latency": round(avg_latency, 1),
                    "avg_hallucination": round(avg_hallucination, 2),
                    "count": row["total_responses"]
                }
                
            # Aggregate data per model split by mode
            model_stats_by_mode = conn.execute("""
                SELECT 
                    r.model_name,
                    q.mode,
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
                sum_correct = row["sum_correct"] if row["sum_correct"] is not None else 0
                sum_hallucinated = row["sum_hallucinated"] if row["sum_hallucinated"] is not None else 0
                sum_latency_ms = row["sum_latency_ms"] if row["sum_latency_ms"] is not None else 0
                
                mode_total = mode1_count if mode == 'mode1' else mode2_count
                if mode_total == 0:
                    avg_accuracy = 0.0
                    avg_latency = 0.0
                    avg_hallucination = 0.0
                else:
                    avg_accuracy = (sum_correct / mode_total) * 100
                    avg_latency = (sum_latency_ms / mode_total)
                    avg_hallucination = (sum_hallucinated / mode_total) * 100
                    
                if model not in stats["models_by_mode"]:
                    stats["models_by_mode"][model] = {}
                stats["models_by_mode"][model][mode] = {
                    "avg_rating": round(avg_accuracy, 2),
                    "avg_accuracy": round(avg_accuracy, 2),
                    "avg_latency": round(avg_latency, 1),
                    "avg_hallucination": round(avg_hallucination, 2)
                }
                
            return stats
            
    def delete_query(self, query_id):
        """Delete a specific query and all its responses."""
        with self.get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            conn.execute("DELETE FROM model_responses WHERE query_id = ?", (query_id,))
            conn.execute("DELETE FROM queries WHERE id = ?", (query_id,))
            conn.commit()

    def clear_history(self):
        """Reset history."""
        with self.get_connection() as conn:
            conn.execute("DELETE FROM model_responses")
            conn.execute("DELETE FROM queries")
            conn.commit()

    def save_contact_message(self, name, email, phone, subject, message, sent_to_telegram=0):
        """Save a new contact message and return its ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO contact_messages (name, email, phone, subject, message, sent_to_telegram)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (name, email, phone, subject, message, sent_to_telegram)
            )
            conn.commit()
            return cursor.lastrowid

    def save_telegram_subscriber(self, chat_id, first_name="", username=""):
        """Register or update a Telegram subscriber."""
        with self.get_connection() as conn:
            conn.execute(
                """INSERT INTO telegram_subscribers (chat_id, first_name, username)
                   VALUES (?, ?, ?)
                   ON CONFLICT(chat_id) DO UPDATE SET 
                   first_name=excluded.first_name, 
                   username=excluded.username""",
                (str(chat_id), first_name or "", username or "")
            )
            conn.commit()

    def get_telegram_subscribers(self):
        """Get list of registered Telegram chat IDs."""
        with self.get_connection() as conn:
            rows = conn.execute("SELECT chat_id FROM telegram_subscribers").fetchall()
            return [str(r["chat_id"]) for r in rows]

    def get_contact_messages(self, limit=50):
        """Get latest contact form submissions."""
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?",
                (limit,)
            ).fetchall()
            return [dict(r) for r in rows]
