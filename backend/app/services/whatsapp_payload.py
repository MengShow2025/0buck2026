from __future__ import annotations


def extract_whatsapp_message(payload: dict):
    try:
        entry = (payload.get("entry") or [])[0]
        change = (entry.get("changes") or [])[0]
        value = change.get("value") or {}
        message = (value.get("messages") or [])[0]
    except Exception:
        return None

    message_id = message.get("id")
    sender_id = message.get("from")
    msg_type = message.get("type")

    if not message_id or not sender_id:
        return None

    if msg_type == "text":
        text = ((message.get("text") or {}).get("body") or "").strip()
        if not text:
            return None
        return {"message_id": message_id, "sender_id": str(sender_id), "text": text}

    return None

