import asyncio

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.services.reflection_service import run_butler_learning


@celery_app.task(
    name="butler_learning",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    max_retries=5,
)
def run_butler_learning_task(self, history_dicts, user_id):
    db = SessionLocal()
    try:
        asyncio.run(run_butler_learning(history_dicts, user_id, db))
    finally:
        db.close()
