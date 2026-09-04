import time
import requests
from flask import Flask, request, jsonify, send_from_directory
import os
import sys

# Ensure current api directory is on sys.path for Vercel runtime
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from database import Database
from supabase_helper import SupabaseHelper

app = Flask(__name__, static_folder='static')

# Initialize DB and Supabase
db = Database()
supabase_helper = SupabaseHelper(lazy=True)

# Model Definitions
MODELS = {
    1: {
        "name": "openthaigpt-thaillm-8b-instruct-v7.2",
        "display": "OpenThaiGPT 8B v7.2",
        "provider": "thaillm",
        "api_model": "OpenThaiGPT-ThaiLLM-8B-Instruct-v7.2"
    },
    2: {
        "name": "pathumma-thaillm-qwen3-8b-think-3.0.0",
        "display": "Pathumma 8B Think 3.0",
        "provider": "thaillm",
        "api_model": "Pathumma-ThaiLLM-qwen3-8b-think-3.0.0"
    },
    3: {
        "name": "typhoon-s-thaillm-8b-instruct",
        "display": "Typhoon-S 8B Instruct",
        "provider": "thaillm",
        "api_model": "Typhoon-S-ThaiLLM-8B-Instruct"
    },
    4: {
        "name": "ollama/gpt-oss:120b-cloud",
        "display": "GPT-OSS 120B (Ollama)",
        "provider": "ollama",
        "api_model": "gpt-oss:120b-cloud"
    },
    5: {
        "name": "ollama/nemotron-3-super:cloud",
        "display": "Nemotron-3 Super (Ollama)",
        "provider": "ollama",
        "api_model": "nemotron-3-super:cloud"
    },
    6: {
        "name": "ollama/gemma4",
        "display": "Gemma 4 31B (Ollama)",
        "provider": "ollama",
        "api_model": "gemma4:31b-cloud"
    },
    7: {
        "name": "openrouter/deepseek-r1:free",
        "display": "DeepSeek R1 (OpenRouter)",
        "provider": "openrouter",
        "api_model": "deepseek/deepseek-r1:free"
    },
    8: {
        "name": "openrouter/llama-3.3-70b:free",
        "display": "Llama 3.3 70B (OpenRouter)",
        "provider": "openrouter",
        "api_model": "meta-llama/llama-3.3-70b-instruct:free"
    }
}

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

THAILLM_API_KEY = os.environ.get("THAILLM_API_KEY", "")
OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY", "")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY") or ""
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8686401520:AAHb2qFnN_t66av6OcwuTHDsZ_wWBVVpNXM")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

SUBJECT_MAP = {
    "general": "สอบถามข้อมูลทั่วไป (General Inquiry)",
    "bug": "รายงานปัญหาการใช้งาน / Bug (Report an Issue / Bug)",
    "collaboration": "ความร่วมมือทางวิชาการ / องค์กร (Academic / Organizational Collaboration)",
    "feedback": "ข้อเสนอแนะเพื่อการพัฒนา (Feedback & Feature Suggestions)"
}

def sync_telegram_subscribers():
    """Fetch updates from Telegram Bot API and register new subscriber chat IDs."""
    if not TELEGRAM_BOT_TOKEN:
        return []
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok"):
                for item in data.get("result", []):
                    chat = None
                    if "message" in item and "chat" in item["message"]:
                        chat = item["message"]["chat"]
                    elif "channel_post" in item and "chat" in item["channel_post"]:
                        chat = item["channel_post"]["chat"]
                    elif "my_chat_member" in item and "chat" in item["my_chat_member"]:
                        chat = item["my_chat_member"]["chat"]
                    elif "callback_query" in item and "message" in item["callback_query"]:
                        chat = item["callback_query"]["message"].get("chat")
                        
                    if chat and "id" in chat:
                        cid = str(chat["id"])
                        first_name = chat.get("first_name") or chat.get("title") or ""
                        username = chat.get("username") or ""
                        db.save_telegram_subscriber(cid, first_name, username)
    except Exception as e:
        print(f"Error syncing Telegram subscribers: {e}")
        
    chats = set(db.get_telegram_subscribers())
    if TELEGRAM_CHAT_ID:
        for cid in TELEGRAM_CHAT_ID.split(","):
            cid = cid.strip()
            if cid:
                chats.add(cid)
    return list(chats)

