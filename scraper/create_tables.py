import sys
import os
import psycopg2
import logging
from config import TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS
from supabase_client import supabase_db

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("CreateTables")

def create_tables_via_postgres(db_password):
    """
    Connects directly to Supabase PostgreSQL database using postgres user password
    and executes schema.sql to create the 3 separate tables.
    """
    db_host = "db.evxjnivabxdlgfvncdcu.supabase.co"
    db_port = 5432
    db_user = "postgres"
    db_name = "postgres"

    schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
    if not os.path.exists(schema_file):
        logger.error("schema.sql not found!")
        return False

    with open(schema_file, "r", encoding="utf-8") as f:
        sql_content = f.read()

    try:
        logger.info(f"Connecting to PostgreSQL at {db_host}:{db_port}...")
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            sslmode="require",
            connect_timeout=10
        )
        conn.autocommit = True
        cursor = conn.cursor()

        logger.info("Executing schema.sql DDL to create tables and policies...")
        cursor.execute(sql_content)
        cursor.close()
        conn.close()

        logger.info("✅ Successfully created tables in Supabase PostgreSQL!")

        # Now trigger sync of cached data into Supabase
        logger.info("Syncing cached data into newly created Supabase tables...")
        for tbl in [TABLE_NATURAL_DISASTERS, TABLE_DISASTER_HAZARDS, TABLE_WEATHER_FORECASTS]:
            items = supabase_db._read_local_cache(tbl)
            if items:
                cnt = supabase_db.insert_items(tbl, items)
                logger.info(f"Synced {cnt} records into {tbl}")

        return True
    except Exception as e:
        logger.error(f"Failed to connect or create tables via PostgreSQL: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pwd = sys.argv[1]
        create_tables_via_postgres(pwd)
    else:
        print("Usage: python create_tables.py [YOUR_SUPABASE_DB_PASSWORD]")
        print("Or run the SQL in schema.sql directly inside the Supabase SQL Editor:")
        print("👉 https://supabase.com/dashboard/project/evxjnivabxdlgfvncdcu/sql/new")
