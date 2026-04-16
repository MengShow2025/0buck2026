from celery import Celery
from app.core.config import settings
from app.core.celery_instrumentation import InstrumentedTask

redis_url = settings.REDIS_URI

celery_app = Celery(
    "0buck",
    broker=redis_url,
    backend=redis_url,
    include=[
        "app.workers.shopify_tasks",
        "app.workers.butler_tasks",
        "app.workers.stream_tasks",
        "app.workers.im_tasks",
        "app.workers.memory_tasks",
    ],
)

celery_app.Task = InstrumentedTask

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,
    broker_transport_options={"visibility_timeout": 3600},
    task_default_retry_delay=30,
    task_max_retries=5,
    task_soft_time_limit=55,
    task_time_limit=60,
)