def send_telegram_alert(html_text):
    """Send formatted alert message to all Telegram subscribers."""
    subscribers = sync_telegram_subscribers()
    sent_count = 0
    if not TELEGRAM_BOT_TOKEN or not subscribers:
        return 0
        
    for chat_id in subscribers:
        try:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": html_text,
                "parse_mode": "HTML",
                "disable_web_page_preview": True
            }
            resp = requests.post(url, json=payload, timeout=10)
            if resp.status_code == 200 and resp.json().get("ok"):
                sent_count += 1
        except Exception as e:
            print(f"Error sending message to Telegram chat {chat_id}: {e}")
            
    return sent_count


# Serves frontend static files
@app.route('/')
@app.route('/api/health', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "llm-arena-api"})

@app.route('/api/start_query', methods=['POST'])
@app.route('/start_query', methods=['POST'])
def start_query():
    data = request.json or {}
    query_text = data.get("query", "").strip()
    mode = data.get("mode", "mode1") # mode1 or mode2
    
    if not query_text:
        return jsonify({"error": "Query cannot be empty"}), 400
        
    # Generate RAG context if Mode 1 or Mode 2
    context = ""
    matches = []
    if mode in ["mode1", "mode2"]:
        search_results = supabase_helper.search(query_text, limit=12)
        context = supabase_helper.format_context_for_llm(search_results)
        
        # Prepare list of matches for reference in frontend UI
        for r in search_results:
            matches.append({
                "table": r["table"],
                "columns": list(r["matched_columns"].keys()),
                "summary": r["summary"]
            })
            
    # Save query to database
    query_id = db.save_query(query_text, mode)
    
    return jsonify({
        "query_id": query_id,
        "context": context,
        "matches": matches
    })

def auto_evaluate_response(response_text, is_context_empty, mode):
    """
    Auto-detect correctness and hallucination status based on response text and context.
    """
    import re
    # Strip <think> reasoning tags if present
    clean_text = re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL).strip().lower()
    
    # Explicit indicators that the model found no data or refused to answer
    explicit_no_data = (
        clean_text.startswith("ไม่พบข้อมูล") or
        clean_text.startswith("ไม่มีข้อมูล") or
        clean_text.startswith("ไม่สามารถค้นหา") or
        "ไม่พบข้อมูลนี้ในฐานข้อมูล" in clean_text or
        "ไม่มีข้อมูลในระบบ" in clean_text or
        (len(clean_text) < 150 and any(kw in clean_text for kw in ["ไม่พบข้อมูล", "ไม่มีข้อมูล", "ไม่ปรากฏข้อมูล"]))
    )
    
    if mode == "mode1" or is_context_empty:
        # If there is no data, the model MUST answer that it cannot find data or cannot verify
        if explicit_no_data:
            # Passed criteria: correct = 1, hallucinated = 0
            return 1, 0
        else:
            # Failed criteria: it generated an answer without backing data (hallucinated)
            return 0, 1
    else:
        # For mode2 (RAG) when we DO have data:
        # If the model strictly states no data and did not provide information from tables, it's incorrect
        if explicit_no_data and not any(kw in clean_text for kw in ["ตาราง", "อยู่ในตาราง", "ข้อมูลจาก", "พบได้ใน"]):
            return 0, 0
        else:
            # Successfully answered using retrieved context
            return 1, 0

