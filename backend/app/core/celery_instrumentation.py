import time

from celery import Task
from prometheus_client import Counter, Histogram

from app.db.session import SessionLocal
from app.models.celery import CeleryDeadLetter


CELERY_TASK_FAILURES_TOTAL = Counter(
    "celery_task_failures_total",
    "Total Celery task failures",
    ["task"],
)

CELERY_TASK_RETRIES_TOTAL = Counter(
    "celery_task_retries_total",
    "Total Celery task retries",
    ["task"],
)

CELERY_TASK_DURATION_SECONDS = Histogram(
    "celery_task_duration_seconds",
    "Celery task duration in seconds",
    ["task"],
)


class InstrumentedTask(Task):
    abstract = True

    def __call__(self, *args, **kwargs):
        start = time.perf_counter()
        try:
            return super().__call__(*args, **kwargs)
        finally:
            CELERY_TASK_DURATION_SECONDS.labels(task=self.name).observe(
                max(0.0, time.perf_counter() - start)
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        CELERY_TASK_FAILURES_TOTAL.labels(task=self.name).inc()

        try:
            retries = int(getattr(self.request, "retries", 0) or 0)
            max_retries = int(getattr(self, "max_retries", 0) or 0)
            if max_retries and retries >= max_retries:
                db = SessionLocal()
                try:
                    db.add(
                        CeleryDeadLetter(
                            task=self.name,
                            task_id=str(task_id),
                            args=list(args) if args is not None else [],
                            kwargs=dict(kwargs) if kwargs is not None else {},
                            error=str(exc)[:500],
                            retries=retries,
                            max_retries=max_retries,
                        )
                    )
                    db.commit()
                finally:
                    db.close()
        except Exception:
            pass
        return super().on_failure(exc, task_id, args, kwargs, einfo)

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        CELERY_TASK_RETRIES_TOTAL.labels(task=self.name).inc()
        return super().on_retry(exc, task_id, args, kwargs, einfo)
