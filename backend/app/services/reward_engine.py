
from decimal import Decimal
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.butler import AIContribution
from app.services.config_service import ConfigService

class RewardEngine:
    def __init__(self, db: Session):
        self.db = db
        self.config_service = ConfigService(db)

    def track_token_usage(self, user_id: int, tokens: int, model_type: str = "flash"):
        """
        Track token usage and update 'USD Saved' for BYOK users.
        Atomic Update: Uses with_for_update() to prevent double-spending in concurrent tasks.
        """
        # Standard: $50 USD saved = 1 Renewal Card
        reward_threshold = Decimal(str(self.config_service.get("BYOK_REWARD_THRESHOLD_USD", 50.0)))
        
        # Token Pricing (Simulated market value)
        token_price_per_1m = Decimal("1.00") if model_type == "flash" else Decimal("15.00")
        usd_saved = (Decimal(str(tokens)) / Decimal("1000000")) * token_price_per_1m
        
        # Lock the row for this user
        try:
            contribution = self.db.query(AIContribution).filter_by(user_id=user_id).with_for_update().first()
            if not contribution:
                contribution = AIContribution(user_id=user_id, tokens_saved=0, usd_saved=Decimal("0.0"), reward_shards=0, total_rewards_given=0)
                self.db.add(contribution)
                self.db.commit()
                contribution = self.db.query(AIContribution).filter_by(user_id=user_id).with_for_update().first()
        except IntegrityError:
            self.db.rollback()
            contribution = self.db.query(AIContribution).filter_by(user_id=user_id).with_for_update().first()
            
        contribution.tokens_saved = (contribution.tokens_saved or 0) + tokens
        contribution.usd_saved = (contribution.usd_saved or Decimal("0.0")) + usd_saved
        
        # 3. Check for Rewards (Fragment Synthesis)
        shard_value = reward_threshold / Decimal("3")
        
        total_shards_earned = int(contribution.usd_saved / shard_value)
            
        rewards_given = contribution.total_rewards_given or 0
        current_shards = contribution.reward_shards or 0
        tracked_shards = (rewards_given * 3) + current_shards
        
        if total_shards_earned > tracked_shards:
            new_shards = total_shards_earned - tracked_shards
            contribution.reward_shards = current_shards + new_shards
            
            # Auto-synthesize full cards
            while contribution.reward_shards >= 3:
                contribution.reward_shards -= 3
                contribution.total_rewards_given = (contribution.total_rewards_given or 0) + 1
                print(f"  🎉 User {user_id} earned a FULL RENEWAL CARD (v3.1 Reward synthesized)!")
                
        self.db.commit()
        return contribution
