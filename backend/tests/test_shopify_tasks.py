import pytest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from app.workers.shopify_tasks import process_paid_order

@pytest.fixture
def mock_db_session():
    with patch('app.workers.shopify_tasks.SessionLocal') as mock_session:
        session_instance = MagicMock()
        mock_session.return_value = session_instance
        yield session_instance

@pytest.fixture
def sample_payload():
    return {
        "id": 12345,
        "name": "#1001",
        "current_total_price": "50.00",
        "customer": {
            "id": 999
        },
        "line_items": [
            {
                "variant_id": "v1",
                "quantity": 1,
                "price": "50.00"
            }
        ],
        "note_attributes": []
    }

def test_process_paid_order_missing_ids(mock_db_session):
    # Test early exit when customer_id or order_id is missing
    payload = {"id": 12345} # Missing customer
    
    result = process_paid_order(payload)
    
    assert result == {"status": "skipped"}
    mock_db_session.add.assert_not_called()
