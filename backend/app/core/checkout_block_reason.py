from enum import Enum
from typing import Final, FrozenSet


class CheckoutBlockReason(str, Enum):
    INACTIVE = "inactive"
    MISSING_PRICE = "missing_price"
    NOT_PUBLISHED = "not_published"
    UNKNOWN = "unknown"


CHECKOUT_BLOCK_REASON_INACTIVE: Final[str] = "inactive"
CHECKOUT_BLOCK_REASON_MISSING_PRICE: Final[str] = "missing_price"
CHECKOUT_BLOCK_REASON_NOT_PUBLISHED: Final[str] = "not_published"
CHECKOUT_BLOCK_REASON_UNKNOWN: Final[str] = "unknown"

CHECKOUT_BLOCK_REASONS: Final[FrozenSet[str]] = frozenset(
    {
        CHECKOUT_BLOCK_REASON_INACTIVE,
        CHECKOUT_BLOCK_REASON_MISSING_PRICE,
        CHECKOUT_BLOCK_REASON_NOT_PUBLISHED,
        CHECKOUT_BLOCK_REASON_UNKNOWN,
    }
)
