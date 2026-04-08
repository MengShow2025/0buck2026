import asyncio
import os
import sys
import psycopg2

DB_URL = "postgresql://neondb_owner:npg_0XasvoqHEz4Y@ep-still-voice-amdeu23b-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

def list_synced_products():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("📜 DB Products List:")
        cur.execute("SELECT id, title_en, estimated_sale_price FROM products")
        rows = cur.fetchall()
        for r in rows:
            print(f"ID: {r[0]} | Title: {r[1]} | Price: {r[2]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ DB Query Failed: {e}")

if __name__ == "__main__":
    list_synced_products()
