import os
import threading
import time
import logging
import requests
from flask import Flask, request, jsonify, send_from_directory

from config import SERVER_PORT, DEBUG_MODE, SCRAPE_INTERVAL_MINUTES, SUPABASE_URL
from supabase_client import supabase_db
from scrapers.runner import scraper_runner

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AppServer")

app = Flask(__name__, static_folder="static")

# ==============================================================================
# Web Routes (Static Frontend)
# ==============================================================================
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# ==============================================================================
# REST API Endpoints
# ==============================================================================
@app.route("/api/news", methods=["GET"])
def get_news():
    """
    Returns list of news filtered by category, severity, source, or keyword search.
    Query Params:
      - category: 'all' | 'natural' | 'hazard' | 'forecast'
      - severity: 'วิกฤต/รุนแรง' | 'เตือนภัย' | 'เฝ้าระวัง' | 'ปกติ'
      - source: string keyword
      - search: string keyword
      - limit: integer (default 50)
      - offset: integer (default 0)
    """
    category = request.args.get("category", "all")
    severity = request.args.get("severity")
    source = request.args.get("source")
    search = request.args.get("search")
    limit = int(request.args.get("limit", 60))
    
    news_items = supabase_db.get_all_news(
        limit=limit,
        category=category,
        severity=severity,
        source=source,
        search=search
    )
    
    return jsonify({
        "status": "success",
        "count": len(news_items),
        "data": news_items
    })

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Returns summarized stats, table counts, severity breakdown, and Supabase status."""
    stats = supabase_db.get_stats()
    return jsonify({
        "status": "success",
        "stats": stats
    })

@app.route("/api/scrape", methods=["POST"])
def trigger_scrape():
    """Triggers an on-demand web scrape across all sources and synchronizes with Supabase."""
    logger.info("Manual scraping triggered via API...")
    res = scraper_runner.run_all()
    return jsonify(res)

@app.route("/api/map-data", methods=["GET"])
def get_map_data():
    """Returns geographical coordinates for disaster map markers."""
    points = supabase_db.get_map_points()
    return jsonify({
        "status": "success",
        "count": len(points),
        "points": points
    })

@app.route("/api/db-status", methods=["GET"])
def get_db_status():
    """Checks Supabase connection and tables verification."""
    table_status = supabase_db.check_all_tables()
    return jsonify({
        "status": "success",
        "supabase_url": SUPABASE_URL,
        "tables": table_status
    })

@app.route("/api/sync-supabase", methods=["POST"])
def sync_supabase():
    """Forces re-check of Supabase tables and pushes all cached items to Supabase."""
    from config import TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS
    supabase_db.check_all_tables()
    
    synced_counts = {}
    for tbl in [TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS]:
        items = supabase_db._read_local_cache(tbl)
        if items and supabase_db.table_status.get(tbl, False):
            # Attempt to insert directly into Supabase
            try:
                url = f"{supabase_db.base_url}{tbl}"
                # Deduplicate against existing on remote or insert in chunks
                res = requests.post(url, headers=supabase_db.headers, json=items, timeout=12)
                synced_counts[tbl] = len(items) if res.status_code in [200, 201] else 0
            except Exception as e:
                logger.error(f"Error syncing {tbl}: {e}")
                synced_counts[tbl] = 0
        else:
            synced_counts[tbl] = 0

    return jsonify({
        "status": "success",
        "tables_status": supabase_db.table_status,
        "synced": synced_counts
    })

@app.route("/api/schema-sql", methods=["GET"])
def get_schema_sql():
    """Returns the SQL schema for easy copying in frontend Supabase modal."""
    sql_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    sql_content = ""
    if os.path.exists(sql_path):
        with open(sql_path, "r", encoding="utf-8") as f:
            sql_content = f.read()
    return jsonify({
        "status": "success",
        "sql": sql_content
    })

# ==============================================================================
# Background Scheduler for Auto-Refresh
# ==============================================================================
def background_scraper_daemon():
    """Runs periodic scraping in the background every SCRAPE_INTERVAL_MINUTES."""
    time.sleep(3)  # Wait for server startup
    logger.info("Starting initial background scrape...")
    try:
        scraper_runner.run_all()
    except Exception as e:
        logger.error(f"Initial scrape error: {e}")

    while True:
        try:
            time.sleep(SCRAPE_INTERVAL_MINUTES * 60)
            logger.info("Running scheduled background scrape...")
            scraper_runner.run_all()
        except Exception as e:
            logger.error(f"Scheduled scrape error: {e}")

if __name__ == "__main__":
    # Start background scheduler thread
    bg_thread = threading.Thread(target=background_scraper_daemon, daemon=True)
    bg_thread.start()

    logger.info(f"Starting Disaster & Weather News Web on http://localhost:{SERVER_PORT}")
    app.run(host="0.0.0.0", port=SERVER_PORT, debug=False)
