import os
import sys
import logging

# Add backend directory to sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.dirname(script_dir)
if os.path.basename(backend_path) != "backend":
    backend_path = os.path.join(backend_path, "backend")

if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from sqlalchemy import Column, Text, String, JSON, text, Float, DateTime, Numeric, Boolean, Integer, BigInteger, inspect, func
from sqlalchemy.dialects.postgresql import JSONB

from app.core.config import settings
from app.db.session import engine

# MUST import all models BEFORE calling metadata.create_all
from app.models.product import Base
from app.models.ledger import UserExt, Wallet, WalletTransaction, CheckinPlan, CheckinLog, AdminAuditLog, ReferralRelationship, GroupBuyCampaign, SystemConfig, UserStreamIdentity, ProcessedWebhookEvent, AISession, Order, AvailableCoupon, CouponIssuanceAudit, SourcingOrder, PriceWish, SquareActivity, Comment
from app.models.butler import UserMemoryFact, UserButlerProfile, PersonaTemplate, AIUsageStats, AIContribution, ShadowIDMapping, UserMemorySemantic, UserIMBinding, BindingCode
from app.models.rewards import PointTransaction, RenewalCard, AIUsageQuota, Points

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def sync_db_schema():
    """
    v4.6.9: Robust Hot Schema Migration.
    Adds missing columns to existing tables by checking existence first.
    """
    # Cross-dialect column type mapping
    def get_type(col, dialect):
        if dialect.name == 'sqlite':
            if isinstance(col.type, JSONB):
                return "JSON"
            if isinstance(col.type, Numeric):
                return "FLOAT"
        return col.type.compile(dialect)

    inspector = inspect(engine)
    
    # 1. Product Table Updates
    cols_product = [
        Column("desire_hook", Text()),
        Column("desire_logic", Text()),
        Column("desire_closing", Text()),
        Column("detail_images", JSONB(), server_default=text("'[]'::jsonb")),
        Column("origin_video_url", Text()),
        Column("certificate_images", JSONB(), server_default=text("'[]'::jsonb")),
        Column("metafields", JSONB(), server_default=text("'{}'::jsonb")),
        Column("visual_fingerprint", Text()),
        Column("titles", JSONB(), server_default=text("'{}'::jsonb")),
        Column("descriptions", JSONB(), server_default=text("'{}'::jsonb")),
        Column("images", JSONB(), server_default=text("'[]'::jsonb")),
        Column("tags", JSONB(), server_default=text("'[]'::jsonb")),
        Column("variants", JSONB(), server_default=text("'[]'::jsonb")),
        Column("amazon_price", Float()),
        Column("ebay_price", Float()),
        Column("amazon_compare_at_price", Float()),
        Column("ebay_compare_at_price", Float()),
        Column("source_platform", Text(), server_default=text("'1688'")),
        Column("source_url", Text()),
        Column("backup_source_url", Text())
    ]
    
    existing_product_cols = [c['name'] for c in inspector.get_columns('products')] if inspector.has_table('products') else []
    
    with engine.connect() as conn:
        for col in cols_product:
            if col.name not in existing_product_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE products ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE products ADD COLUMN {col.name} {type_str}"
                        
                    if col.server_default is not None and engine.dialect.name == 'postgresql':
                        default_text = col.server_default.arg
                        stmt += f" DEFAULT {default_text}"
                    
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to products table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add {col.name} to products: {e}")
                    conn.rollback()
        
        # 2. CandidateProduct Table Updates
        cols_candidate = [
            Column("desire_hook", Text()),
            Column("desire_logic", Text()),
            Column("desire_closing", Text()),
            Column("origin_video_url", Text()),
            Column("certificate_images", JSONB(), server_default=text("'[]'::jsonb")),
            Column("attributes", JSONB(), server_default=text("'[]'::jsonb")),
            Column("logistics_data", JSONB(), server_default=text("'{}'::jsonb")),
            Column("structural_data", JSONB(), server_default=text("'{}'::jsonb")),
            Column("mirror_assets", JSONB(), server_default=text("'{}'::jsonb")),
            Column("visual_fingerprint", Text()),
            Column("images", JSONB(), server_default=text("'[]'::jsonb")),
            Column("discovery_evidence", JSONB(), server_default=text("'{}'::jsonb")),
            Column("supplier_info", JSONB(), server_default=text("'{}'::jsonb")),
            Column("amazon_price", Float()),
            Column("ebay_price", Float()),
            Column("amazon_compare_at_price", Float()),
            Column("ebay_compare_at_price", Float()),
            Column("source_platform", Text(), server_default=text("'1688'")),
            Column("source_url", Text()),
            Column("backup_source_url", Text()),
            Column("alibaba_comparison_price", Float())
        ]
        
        existing_candidate_cols = [c['name'] for c in inspector.get_columns('candidate_products')] if inspector.has_table('candidate_products') else []
        for col in cols_candidate:
            if col.name not in existing_candidate_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE candidate_products ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE candidate_products ADD COLUMN {col.name} {type_str}"
                        
                    if col.server_default is not None and engine.dialect.name == 'postgresql':
                        default_text = col.server_default.arg
                        stmt += f" DEFAULT {default_text}"
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to candidate_products table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add {col.name} to candidate_products: {e}")
                    conn.rollback()
         
         # 3. UserExt Table Updates
        cols_user = [
            Column("inviter_id", BigInteger()),
            Column("email", Text()),
            Column("first_name", Text()),
            Column("last_name", Text()),
            Column("referral_code", Text()),
            Column("user_type", Text(), server_default=text("'customer'")),
            Column("user_tier", Text(), server_default=text("'silver'")),
            Column("kol_status", Text(), server_default=text("'none'")),
            Column("kol_apply_reason", Text()),
            Column("kol_applied_at", DateTime()),
            Column("dist_rate", Numeric(5, 4)),
            Column("fan_rate", Numeric(5, 4)),
            Column("two_factor_secret", Text()),
            Column("is_two_factor_enabled", Boolean(), server_default=text("false")),
            Column("hashed_payment_password", Text()),
            Column("payment_pass_failed_attempts", Integer(), server_default=text("0")),
            Column("payment_pass_locked_until", DateTime()),
            Column("last_login_ip", Text()),
            Column("last_login_at", DateTime()),
            Column("is_active", Boolean(), server_default=text("true"))
        ]
        
        existing_user_cols = [c['name'] for c in inspector.get_columns('users_ext')] if inspector.has_table('users_ext') else []
        for col in cols_user:
            if col.name not in existing_user_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE users_ext ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE users_ext ADD COLUMN {col.name} {type_str}"
                        
                    if col.server_default is not None:
                        default_val = col.server_default.arg
                        if isinstance(default_val, str):
                             stmt += f" DEFAULT {default_val}"
                    
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to users_ext table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add column {col.name} to users_ext: {e}")
                    conn.rollback()

        # 4. Order Table Updates
        cols_order = [
            Column("created_at", DateTime(), server_default=func.now()),
            Column("updated_at", DateTime(), server_default=func.now())
        ]
        existing_order_cols = [c['name'] for c in inspector.get_columns('orders')] if inspector.has_table('orders') else []
        for col in cols_order:
            if col.name not in existing_order_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE orders ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE orders ADD COLUMN {col.name} {type_str}"
                    
                    if engine.dialect.name == 'postgresql':
                        stmt += " DEFAULT CURRENT_TIMESTAMP"
                    
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to orders table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add {col.name} to orders: {e}")
                    conn.rollback()

        # 5. CheckinPlan Table Updates
        cols_checkin = [
            Column("created_at", DateTime(), server_default=func.now()),
            Column("updated_at", DateTime(), server_default=func.now())
        ]
        existing_checkin_cols = [c['name'] for c in inspector.get_columns('checkin_plans')] if inspector.has_table('checkin_plans') else []
        for col in cols_checkin:
            if col.name not in existing_checkin_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE checkin_plans ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE checkin_plans ADD COLUMN {col.name} {type_str}"
                    
                    if engine.dialect.name == 'postgresql':
                        stmt += " DEFAULT CURRENT_TIMESTAMP"
                        
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to checkin_plans table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add {col.name} to checkin_plans: {e}")
                    conn.rollback()

        # 6. UserButlerProfile Table Updates (v5.7.4)
        cols_butler = [
            Column("butler_name", String(100)),
            Column("user_nickname", String(100)),
            Column("active_persona_id", String(50)),
            Column("affinity_score", Integer(), server_default=text("0")),
            Column("current_vibe", String(50)),
            Column("detected_country", String(10)),
            Column("preferred_currency", String(10), server_default=text("'USD'")),
            Column("custom_vectors", JSONB(), server_default=text("'{}'::jsonb")),
            Column("personality", JSONB(), server_default=text("'{}'::jsonb")),
            Column("ai_api_key", String(255)),
            Column("byok_status", String(20), server_default=text("'none'")),
            Column("last_health_check", DateTime())
        ]
        
        existing_butler_cols = [c['name'] for c in inspector.get_columns('user_butler_profiles')] if inspector.has_table('user_butler_profiles') else []
        for col in cols_butler:
            if col.name not in existing_butler_cols:
                try:
                    type_str = get_type(col, engine.dialect)
                    if engine.dialect.name == 'postgresql':
                        stmt = f"ALTER TABLE user_butler_profiles ADD COLUMN IF NOT EXISTS {col.name} {type_str}"
                    else:
                        stmt = f"ALTER TABLE user_butler_profiles ADD COLUMN {col.name} {type_str}"
                        
                    if col.server_default is not None:
                        default_val = col.server_default.arg
                        if isinstance(default_val, str):
                             stmt += f" DEFAULT {default_val}"
                             
                    conn.execute(text(stmt))
                    conn.commit()
                    logger.info(f"✅ Added column {col.name} to user_butler_profiles table.")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to add {col.name} to user_butler_profiles: {e}")
                    conn.rollback()

        # 7. Global Cleanup: Reset invalid butler names (v5.7.15)
        if inspector.has_table('user_butler_profiles'):
            try:
                bad_name = "有什么好产品推荐"
                conn.execute(text("UPDATE user_butler_profiles SET butler_name = NULL WHERE butler_name = :bad_name"), {"bad_name": bad_name})
                conn.commit()
                logger.info(f"🧹 Successfully cleared invalid butler names: {bad_name}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to cleanup butler names: {e}")

        # 8. Create GIN Indexes for JSONB fields (PostgreSQL only)
        if engine.dialect.name == 'postgresql':
            index_stmts = [
                "CREATE INDEX IF NOT EXISTS idx_product_attributes ON products USING gin (attributes)",
                "CREATE INDEX IF NOT EXISTS idx_product_structural_data ON products USING gin (structural_data)",
                "CREATE INDEX IF NOT EXISTS idx_candidate_attributes ON candidate_products USING gin (attributes)",
                "CREATE INDEX IF NOT EXISTS idx_candidate_structural_data ON candidate_products USING gin (structural_data)"
            ]
            for stmt in index_stmts:
                try:
                    conn.execute(text(stmt))
                    conn.commit()
                    print(f"✅ Executed index statement: {stmt}")
                except Exception as e:
                    print(f"⚠️ Index creation failed (might already exist): {e}")

def init_db():
    logger.info("🛠️ Creating tables in database...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tables created successfully.")
    logger.info("🔄 Running hot schema migrations...")
    sync_db_schema()
    logger.info("✅ Schema migrations completed.")

if __name__ == "__main__":
    init_db()
