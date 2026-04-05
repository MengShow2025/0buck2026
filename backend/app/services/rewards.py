from datetime import datetime, date, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from decimal import Decimal
from zoneinfo import ZoneInfo
from backend.app.models.rewards import (
    PointSource, PointTransaction, AIUsageQuota, Points, RenewalCard
)
from backend.app.models.ledger import (
    UserExt, Wallet, WalletTransaction, CheckinPlan, CheckinLog, ReferralRelationship, GroupBuyCampaign, Order
)

class RewardsService:
    def __init__(self, db: Session):
        self.db = db
        from backend.app.services.config_service import ConfigService
        self.config_service = ConfigService(db)

    def _generate_v3_plan_config(self) -> List[dict]:
        """
        v3.0 Golden Random Engine (Boss's Official Config):
        - P1: { r: 4, d: 5 } (Fixed)
        - P2: { r: 6, d: 10 } (Fixed)
        - P3-P20: 18 Randomized phases from 'Golden Package'
        - Late Explosion: 8%/10% hits have 80% weight in P11-P20.
        """
        import random
        
        # 1. Start with Fixed Foundation
        plan = [
            {"period": 1, "days": 5, "reward": 4},
            {"period": 2, "days": 10, "reward": 6}
        ]
        
        # 2. Define the 'Golden Package' Pools
        big_hits = [
            {"reward": 8, "days": 30, "type": "explosion"},
            {"reward": 10, "days": 30, "type": "explosion"}
        ]
        
        # 5 units of 5%/30d
        normal_30d = [{"reward": 5, "days": 30, "type": "normal"} for _ in range(5)]
        
        # 11 units of 25d with varied rewards
        normal_25d = (
            [{"reward": 5, "days": 25, "type": "normal"} for _ in range(4)] +
            [{"reward": 3, "days": 25, "type": "normal"} for _ in range(1)] +
            [{"reward": 4, "days": 25, "type": "normal"} for _ in range(6)]
        )
        
        all_normals = normal_30d + normal_25d
        random.shuffle(all_normals)
        
        # 3. Structural Probability Distribution (P3-P20)
        # Early: P3-P10 (8 slots) | Late: P11-P20 (10 slots)
        slots = [None] * 18
        
        # Place big hits with 80% weight towards Late Stage
        for hit in big_hits:
            # 0.2 prob for index 0-7 (P3-P10), 0.8 prob for index 8-17 (P11-P20)
            target_stage = 'late' if random.random() < 0.8 else 'early'
            
            placed = False
            while not placed:
                if target_stage == 'early':
                    idx = random.randint(0, 7)
                else:
                    idx = random.randint(8, 17)
                
                if slots[idx] is None:
                    slots[idx] = hit
                    placed = True
        
        # 4. Fill remaining 16 slots with normals
        for i in range(18):
            if slots[i] is None:
                slots[i] = all_normals.pop()
        
        # 5. Assemble into Plan
        for i, unit in enumerate(slots):
            plan.append({
                "period": i + 3,
                "days": unit["days"],
                "reward": unit["reward"]
            })
            
        return plan

    def _get_period_config(self, plan: CheckinPlan, period_num: int) -> dict:
        """
        v3.0: Read the randomized configuration from the plan's specific roadmap.
        """
        if not plan.plan_config:
            # Fallback if config was missing (though init should handle it)
            return {"days": 30, "reward": 5}
            
        for p in plan.plan_config:
            if p["period"] == period_num:
                return {"days": p["days"], "ratio": p["reward"]}
                
        return {"days": 30, "ratio": 5}

    def _get_period_days(self, plan: CheckinPlan, period_num: int) -> int:
        return self._get_period_config(plan, period_num)["days"]

    def _get_local_today(self, timezone_str: str) -> date:
        tz = ZoneInfo(timezone_str) if timezone_str else ZoneInfo("UTC")
        return datetime.now(tz).date()

    # --- User & Level Management ---

    def ensure_user_exists(self, customer_id: int):
        user_ext = self.db.query(UserExt).filter_by(customer_id=customer_id).first()
        if not user_ext:
            # Generate a referral code for new users
            import string
            import random
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            user_ext = UserExt(customer_id=customer_id, referral_code=code)
            self.db.add(user_ext)
            
            # Create Wallet
            wallet = Wallet(user_id=customer_id)
            self.db.add(wallet)
            
            # Create Points Record & Award Registration Bonus (50 pts)
            points = Points(user_id=customer_id, balance=50, total_earned=50)
            self.db.add(points)
            
            txn = PointTransaction(
                user_id=customer_id,
                amount=50,
                source=PointSource.REGISTRATION
            )
            self.db.add(txn)
            
            self.db.commit()
            self.db.refresh(user_ext)
        return user_ext

    def get_user_level(self, customer_id: int) -> dict:
        """
        v3.0 Final Distribution Tiers:
        Silver: Default (1.5%)
        Gold: 5 real users OR $500 volume (2.0%)
        Platinum: 20 real users OR $2,000 volume (3.0%)
        """
        two_years_ago = datetime.now() - timedelta(days=730)
        
        # 1. Calculate Referral Volume (2-year rolling)
        total_volume = self.db.query(func.sum(WalletTransaction.amount)).filter(
            WalletTransaction.user_id == customer_id,
            WalletTransaction.type == 'referral',
            WalletTransaction.status == 'completed',
            WalletTransaction.created_at >= two_years_ago
        ).scalar() or Decimal('0.0')

        # 2. Count Active Invitees (Paid Users with at least one qualifying order in the last 2 years)
        # Criteria: order status in ('paid', 'shipped', 'completed') and not refunded.
        active_invitees_count = self.db.query(func.count(distinct(ReferralRelationship.invitee_id))).\
            join(Order, Order.user_id == ReferralRelationship.invitee_id).\
            filter(
                ReferralRelationship.inviter_id == customer_id,
                ReferralRelationship.start_at >= two_years_ago,
                Order.created_at >= two_years_ago,
                Order.status.in_(['paid', 'shipped', 'completed']),
                Order.refund_status != 'refunded'
            ).scalar() or 0

        if active_invitees_count >= 20 or total_volume >= 2000:
            level = "Platinum"
            rate = Decimal('0.030')
        elif active_invitees_count >= 5 or total_volume >= 500:
            level = "Gold"
            rate = Decimal('0.020')
        else:
            level = "Silver"
            rate = Decimal('0.015')

        # Sync back to UserExt model
        user = self.db.query(UserExt).filter_by(customer_id=customer_id).first()
        if user and user.user_tier != level.lower():
            user.user_tier = level.lower()
            self.db.commit()

        return {"level": level, "rate": rate, "total_volume": total_volume, "invitees": active_invitees_count}

    # --- Check-in Logic ---

    def init_checkin_plan(self, customer_id: int, order_id: int, reward_base: Decimal, timezone: str = "UTC"):
        self.ensure_user_exists(customer_id)
        
        plan = self.db.query(CheckinPlan).filter_by(order_id=order_id).first()
        if plan:
            return plan
            
        plan = CheckinPlan(
            user_id=customer_id,
            order_id=order_id,
            reward_base=reward_base,
            status='pending_choice',
            timezone=timezone,
            expires_at=datetime.now() + timedelta(days=500),
            plan_config=self._generate_v3_plan_config() # v3.0: Generate random engine on init
        )
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def start_checkin_plan(self, customer_id: int, plan_id: str) -> dict:
        plan = self.db.query(CheckinPlan).filter_by(id=plan_id, user_id=customer_id).first()
        if not plan:
            return {"status": "error", "message": "No plan found."}
        
        if plan.status == 'pending_choice':
            plan.status = 'active_checkin'
            plan.confirmed_at = datetime.now()
            self.db.commit()
            return {"status": "success", "message": "Check-in plan activated!"}
        
        return {"status": "error", "message": f"Plan is in status {plan.status}"}

    def process_checkin(self, customer_id: int, plan_id: str) -> dict:
        """
        Strict Consecutive Rule:
        - Consecutive: advance days, potentially period.
        - Missed: Skip to next period Day 1, reward lost.
        - Points Award: 10-50 pts per check-in.
        """
        plan = self.db.query(CheckinPlan).filter_by(id=plan_id, user_id=customer_id).first()
        if not plan or plan.status != 'active_checkin':
            return {"status": "error", "message": "No active check-in plan found."}

        today = self._get_local_today(plan.timezone)
        if plan.last_checkin_at == today:
            return {"status": "error", "message": "Already checked in today."}

        # Check for 500-day expiration
        if plan.expires_at and datetime.now(ZoneInfo("UTC")).timestamp() >= plan.expires_at.timestamp():
            self.settle_final_reward(plan)
            return {"status": "error", "message": "Plan expired. Final settlement processed."}

        is_consecutive = False
        if not plan.last_checkin_at:
            is_consecutive = True
        elif plan.last_checkin_at == today - timedelta(days=1):
            is_consecutive = True
        else:
            # Check for 5-day grace period
            if (today - plan.last_checkin_at).days <= 5:
                # Check if a card was ALREADY used for this specific period
                already_used = self.db.query(RenewalCard).filter_by(
                    user_id=customer_id,
                    plan_id=plan.id,
                    status="used",
                    period_num=plan.current_period
                ).first()
                
                if not already_used:
                    # Find an unused card to redeem the streak
                    card = self.db.query(RenewalCard).filter_by(
                        user_id=customer_id, 
                        plan_id=plan.id, 
                        status="unused"
                    ).first()
                    if card:
                        is_consecutive = True
                        card.status = "used"
                        card.period_num = plan.current_period # Record the phase it protected
                        card.used_at = datetime.now()
                        print(f"Used Renewal Card for user {customer_id} in Phase {plan.current_period}")

        if is_consecutive:
            plan.consecutive_days += 1
            days_per_period = self._get_period_days(plan, plan.current_period)
            if plan.consecutive_days >= days_per_period:
                self._payout_period_reward(plan)
                plan.current_period += 1
                plan.consecutive_days = 0
                if plan.current_period > 20:
                    plan.status = 'completed'
        else:
            # Missed a day and no card used.
            plan.current_period += 1
            plan.consecutive_days = 1
            if plan.current_period > 20:
                plan.status = 'completed'

        plan.last_checkin_at = today
        
        # Award check-in points (variable 10-50 based on period)
        point_reward = 10 if plan.current_period <= 2 else 20
        self.award_points(customer_id, point_reward, PointSource.SIGN_IN)

        log = CheckinLog(
            plan_id=plan.id,
            checkin_date=today,
            period_num=plan.current_period,
            day_num=plan.consecutive_days
        )
        self.db.add(log)
        self.db.commit()

        return {
            "status": "success", 
            "period": plan.current_period, 
            "day": plan.consecutive_days,
            "consecutive": is_consecutive,
            "points_earned": point_reward
        }

    def _payout_period_reward(self, plan: CheckinPlan):
        """
        v3.0 Payout logic with Group Buy suppression.
        - If Group Buy (3-person free order) is successful, NO MORE cashback is paid.
        """
        # 1. Check if this order has a successful Group Buy campaign
        gb = self.db.query(GroupBuyCampaign).filter_by(
            owner_order_id=plan.order_id, 
            status="success"
        ).first()
        
        if gb:
            print(f"Skipping P{plan.current_period} reward for Order {plan.order_id} - Group Buy Success (Free Order).")
            # Mark plan as completed since no more cashback is allowed after free order
            plan.status = "free_refunded"
            return

        config = self._get_period_config(plan, plan.current_period)
        ratio = Decimal(str(config["ratio"])) / Decimal('100')
        reward_amount = plan.reward_base * ratio
        self.update_wallet_balance(
            plan.user_id, 
            reward_amount, 
            'checkin', 
            plan.order_id, 
            f"Check-in reward for Period {plan.current_period} ({config['ratio']}%)"
        )
        plan.total_earned += reward_amount

    def check_group_buy_success(self, order_id: int):
        """
        v3.4.4 Boss Logic: 1 (Initiator) + 3 (Invitees) = 4 total orders.
        Success is triggered when current_count >= 3 (representing 3 invitees).
        Window: Must succeed within 5 days (P1) of campaign creation.
        """
        campaign = self.db.query(GroupBuyCampaign).filter(GroupBuyCampaign.owner_order_id == order_id).first()
        if not campaign or campaign.status != "open":
            return

        # Check 5-day window (P1)
        days_active = (datetime.now() - campaign.created_at).days
        if days_active > 5:
            campaign.status = "expired"
            self.db.commit()
            print(f"Group Buy Expired for Order {order_id} (Exceeded 5-day P1 window).")
            return

        if campaign.current_count >= campaign.required_count: # required_count is 3 invites
            campaign.status = "success"
            # Mark the initiator's plan as 'free_refunded'
            plan = self.db.query(CheckinPlan).filter(CheckinPlan.order_id == order_id).first()
            if plan:
                plan.status = "free_refunded"
                # Logic to trigger actual refund via Shopify would go here
                print(f"Group Buy Success! Order {order_id} marked for refund.")
            self.db.commit()

    def join_group_buy(self, order_id: int, share_code: str):
        """
        Increment the invitee count for a group buy campaign.
        """
        campaign = self.db.query(GroupBuyCampaign).filter_by(share_code=share_code).first()
        if not campaign:
            print(f"Group Buy share code {share_code} not found.")
            return False
        
        if campaign.status != "open":
            print(f"Group Buy campaign {share_code} is already {campaign.status}.")
            return False

        # Increment count
        campaign.current_count += 1
        self.db.commit()
        
        # Check if this increment triggered success
        self.check_group_buy_success(campaign.owner_order_id)
        return True

    def award_points(self, user_id: int, amount: int, source: PointSource):
        from backend.app.services.finance_engine import earn_points
        earn_points(self.db, user_id, source, amount)

    def redeem_renewal_card(self, customer_id: int, plan_id: str) -> dict:
        """
        Redeem 3000 points for a Renewal Card. Max 1 unused card per plan per period.
        """
        points = self.db.query(Points).filter_by(user_id=customer_id).first()
        if not points or points.balance < 3000:
            return {"status": "error", "message": "Insufficient points (3000 required)."}
        
        plan = self.db.query(CheckinPlan).filter_by(id=plan_id, user_id=customer_id).first()
        if not plan:
             return {"status": "error", "message": "Plan not found."}

        # Check for existing unused card for this plan in CURRENT period
        # The blueprint says "每期限用 1 张". 
        # We can track it by checking if a card was created/used in this period.
        # For now, let's just ensure they don't have an UNUSED one.
        existing = self.db.query(RenewalCard).filter_by(
            user_id=customer_id, 
            plan_id=plan_id, 
            status="unused"
        ).first()
        if existing:
            return {"status": "error", "message": "You already have an unused Renewal Card for this plan."}
        
        points.balance -= 3000
        txn = PointTransaction(user_id=customer_id, amount=-3000, source=PointSource.TASK)
        self.db.add(txn)
        
        card = RenewalCard(user_id=customer_id, plan_id=plan_id)
        self.db.add(card)
        self.db.commit()
        
        return {"status": "success", "message": "Renewal Card redeemed!"}

    def settle_final_reward(self, plan: CheckinPlan):
        if plan.status != 'active_checkin':
            return
        
        reward_amount = (Decimal(plan.consecutive_days) / Decimal('30')) * Decimal('0.05') * plan.reward_base
        if reward_amount > 0:
            self.update_wallet_balance(
                plan.user_id, 
                reward_amount, 
                'checkin', 
                plan.order_id, 
                f"Final 500-day settlement reward"
            )
            plan.total_earned += reward_amount
        
        plan.status = 'completed'
        self.db.commit()

    def update_wallet_balance(self, customer_id: int, amount: Decimal, type: str, order_id: Optional[int] = None, description: str = ""):
        wallet = self.db.query(Wallet).filter_by(user_id=customer_id).first()
        if not wallet:
            wallet = Wallet(user_id=customer_id, balance_available=Decimal('0.0'), balance_locked=Decimal('0.0'))
            self.db.add(wallet)
        
        wallet.balance_available += amount
        tx = WalletTransaction(
            user_id=customer_id,
            amount=amount,
            type=type,
            status='completed',
            order_id=order_id,
            description=description
        )
        self.db.add(tx)
        self.db.commit()

    def record_referral(self, invitee_id: int, referral_code: str):
        """
        Record a referral relationship when a referral code is used.
        """
        inviter = self.db.query(UserExt).filter_by(referral_code=referral_code).first()
        if not inviter:
            print(f"Referral code {referral_code} not found.")
            return

        if inviter.customer_id == invitee_id:
            print("User cannot refer themselves.")
            return

        # Check if already has an inviter
        invitee = self.ensure_user_exists(invitee_id)
        if invitee.inviter_id:
            print(f"User {invitee_id} already has an inviter: {invitee.inviter_id}")
            return

        # Set inviter_id on user record
        invitee.inviter_id = inviter.customer_id
        
        # Create relationship record (2-year LTV)
        rel = ReferralRelationship(
            inviter_id=inviter.customer_id,
            invitee_id=invitee_id,
            expire_at=datetime.now() + timedelta(days=730)
        )
        self.db.add(rel)
        self.db.commit()
        print(f"Referral recorded: {inviter.customer_id} -> {invitee_id}")

    def process_referral_commissions(self, customer_id: int, order_id: int, reward_base: Decimal, referrer_id: Optional[int] = None):
        """
        v3.0 Consolidated Referral & KOL Commission Logic.
        Uses FinanceEngine to calculate the exact amount based on tiers and status.
        """
        from backend.app.services.finance_engine import FinanceEngine
        finance = FinanceEngine(self.db)
        
        # Calculate amount based on v3.0 logic (15% KOL bonus, 1.5%-3% Tiers)
        order_data = {"total_price": reward_base, "customer_id": customer_id}
        amount = finance.calculate_order_reward(order_data, referrer_id=referrer_id)
        
        if amount > 0:
            description = f"Referral commission for Order #{order_id}"
            beneficiary_id = referrer_id if referrer_id else self._get_inviter_id(customer_id)
            
            if beneficiary_id:
                self.update_wallet_balance(
                    beneficiary_id,
                    amount,
                    'referral',
                    order_id,
                    description
                )
                print(f"Commission Paid: {beneficiary_id} received {amount} USD.")

    def _get_inviter_id(self, customer_id: int) -> Optional[int]:
        user = self.db.query(UserExt).filter_by(customer_id=customer_id).first()
        return user.inviter_id if user else None

    def get_wallet_summary(self, customer_id: int) -> dict:
        wallet = self.db.query(Wallet).filter_by(user_id=customer_id).first()
        points = self.db.query(Points).filter_by(user_id=customer_id).first()
        
        return {
            "available": float(wallet.balance_available) if wallet else 0.0,
            "points": points.balance if points else 0,
            "currency": wallet.currency if wallet else "USD"
        }

    def get_transaction_history(self, customer_id: int, limit: int = 10) -> List[dict]:
        txs = self.db.query(WalletTransaction).filter_by(user_id=customer_id).order_by(
            WalletTransaction.created_at.desc()
        ).limit(limit).all()
        return [
            {
                "id": str(tx.id),
                "amount": float(tx.amount),
                "type": tx.type,
                "status": tx.status,
                "created_at": tx.created_at.isoformat()
            } for tx in txs
        ]

    def clawback_commissions_for_order(self, order_id: int) -> dict:
        originals = self.db.query(WalletTransaction).filter(
            WalletTransaction.order_id == order_id,
            WalletTransaction.type == "referral",
            WalletTransaction.status == "completed",
            WalletTransaction.amount > 0,
        ).all()

        clawed = 0
        total = Decimal("0.0")

        for tx in originals:
            marker = f"clawback_of={tx.id}"
            exists = self.db.query(WalletTransaction).filter(
                WalletTransaction.order_id == order_id,
                WalletTransaction.type == "referral",
                WalletTransaction.status == "completed",
                WalletTransaction.amount < 0,
                WalletTransaction.description.contains(marker),
            ).first()
            if exists:
                continue

            amt = Decimal(str(tx.amount))
            self.update_wallet_balance(
                tx.user_id,
                -amt,
                "referral",
                order_id,
                f"Referral clawback for Order #{order_id} ({marker})",
            )
            clawed += 1
            total += amt

        return {"status": "success", "order_id": order_id, "clawed_back_count": clawed, "clawed_back_total": float(total)}

    def clawback_checkin_cashback_for_order(self, order_id: int) -> dict:
        originals = self.db.query(WalletTransaction).filter(
            WalletTransaction.order_id == order_id,
            WalletTransaction.type == "checkin",
            WalletTransaction.status == "completed",
            WalletTransaction.amount > 0,
        ).all()

        plan = self.db.query(CheckinPlan).filter_by(order_id=order_id).first()

        clawed = 0
        total = Decimal("0.0")

        for tx in originals:
            marker = f"clawback_of={tx.id}"
            exists = self.db.query(WalletTransaction).filter(
                WalletTransaction.order_id == order_id,
                WalletTransaction.type == "checkin",
                WalletTransaction.status == "completed",
                WalletTransaction.amount < 0,
                WalletTransaction.description.contains(marker),
            ).first()
            if exists:
                continue

            amt = Decimal(str(tx.amount))
            self.update_wallet_balance(
                tx.user_id,
                -amt,
                "checkin",
                order_id,
                f"Check-in cashback clawback for Order #{order_id} ({marker})",
            )
            clawed += 1
            total += amt

        if plan and total > 0:
            try:
                current = Decimal(str(plan.total_earned or 0))
                plan.total_earned = current - total
                if plan.total_earned < 0:
                    plan.total_earned = Decimal("0.0")
                self.db.commit()
            except Exception:
                self.db.rollback()

        return {"status": "success", "order_id": order_id, "clawed_back_count": clawed, "clawed_back_total": float(total)}

    def clawback_rewards_for_order(self, order_id: int) -> dict:
        commission = self.clawback_commissions_for_order(order_id)
        checkin = self.clawback_checkin_cashback_for_order(order_id)
        points = self.clawback_points_for_order(order_id)
        renewal_cards = self.revoke_renewal_cards_for_order(order_id)
        return {
            "status": "success",
            "order_id": order_id,
            "referral": commission,
            "checkin": checkin,
            "points": points,
            "renewal_cards": renewal_cards,
        }

    def revoke_renewal_cards_for_order(self, order_id: int) -> dict:
        plan = self.db.query(CheckinPlan).filter_by(order_id=order_id).first()
        if not plan:
            return {"status": "success", "order_id": order_id, "revoked_count": 0}

        cards = self.db.query(RenewalCard).filter_by(plan_id=plan.id, status="unused").all()
        revoked = 0
        now = datetime.now()
        for c in cards:
            c.status = "revoked"
            c.revoked_at = now
            revoked += 1
        self.db.commit()
        return {"status": "success", "order_id": order_id, "plan_id": str(plan.id), "revoked_count": revoked}

    def clawback_points_for_order(self, order_id: int) -> dict:
        plan = self.db.query(CheckinPlan).filter_by(order_id=order_id).first()
        if not plan:
            return {"status": "success", "order_id": order_id, "clawed_back_total": 0, "clawed_back_count": 0}

        logs = self.db.query(CheckinLog).filter_by(plan_id=plan.id).order_by(CheckinLog.checkin_date.asc()).all()
        if not logs:
            return {"status": "success", "order_id": order_id, "clawed_back_total": 0, "clawed_back_count": 0}

        points_record = self.db.query(Points).filter(Points.user_id == plan.user_id).with_for_update().first()
        if not points_record:
            points_record = Points(user_id=plan.user_id, balance=0, total_earned=0)
            self.db.add(points_record)
            self.db.commit()

        clawed_count = 0
        clawed_total = 0

        for log in logs:
            expected = 10 if (log.period_num or 1) <= 2 else 20
            marker = f"clawback_signin={log.checkin_date.isoformat()}"
            exists = self.db.query(PointTransaction).filter(
                PointTransaction.user_id == plan.user_id,
                PointTransaction.order_id == order_id,
                PointTransaction.amount < 0,
                PointTransaction.description.contains(marker),
            ).first()
            if exists:
                continue

            earned = self.db.query(func.sum(PointTransaction.amount)).filter(
                PointTransaction.user_id == plan.user_id,
                PointTransaction.source == PointSource.SIGN_IN,
                PointTransaction.amount > 0,
                func.date(PointTransaction.created_at) == log.checkin_date,
            ).scalar() or 0

            to_claw = min(int(expected), int(earned))
            if to_claw <= 0:
                continue

            actual = min(to_claw, int(points_record.balance or 0))
            if actual <= 0:
                continue

            points_record.balance -= actual
            points_record.total_earned = max(int(points_record.total_earned or 0) - actual, 0)

            txn = PointTransaction(
                user_id=plan.user_id,
                amount=-actual,
                source=PointSource.SIGN_IN,
                order_id=order_id,
                description=f"Points clawback for Order #{order_id} ({marker})",
            )
            self.db.add(txn)

            clawed_count += 1
            clawed_total += actual

        self.db.commit()
        return {"status": "success", "order_id": order_id, "clawed_back_total": clawed_total, "clawed_back_count": clawed_count}
