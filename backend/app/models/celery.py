from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean
from sqlalchemy.sql import func

from .product import Base


class CeleryDeadLetter(Base):
    __tablename__ = "celery_dead_letters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task = Column(String(200), index=True, nullable=False)
    task_id = Column(String(100), index=True, nullable=False)
    args = Column(JSON, nullable=False)
    kwargs = Column(JSON, nullable=False)
    error = Column(String(500), nullable=False)
    retries = Column(Integer, default=0, nullable=False, server_default="0")
    max_retries = Column(Integer, default=0, nullable=False, server_default="0")

    replayed = Column(Boolean, default=False, nullable=False, server_default="false")
    replayed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())

