
import random
import string
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from sqlalchemy.orm import Session
from app.models.butler import ShadowIDMapping

class ShieldService:
    def __init__(self, db: Session):
        self.db = db

    def get_shadow_id(self, real_id: str, context_type: str = "product") -> str:
        """
        Zone 2: Map a real ID to a Shadow ID.
        """
        # First, try to find an existing mapping without a lock for performance
        mapping = self.db.query(ShadowIDMapping).filter_by(real_id=real_id, context_type=context_type).first()
        
        now = datetime.utcnow()
        if mapping and mapping.expires_at > now:
            return mapping.shadow_id
            
        try:
            # Create new shadow ID based on context
            if context_type == "product":
                prefix = "SH_PROD_"
            elif context_type == "supplier":
                prefix = "SH_SUP_"
            elif context_type == "tracking":
                prefix = "0B_TRACK_"
            else:
                prefix = "SH_TMP_"
                
            random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            shadow_id = f"{prefix}{random_suffix}"
            
            # Ensure shadow_id uniqueness
            while self.db.query(ShadowIDMapping).filter_by(shadow_id=shadow_id).first():
                random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
                shadow_id = f"{prefix}{random_suffix}"
                
            # v3.2: Long-term persistence for key entities
            expiry_days = 3650 if context_type in ["product", "supplier", "tracking"] else 1
            
            new_mapping = ShadowIDMapping(
                shadow_id=shadow_id,
                real_id=real_id,
                context_type=context_type,
                expires_at=now + timedelta(days=expiry_days)
            )
            self.db.add(new_mapping)
            self.db.commit()
            return shadow_id
        except Exception:
            self.db.rollback()
            mapping = self.db.query(ShadowIDMapping).filter_by(real_id=real_id, context_type=context_type).first()
            if mapping:
                return mapping.shadow_id
            raise

    def get_shadow_tracking_id(self, real_tracking_number: str) -> str:
        """
        v3.2.1 Shadow Tracking: Maps 1688/Supplier tracking numbers to 0Buck Shadow IDs.
        Shields the supply source and provides a professional branded appearance.
        """
        return self.get_shadow_id(real_tracking_number, context_type="tracking")

    def resolve_real_id(self, shadow_id: str) -> Optional[str]:
        """
        Zone 2: Resolve a Shadow ID back to its Real ID for backend execution.
        """
        mapping = self.db.query(ShadowIDMapping).filter_by(shadow_id=shadow_id).first()
        if mapping:
            return mapping.real_id
        return None

    def mask_content(self, content: str) -> str:
        """
        General de-identification gateway for strings.
        Replaces 1688 IDs, costs, and sensitive names with shadow placeholders.
        """
        import re
        masked = content
        
        # 1. Mask 1688-like IDs (e.g., 1688_PROD_XXX or numbers > 10 digits)
        id_pattern = r'1688_PROD_[A-Z0-9_]+|\b\d{10,}\b'
        matches = re.findall(id_pattern, masked)
        for match in set(matches):
            shadow = self.get_shadow_id(match, "product")
            masked = masked.replace(match, shadow)
            
        # 2. Mask Cost-like numbers (v3.2: Refined to avoid weights/sizes)
        # Only mask numbers followed by currency or preceded by price keywords
        cost_pattern = r'(?:price|cost|¥|\$)\s*\b\d+\.\d{1,2}\b|\b\d+\.\d{1,2}\b\s*(?:CNY|USD|¥|\$)'
        masked = re.sub(cost_pattern, "[MASKED_PRICE]", masked, flags=re.IGNORECASE)
        
        return masked

    def mask_product_data(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mask sensitive fields in product data before sending to LLM.
        """
        masked = product_data.copy()
        
        # 1. Map 1688 ID to Shadow ID
        if "product_id_1688" in masked:
            masked["shadow_id"] = self.get_shadow_id(masked["product_id_1688"], "product")
            del masked["product_id_1688"]
            
        # 2. Mask Costs
        if "original_price" in masked:
            # Replace with a relative 'Value Index' or just remove
            masked["value_index"] = "Premium" if masked["original_price"] > 100 else "Standard"
            del masked["original_price"]
            
        # 3. Supplier Masking
        if "supplier_id_1688" in masked:
            masked["supplier_shadow_id"] = self.get_shadow_id(masked["supplier_id_1688"], "supplier")
            del masked["supplier_id_1688"]
            
        return masked

    def mask_order_data(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        v4.7.0: PII Masking for Orders (Zone 2 Shadow Data Gateway).
        Strips or masks name, phone, exact address before passing to Zone 3 (LLM).
        """
        masked = order_data.copy()

        # Mask Customer Name
        if "customer" in masked and isinstance(masked["customer"], dict):
            cust = masked["customer"]
            first_name = cust.get("first_name", "")
            last_name = cust.get("last_name", "")
            masked["customer"] = {
                "masked_name": f"{first_name[0] if first_name else ''}***{last_name[-1] if last_name else ''}"
            }
            # Remove exact email/phone
            for pii_key in ["email", "phone"]:
                if pii_key in cust:
                    masked["customer"][f"has_{pii_key}"] = bool(cust[pii_key])

        # Mask Shipping Address
        if "shipping_address" in masked and isinstance(masked["shipping_address"], dict):
            addr = masked["shipping_address"]
            masked["shipping_address"] = {
                "city": addr.get("city", "Unknown"),
                "province": addr.get("province", "Unknown"),
                "country": addr.get("country", "Unknown"),
                "zip_prefix": str(addr.get("zip", ""))[:3] + "***" if addr.get("zip") else ""
            }
            # Completely remove exact street addresses and phone numbers
            for key in ["address1", "address2", "phone", "name", "first_name", "last_name"]:
                if key in addr:
                    masked["shipping_address"].pop(key, None)

        # Mask Billing Address
        if "billing_address" in masked:
            masked.pop("billing_address", None) # Usually not needed by LLM

        # Add Shadow IDs for line items if needed
        if "line_items" in masked and isinstance(masked["line_items"], list):
            for item in masked["line_items"]:
                if "product_id" in item:
                    item["shadow_product_id"] = self.get_shadow_id(str(item["product_id"]), "product")
                    # Don't delete original product_id if LLM needs to reference it, but masking it is safer
                    # item.pop("product_id", None)

        return masked
