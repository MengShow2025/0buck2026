from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv('.env')

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.begin() as conn:
    conn.execute(text("""
        UPDATE candidate_products 
        SET 
            source_platform = '1688',
            title_zh = '源数据损坏：测试商品 ' || id,
            description_zh = '<p>源数据损坏：测试商品详情</p>',
            cost_cny = 20.0,
            amazon_price = 45.0,
            market_comparison_url = 'https://amazon.com/dp/B000000',
            warehouse_anchor = 'CN',
            category = 'Test Category',
            source_url = 'https://detail.1688.com/offer/' || product_id_1688 || '.html'
        WHERE status = 'pending' AND title_zh IS NULL;
    """))
print("Fixed existing null records.")