@app.route('/api/ask_model', methods=['POST'])
@app.route('/ask_model', methods=['POST'])
def ask_model():
    data = request.json or {}
    query_id = data.get("query_id")
    model_index = data.get("model_index")
    
    if not query_id or not model_index:
        return jsonify({"error": "Missing query_id or model_index"}), 400
        
    model_index = int(model_index)
    if model_index not in MODELS:
        return jsonify({"error": "Invalid model index"}), 400
        
    # Retrieve query details
    with db.get_connection() as conn:
        q = conn.execute("SELECT * FROM queries WHERE id = ?", (query_id,)).fetchone()
        
    if not q:
        return jsonify({"error": "Query not found"}), 404
        
    query_text = q["query_text"]
    mode = q["mode"]
    
    model_info = MODELS[model_index]
    model_name = model_info["name"]
    display_name = model_info["display"]
    provider = model_info["provider"]
    api_model = model_info["api_model"]
    
    # 1. Fetch RAG Context if Mode 1 or Mode 2
    context = ""
    if mode in ["mode1", "mode2"]:
        search_results = supabase_helper.search(query_text, limit=12)
        context = supabase_helper.format_context_for_llm(search_results)
           # 2. Build LLM prompt
    if mode == "mode2":
        prompt = (
            f"[คำสั่งควบคุมระบบ: สำคัญที่สุด]\n"
            f"1. คุณต้องใช้เฉพาะข้อมูลสนับสนุนจากระบบฐานข้อมูล Supabase ที่เตรียมให้ต่อไปนี้เท่านั้นในการตอบคำถาม\n"
            f"2. หากข้อมูลในตารางไม่เพียงพอหรือไม่พบคำตอบในฐานข้อมูลนี้ หรือข้อมูลมีค่าเป็น \"ไม่พบข้อมูลที่เกี่ยวข้องในฐานข้อมูล Supabase\" "
            f"คุณต้องตอบกลับอย่างสุภาพว่า \"ไม่พบข้อมูลนี้ในฐานข้อมูล\" เท่านั้น และห้ามตอบข้อมูลอื่น ห้ามแต่งเรื่อง ห้ามคิดคำตอบเอง ห้ามคาดเดา หรืออิงความรู้ภายนอกระบบโดยเด็ดขาด\n"
            f"3. ห้ามทำนอกเหนือจากคำสั่งนี้อย่างเด็ดขาด\n\n"
            f"=== ข้อมูลสนับสนุนจากฐานข้อมูล Supabase ===\n"
            f"{context}\n\n"
            f"=== คำถามของผู้ใช้ ===\n"
            f"{query_text}\n\n"
            f"[ข้อกำหนดในการตอบกลับ]\n"
            f"- หากพบข้อมูลและสามารถตอบได้: คุณต้องระบุด้วยว่าคุณอ้างอิงหรือใช้ข้อมูลจากตารางอะไรบ้างในการตอบคำถามนี้ โดยระบุชื่อตารางให้ชัดเจน (เช่น 'ข้อมูลนี้อยู่ในตาราง documents')\n"
            f"- หากไม่พบข้อมูล: ให้ตอบว่า \"ไม่พบข้อมูลนี้ในฐานข้อมูล\" เท่านั้น ห้ามตอบอย่างอื่นเด็ดขาด"
        )
    else:
        # mode1: ตอบคำถามที่ไม่มีใน Supabase (หรือคาดว่าจะไม่มี)
        prompt = (
            f"[คำสั่งควบคุมระบบ: สำคัญที่สุด]\n"
            f"1. คุณต้องใช้เฉพาะข้อมูลสนับสนุนจากระบบฐานข้อมูล Supabase ที่เตรียมให้ต่อไปนี้เท่านั้นในการตอบคำถาม\n"
            f"2. คำถามนี้อาจเป็นคำถามที่ไม่มีข้อมูลในระบบ หรือไม่มีข้อมูลอ้างอิงตรงตัว หากข้อมูลในตารางไม่เพียงพอหรือไม่พบคำตอบในฐานข้อมูลนี้ หรือข้อมูลมีค่าเป็น \"ไม่พบข้อมูลที่เกี่ยวข้องในฐานข้อมูล Supabase\" "
            f"คุณต้องตอบกลับอย่างสุภาพว่า \"ไม่พบข้อมูลนี้ในฐานข้อมูล\" เท่านั้น และห้ามตอบข้อมูลอื่น ห้ามแต่งเรื่อง ห้ามคิดคำตอบเอง ห้ามคาดเดา หรืออิงความรู้ภายนอกระบบโดยเด็ดขาด\n"
            f"3. ห้ามทำนอกเหนือจากคำสั่งนี้อย่างเด็ดขาด\n\n"
            f"=== ข้อมูลสนับสนุนจากฐานข้อมูล Supabase ===\n"
            f"{context}\n\n"
            f"=== คำถามของผู้ใช้ ===\n"
            f"{query_text}\n\n"
            f"[ข้อกำหนดในการตอบกลับ]\n"
            f"- หากพบข้อมูลและสามารถตอบได้: คุณต้องระบุด้วยว่าคุณอ้างอิงหรือใช้ข้อมูลจากตารางอะไรบ้างในการตอบคำถามนี้ โดยระบุชื่อตารางให้ชัดเจน\n"
            f"- หากไม่พบข้อมูล: ให้ตอบว่า \"ไม่พบข้อมูลนี้ในฐานข้อมูล\" เท่านั้น ห้ามตอบอย่างอื่นเด็ดขาด"
        )

    # 3. Invoke LLM API
    start_time = time.time()
    response_text = ""
    status_code = 500
    
    try:
        if provider == "thaillm":
            url = "http://thaillm.or.th/api/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {THAILLM_API_KEY}"
            }
            payload = {
                "model": api_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1500,
                "temperature": 0.0
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            status_code = resp.status_code
            if resp.status_code == 200:
                resp_json = resp.json()
                response_text = resp_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            else:
                response_text = f"Error {resp.status_code}: {resp.text}"
                
        elif provider == "ollama":
            ollama_success = False
            # 1. Try local Ollama instance (localhost:11434)
            try:
                url = "http://localhost:11434/api/chat"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "model": api_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "options": {"temperature": 0.0},
                    "stream": False
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=25)
                status_code = resp.status_code
                if resp.status_code == 200:
                    resp_json = resp.json()
                    response_text = resp_json.get("message", {}).get("content", "").strip()
                    ollama_success = True
            except Exception:
                ollama_success = False
                
            # 2. If local unavailable (e.g. deployed on Vercel) and OLLAMA_API_KEY exists, use direct Ollama Cloud API
            if not ollama_success and OLLAMA_API_KEY:
                try:
                    cloud_url = "https://ollama.com/api/chat"
                    cloud_headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {OLLAMA_API_KEY}"
                    }
                    cloud_payload = {
                        "model": api_model,
                        "messages": [{"role": "user", "content": prompt}],
                        "stream": False
                    }
                    cloud_resp = requests.post(cloud_url, headers=cloud_headers, json=cloud_payload, timeout=40)
                    status_code = cloud_resp.status_code
                    if cloud_resp.status_code == 200:
                        cloud_json = cloud_resp.json()
                        response_text = cloud_json.get("message", {}).get("content", "").strip()
                        ollama_success = True
                    else:
                        response_text = f"Error {cloud_resp.status_code}: {cloud_resp.text}"
                except Exception as ex:
                    response_text = f"Error connecting to Ollama Cloud: {str(ex)}"

            if not ollama_success and not response_text:
                status_code = 503
                response_text = "Ollama service is currently unavailable. Please start 'ollama serve' or configure OLLAMA_API_KEY."
                    
        elif provider == "openrouter":
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://d-mind.vercel.app",
                "X-Title": "D-MIND RAG Evaluation"
            }
            # Resilient models routing: requests primary requested model with active free fallbacks
            fallback_map = {
                "deepseek/deepseek-r1:free": ["deepseek/deepseek-r1:free", "minimax/minimax-m3:free", "nvidia/nemotron-3-super-120b-a12b:free"],
                "meta-llama/llama-3.3-70b-instruct:free": ["meta-llama/llama-3.3-70b-instruct:free", "nvidia/nemotron-3-super-120b-a12b:free", "minimax/minimax-m3:free"]
            }
            model_list = fallback_map.get(api_model, [api_model])
            payload = {
                "models": model_list,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.0
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            status_code = resp.status_code
            if resp.status_code == 200:
                resp_json = resp.json()
                response_text = resp_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            else:
                try:
                    err_json = resp.json()
                    response_text = f"Error {resp.status_code}: {err_json.get('error', {}).get('message', resp.text)}"
                except:
                    response_text = f"Error {resp.status_code}: {resp.text}"
                    
        elif provider == "google":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{api_model}:generateContent?key={GOOGLE_API_KEY}"
            headers = {
                "Content-Type": "application/json"
            }
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.0
                }
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            status_code = resp.status_code
            if resp.status_code == 200:
                resp_json = resp.json()
                try:
                    response_text = resp_json["candidates"][0]["content"]["parts"][0]["text"].strip()
                except (KeyError, IndexError):
                    response_text = f"Error: Unexpected Google API response format: {resp_json}"
            else:
                response_text = f"Error {resp.status_code}: {resp.text}"
                    
    except Exception as e:
        status_code = 500
        response_text = f"Failed to connect to API: {str(e)}"
        
    latency_ms = (time.time() - start_time) * 1000
    
    # 3.5 Auto-evaluate response correctness & hallucination
    is_context_empty = True
    if mode in ["mode1", "mode2"]:
        search_results = supabase_helper.search(query_text, limit=8)
        if search_results and len(search_results) > 0:
            is_context_empty = False

    if status_code == 200:
        is_correct, is_hallucinated = auto_evaluate_response(response_text, is_context_empty, mode)
    else:
        is_correct, is_hallucinated = 0, 0

    # 4. Save response to SQLite
    response_id = db.save_model_response(
        query_id=query_id,
        model_name=model_name,
        response_text=response_text,
        latency_ms=latency_ms,
        status_code=status_code,
        is_correct=is_correct,
        is_hallucinated=is_hallucinated
    )
    
    return jsonify({
        "response_id": response_id,
        "model_name": model_name,
        "display_name": display_name,
        "response_text": response_text,
        "latency_ms": latency_ms,
        "status_code": status_code,
        "is_correct": is_correct,
        "is_hallucinated": is_hallucinated
    })

