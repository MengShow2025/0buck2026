import asyncio

from app.core.celery_app import celery_app
from app.core.celery_instrumentation import InstrumentedTask


@celery_app.task(
    name="stream_ai_response",
    bind=True,
    base=InstrumentedTask,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    max_retries=5,
)
def stream_ai_response_task(self, user_id: str, channel_type: str, channel_id: str, content: str):
    from app.api.stream import process_ai_response

    asyncio.run(process_ai_response(user_id, channel_type, channel_id, content))
