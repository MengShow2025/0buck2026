import pytest
from pydantic import ValidationError

from app.schemas.products import ProductResponse


def _base_payload():
    return {
        "id": 1,
        "title": "Demo Product",
        "price": "10.00",
        "original_price": "12.00",
        "image": "https://example.com/a.png",
        "supplier": "0Buck",
        "category": "General",
        "attributes": {},
        "structural_data": {},
    }


def test_product_response_rejects_unknown_checkout_block_reason():
    payload = _base_payload()
    payload["checkout_block_reason"] = "random_reason"

    with pytest.raises(ValidationError):
        ProductResponse(**payload)


def test_product_response_accepts_enum_checkout_block_reason():
    payload = _base_payload()
    payload["checkout_block_reason"] = "inactive"

    obj = ProductResponse(**payload)

    assert str(obj.checkout_block_reason.value) == "inactive"
