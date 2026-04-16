from __future__ import annotations

from typing import Any, Optional

from app.core.feature_flags import is_in_rollout
from app.services.config_service import ConfigService


class FeatureFlagService:
    def __init__(self, config: ConfigService):
        self.config = config

    def enabled(self, key: str, subject: Optional[str] = None, default: bool = False) -> bool:
        value = self.config.get(key, default)

        if isinstance(value, bool):
            return value

        if isinstance(value, (int, float)):
            if subject is None:
                return default
            return is_in_rollout(seed=key, subject=str(subject), percent=int(value))

        if isinstance(value, dict):
            if value.get("enabled") is False:
                return False
            allow = value.get("allow")
            if allow and subject is not None and str(subject) in {str(x) for x in allow}:
                return True
            percent = value.get("percent")
            if percent is None:
                return bool(value.get("enabled", default))
            if subject is None:
                return default
            seed = str(value.get("seed") or key)
            return is_in_rollout(seed=seed, subject=str(subject), percent=int(percent))

        return bool(default)

