import asyncio
import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


async def _run(limit: int = 200):
    from app.db.session import SessionLocal
    from app.models.butler import UserMemorySemantic
    from app.services.semantic_memory import semantic_memory_service

    db = SessionLocal()
    try:
        rows = (
            db.query(UserMemorySemantic)
            .filter(UserMemorySemantic.embedding.is_(None))
            .order_by(UserMemorySemantic.id.asc())
            .limit(limit)
            .all()
        )

        updated = 0
        for r in rows:
            vec = await semantic_memory_service.upsert(
                memory_id=int(r.id),
                user_id=int(r.user_id),
                content=r.content,
                tags=r.tags or [],
            )
            if vec:
                r.embedding = vec
                db.add(r)
                updated += 1
        db.commit()
        print(f"processed={len(rows)} updated={updated}")
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(_run())

