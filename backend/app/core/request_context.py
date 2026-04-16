from __future__ import annotations

from contextvars import ContextVar
from typing import Optional


request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)

traceparent_var: ContextVar[Optional[str]] = ContextVar("traceparent", default=None)
