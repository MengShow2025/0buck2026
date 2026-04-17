from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv('.env')

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN is_melted BOOLEAN DEFAULT FALSE;"))
        conn.commit()
        print("Added products.is_melted")
    except Exception as e:
        conn.rollback()
        print("is_melted exists")

    try:
        conn.execute(text("ALTER TABLE products RENAME COLUMN melt_reason TO melting_reason;"))
        conn.commit()
        print("Renamed melt_reason to melting_reason")
    except Exception as e:
        conn.rollback()
        try:
            conn.execute(text("ALTER TABLE products ADD COLUMN melting_reason VARCHAR;"))
            conn.commit()
            print("Added products.melting_reason")
        except Exception as e2:
            conn.rollback()
            print("melting_reason exists")

    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN melted_at TIMESTAMP;"))
        conn.commit()
        print("Added products.melted_at")
    except Exception as e:
        conn.rollback()
        print("melted_at exists")

print("Done.")