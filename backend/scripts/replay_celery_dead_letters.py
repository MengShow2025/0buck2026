import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def main() -> int:
    from sqlalchemy.sql import func

    from app.core.celery_app import celery_app
    from app.db.session import SessionLocal
    from app.models.celery import CeleryDeadLetter

    db = SessionLocal()
    try:
        items = (
            db.query(CeleryDeadLetter)
            .filter(CeleryDeadLetter.replayed == False)  # noqa: E712
            .order_by(CeleryDeadLetter.id.asc())
            .limit(50)
            .all()
        )
        for item in items:
            celery_app.send_task(item.task, args=item.args, kwargs=item.kwargs)
            item.replayed = True
            item.replayed_at = func.now()
            db.add(item)
        db.commit()
        print(f"replayed={len(items)}")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())

