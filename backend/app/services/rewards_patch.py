def get_points_transactions(self, customer_id: int, limit: int = 50) -> list:
    from app.models.finance import PointTransaction
    txs = self.db.query(PointTransaction).filter_by(user_id=customer_id).order_by(
        PointTransaction.created_at.desc()
    ).limit(limit).all()
    return [
        {
            "id": str(tx.id),
            "amount": float(tx.amount),
            "source": tx.source,
            "description": tx.description or tx.source,
            "created_at": tx.created_at.isoformat()
        } for tx in txs
    ]
