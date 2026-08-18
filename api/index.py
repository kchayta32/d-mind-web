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
        "name": "OpenThaiGPT-ThaiLLM-8B-Instruct-v7.2",
        "display": "OpenThaiGPT 8B v7.2",
        "provider": "thaillm",
        "api_model": "OpenThaiGPT-ThaiLLM-8B-Instruct-v7.2"
    },
    2: {
        "name": "Pathumma-ThaiLLM-qwen3-8b-think-3.0.0",
        "display": "Pathumma 8B Think 3.0.0",
        "provider": "thaillm",
        "api_model": "Pathumma-ThaiLLM-qwen3-8b-think-3.0.0"
    },
    3: {
        "name": "Typhoon-S-ThaiLLM-8B-Instruct",
        "display": "Typhoon-S 8B Instruct",
        "provider": "thaillm",
        "api_model": "Typhoon-S-ThaiLLM-8B-Instruct"
    },
    4: {
        "name": "THaLLE-0.2-ThaiLLM-8B-fa",
        "display": "THaLLE 0.2 8B FA",
        "provider": "thaillm",
        "api_model": "THaLLE-0.2-ThaiLLM-8B-fa"
    },
    5: {
        "name": "ollama/nemotron-3-super:cloud",
        "display": "Nemotron-3 Super (Local)",
        "provider": "ollama",
        "api_model": "nemotron-3-super:cloud"
    },
    6: {
        "name": "ollama/gemma4",
        "display": "Gemma 4 31B (Local)",
        "provider": "ollama",
        "api_model": "gemma4:31b-cloud"
    },
    7: {
        "name": "gemini-flash-latest",
        "display": "Gemini Flash Latest",
        "provider": "google",
        "api_model": "gemini-flash-latest"
    },
    8: {
        "name": "ollama/gpt-oss:20b-cloud",
        "display": "GPT-OSS 20B (Local)",
        "provider": "ollama",
        "api_model": "gpt-oss:20b-cloud"
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
            url = "http://localhost:11434/api/chat"
            headers = {
                "Content-Type": "application/json"
            }
            payload = {
                "model": api_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "options": {
                    "temperature": 0.0
                },
                "stream": False
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            status_code = resp.status_code
            if resp.status_code == 200:
                resp_json = resp.json()
                response_text = resp_json.get("message", {}).get("content", "").strip()
            else:
                try:
                    err_json = resp.json()
                    response_text = f"Error {resp.status_code}: {err_json.get('error', resp.text)}"
                except:
                    response_text = f"Error {resp.status_code}: {resp.text}"
                    
        elif provider == "openrouter":
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:8080",
                "X-Title": "RAG Model Comparison"
            }
            payload = {
                "model": api_model,
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

# Vercel Serverless WSGI entrypoint alias
handler = app

if __name__ == '__main__':
    print("Starting Comparison Application Server on http://localhost:8080")
    os.makedirs('static', exist_ok=True)
    app.run(host='0.0.0.0', port=8080, debug=True)
