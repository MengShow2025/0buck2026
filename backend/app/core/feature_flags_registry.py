from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Literal, Optional


FlagType = Literal["bool", "percent", "json"]


@dataclass(frozen=True)
class FeatureFlagDef:
    key: str
    type: FlagType
    default: object
    owner: str
    description: str
    sunset: Optional[str] = None


FEATURE_FLAGS: Dict[str, FeatureFlagDef] = {
    "ff.ai.enable_pro_fallback": FeatureFlagDef(
        key="ff.ai.enable_pro_fallback",
        type="bool",
        default=True,
        owner="ai",
        description="Allow pro-model fallback when flash fails",
    ),
}