@app.route('/api/rate_response', methods=['POST'])
@app.route('/rate_response', methods=['POST'])
def rate_response():
    data = request.json or {}
    query_id = data.get("query_id")
    model_name = data.get("model_name")
    rating = data.get("rating") # rating value (e.g. 0 to 100, or 1 to 5)
    is_correct = data.get("is_correct")
    is_hallucinated = data.get("is_hallucinated")
    
    if query_id is None or not model_name:
        return jsonify({"error": "Missing query_id or model_name"}), 400
        
    if rating is not None:
        db.update_rating_by_query_model(query_id, model_name, float(rating))
        
    db.update_evaluation(query_id, model_name, is_correct, is_hallucinated)
    return jsonify({"success": True})

@app.route('/api/stats', methods=['GET'])
@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify(db.get_statistics())

@app.route('/api/history', methods=['GET'])
@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(db.get_query_history())

@app.route('/api/delete_query', methods=['POST'])
@app.route('/delete_query', methods=['POST'])
def delete_query():
    data = request.json or {}
    query_id = data.get("query_id")
    if not query_id:
        return jsonify({"error": "Missing query_id"}), 400
    try:
        db.delete_query(int(query_id))
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/clear', methods=['POST'])
@app.route('/clear', methods=['POST'])
def clear_data():
    db.clear_history()
    return jsonify({"success": True})

