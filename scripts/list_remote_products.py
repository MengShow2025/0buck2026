import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')
engine_remote = create_engine(DATABASE_URL)

def list_remote_products():
    with engine_remote.connect() as conn:
        result = conn.execute(text("SELECT id, product_id_1688, title_en, images FROM products ORDER BY id;"))
        products = result.fetchall()
        print(f"Total remote products: {len(products)}")
        for p in products:
            img_snippet = p[3][:50] if p[3] else "None"
            print(f"ID: {p[0]} | 1688 ID: {p[1]} | Title: {p[2]} | Images: {img_snippet}...")

if __name__ == "__main__":
    list_remote_products()
