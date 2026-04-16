import asyncio

from app.core.celery_app import celery_app
from app.core.celery_instrumentation import InstrumentedTask


@celery_app.task(
    name="im_brain_process",
    bind=True,
    base=InstrumentedTask,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    max_retries=5,
)
def im_brain_process_task(self, platform: str, platform_uid: str, text: str, chat_id: str, chat_type: str):
    from app.api.im_gateway import (
        generic_brain_process,
        send_discord_message,
        send_feishu_message,
        send_telegram_message,
        send_whatsapp_message,
    )

    if platform == "feishu":
        send_func = send_feishu_message
    elif platform == "telegram":
        send_func = send_telegram_message
    elif platform == "whatsapp":
        send_func = send_whatsapp_message
    elif platform == "discord":
        send_func = send_discord_message
    else:
        send_func = send_whatsapp_message

    asyncio.run(generic_brain_process(platform, platform_uid, text, chat_id, chat_type, send_func))
