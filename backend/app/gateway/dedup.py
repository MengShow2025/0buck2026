from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.ledger import ProcessedWebhookEvent


def build_event_key(platform: str, event_id: str) -> str:
    normalized_platform = str(platform or "").strip().lower()
    normalized_event_id = str(event_id or "").strip()
    if not normalized_platform or not normalized_event_id:
        raise ValueError("invalid_webhook_event")
    return f"im:{normalized_platform}:{normalized_event_id}"


def is_duplicate_event(db: Session, platform: str, event_id: str) -> bool:
    event_key = build_event_key(platform, event_id)
    try:
        db.add(ProcessedWebhookEvent(event_id=event_key, provider="im_webhook"))
        db.commit()
        return False
    except IntegrityError:
        db.rollback()
        return True
