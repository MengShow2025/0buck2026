import asyncio

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.butler import UserMemorySemantic
from app.services.semantic_memory import semantic_memory_service


@celery_app.task(
    name="semantic_memory_upsert",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    max_retries=5,
)
def semantic_memory_upsert_task(self, memory_id: int, user_id: int):
    db = SessionLocal()
    try:
        mem = db.query(UserMemorySemantic).filter(
            UserMemorySemantic.id == int(memory_id),
            UserMemorySemantic.user_id == int(user_id),
        ).first()
        if not mem:
            return

        vec = asyncio.run(
            semantic_memory_service.upsert(
                memory_id=int(mem.id),
                user_id=int(mem.user_id),
                content=mem.content,
                tags=mem.tags or [],
            )
        )
        if vec:
            mem.embedding = vec
            db.add(mem)
            db.commit()
    finally:
        db.close()