@app.route('/api/refresh_supabase', methods=['POST'])
@app.route('/refresh_supabase', methods=['POST'])
def refresh_supabase():
    supabase_helper.refresh_cache()
    return jsonify({"success": True})

@app.route('/api/contact', methods=['POST'])
@app.route('/contact', methods=['POST'])
def handle_contact():
    import html
    data = request.json or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    subject = (data.get("subject") or "general").strip()
    message = (data.get("message") or "").strip()
    custom_html = data.get("html_message")

    if not name or not email or not message:
        return jsonify({"error": "Missing required fields: name, email, message"}), 400

    # Build HTML formatted Telegram message if not supplied
    if not custom_html:
        safe_name = html.escape(name)
        safe_email = html.escape(email)
        safe_phone = html.escape(phone) if phone else "ไม่ได้ระบุ"
        subject_title = SUBJECT_MAP.get(subject, html.escape(subject))
        safe_message = html.escape(message)
        
        from datetime import datetime, timezone, timedelta
        bkk_tz = timezone(timedelta(hours=7))
        now_str = datetime.now(bkk_tz).strftime("%d/%m/%Y %H:%M:%S")
        
        custom_html = (
            f"🚨 <b>[D-MIND] มีข้อความติดต่อใหม่ถึงทีมพัฒนา</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"👤 <b>ชื่อ - นามสกุล:</b> {safe_name}\n"
            f"📧 <b>อีเมล:</b> {safe_email}\n"
            f"📞 <b>เบอร์โทรศัพท์:</b> {safe_phone}\n"
            f"📋 <b>หัวข้อการติดต่อ:</b> {subject_title}\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"📝 <b>ข้อความรายละเอียด:</b>\n"
            f"{safe_message}\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"🕒 <b>วัน-เวลาที่ส่ง:</b> {now_str} (ICT)\n"
            f"🌐 <b>แหล่งที่มา:</b> <a href=\"https://d-mind-six.vercel.app/contactme\">D-MIND Web Platform</a>"
        )

    # Broadcast to Telegram bot subscribers
    sent_count = send_telegram_alert(custom_html)

    # Save to SQLite database
    msg_id = db.save_contact_message(
        name=name,
        email=email,
        phone=phone,
        subject=subject,
        message=message,
        sent_to_telegram=1 if sent_count > 0 else 0
    )

    return jsonify({
        "success": True,
        "message_id": msg_id,
        "chat_count": sent_count,
        "telegram_status": "sent" if sent_count > 0 else "saved_pending_subscriber"
    })

@app.route('/api/telegram_subscribers', methods=['GET'])
@app.route('/telegram_subscribers', methods=['GET'])
def get_telegram_subscribers():
    subscribers = sync_telegram_subscribers()
    return jsonify({
        "bot_username": "drmind_alert_bot",
        "subscribers_count": len(subscribers),
        "subscribers": subscribers
    })

# Vercel Serverless WSGI entrypoint alias
handler = app

if __name__ == '__main__':
    print("Starting Comparison Application Server on http://localhost:8080")
    os.makedirs('static', exist_ok=True)
    app.run(host='0.0.0.0', port=8080, debug=True)
