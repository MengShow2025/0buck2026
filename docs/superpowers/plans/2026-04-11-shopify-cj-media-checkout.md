# Shopify CJ Media & Checkout Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync 3–5 CJ products into Shopify with ordered images uploaded to Shopify CDN, and validate CJ video playback via external URL embed (no Shopify video upload yet), then test DraftOrder checkout + discount code flow.

**Architecture:** Treat `cj_raw_products.raw_json` as the truth source. Build temporary `Product` rows for selected CJ items (using `product_id_1688 = cj_pid`), then reuse existing `SyncShopifyService.sync_to_shopify()` for product creation and image upload with `position`. Video is kept as external URL stored in `origin_video_url` and injected into `body_html` for playback validation.

**Tech Stack:** FastAPI + SQLAlchemy + Shopify Admin API (python shopify SDK + GraphQL fileCreate for images).

---

## File Structure

**Backend**
- Modify: `backend/app/services/sync_shopify.py` — prepend a `<video>` block when `origin_video_url` exists.
- Create: `backend/app/services/cj_to_product.py` — convert a `cj_raw_products` row into a `Product` ORM object.
- Modify: `backend/app/api/admin.py` — add an admin endpoint to pick N CJ rows and sync them to Shopify.
- Modify (optional): `backend/app/services/personalized_matrix_service.py` — prefer Shopify-synced `Product` rows for Discovery during the validation window.

**Docs**
- Reference matrix: `docs/data-contracts/cj_fields_matrix.csv`

---

### Task 1: Inject external CJ video into Shopify product page

**Files:**
- Modify: `backend/app/services/sync_shopify.py`

- [ ] **Step 1: Add a helper to build HTML video block**

Add near `format_description_html`:

```python
def format_video_embed_html(video_url: str) -> str:
    safe_url = (video_url or "").strip()
    if not safe_url:
        return ""
    return (
        "<div class=\"0buck-video\" style=\"margin:16px 0;\">"
        "<video controls playsinline preload=\"metadata\" style=\"width:100%;max-width:720px;border-radius:12px;\">"
        f"<source src=\"{safe_url}\" type=\"video/mp4\" />"
        "</video>"
        "</div>"
    )
```

- [ ] **Step 2: Prepend the embed HTML when `origin_video_url` exists**

Replace:

```python
sp.body_html = self.format_description_html(product.description_en, product)
```

With:

```python
desc_html = self.format_description_html(product.description_en, product)
video_html = format_video_embed_html(getattr(product, "origin_video_url", None))
sp.body_html = (video_html + desc_html) if video_html else desc_html
```

- [ ] **Step 3: Verify no Shopify save regression**

Run (unit-style smoke):

```bash
python3 -c "from app.services.sync_shopify import SyncShopifyService; print('ok')"
```

Expected: prints `ok`.

---

### Task 2: Convert CJ raw row into a Product ORM row for syncing

**Files:**
- Create: `backend/app/services/cj_to_product.py`
- Test: `backend/tmp/cj_raw_products_2578_raw_json.json` (existing fixture for manual inspection)

- [ ] **Step 1: Implement extraction using existing normalizers**

Create:

```python
import json
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models import Product
from app.services.cj_normalize import extract_cj_images, extract_cj_dimensions, extract_cj_weights, format_dimensions_cm, format_weight_g


def load_cj_row(db: Session, cj_row_id: int) -> Optional[Dict[str, Any]]:
    row = db.execute(
        text("""
            SELECT id, cj_pid, raw_json, title_en, source_url
            FROM cj_raw_products
            WHERE id = :id
        """),
        {"id": cj_row_id},
    ).mappings().first()
    return dict(row) if row else None


def build_product_from_cj_row(db: Session, cj_row_id: int) -> Product:
    row = load_cj_row(db, cj_row_id)
    if not row:
        raise ValueError(f"cj_raw_products not found: id={cj_row_id}")

    raw = row.get("raw_json") or {}
    if isinstance(raw, str):
        raw = json.loads(raw)

    cj_pid = (row.get("cj_pid") or raw.get("pid") or "").strip()
    title_en = (row.get("title_en") or raw.get("productNameEn") or raw.get("title") or "CJ Product").strip()
    description_en = raw.get("description") or ""
    origin_video_url = raw.get("productVideo") or None

    images = extract_cj_images(raw)

    dims = format_dimensions_cm(extract_cj_dimensions(raw))
    packing_w, product_w = extract_cj_weights(raw)
    weight_display = format_weight_g(packing_w, product_w)

    weight_kg = None
    if packing_w is not None:
        weight_kg = float(packing_w) / 1000.0
    elif product_w is not None:
        weight_kg = float(product_w) / 1000.0

    product = Product(
        product_id_1688=cj_pid or f"CJ-{cj_row_id}",
        source_platform="CJ",
        source_url=row.get("source_url"),
        title_en=title_en,
        description_en=description_en,
        images=images,
        detail_images=[],
        is_active=True,
        structural_data={
            "cj_row_id": cj_row_id,
            "cj_pid": cj_pid,
            "dimensions": dims,
            "weight": weight_display,
        },
        origin_video_url=origin_video_url,
        weight=weight_kg or 0.5,
        category=raw.get("categoryName") or "General",
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return product
```

- [ ] **Step 2: Manual smoke test on one known row**

Run:

```bash
./venv/bin/python - <<'PY'
from app.db.session import SessionLocal
from app.services.cj_to_product import build_product_from_cj_row

db = SessionLocal()
p = build_product_from_cj_row(db, 2578)
print('product.id', p.id)
print('product.product_id_1688', p.product_id_1688)
print('images', len(p.images or []))
print('origin_video_url', p.origin_video_url)
PY
```

Expected: `images` > 1, `product_id_1688` equals CJ pid.

---

### Task 3: Admin endpoint to sync N CJ products to Shopify

**Files:**
- Modify: `backend/app/api/admin.py`

- [ ] **Step 1: Add request schema**

Add near other request models:

```python
class CjSyncToShopifyRequest(BaseModel):
    cj_row_ids: Optional[List[int]] = None
    limit: int = 5
    only_with_video: bool = False
```

- [ ] **Step 2: Add endpoint**

Add under Notion/IDS section:

```python
@router.post('/cj/sync-to-shopify')
async def cj_sync_to_shopify(payload: CjSyncToShopifyRequest, db: Session = Depends(get_db), admin: UserExt = Depends(get_current_admin)):
    from sqlalchemy import text
    from app.services.cj_to_product import build_product_from_cj_row
    from app.services.sync_shopify import SyncShopifyService

    if payload.cj_row_ids:
        ids = payload.cj_row_ids
    else:
        where = "WHERE cj_pid IS NOT NULL"
        if payload.only_with_video:
            where += " AND (raw_json->>'productVideo') IS NOT NULL"
        rows = db.execute(text(f"SELECT id FROM cj_raw_products {where} ORDER BY created_at DESC LIMIT :limit"), {"limit": payload.limit}).mappings().all()
        ids = [int(r['id']) for r in rows]

    shopify_service = SyncShopifyService()
    results = []
    try:
        for cj_id in ids:
            try:
                product = build_product_from_cj_row(db, cj_id)
                sp = shopify_service.sync_to_shopify(product)
                db.commit()
                results.append({
                    'cj_row_id': cj_id,
                    'product_id': product.id,
                    'shopify_product_id': product.shopify_product_id,
                    'shopify_variant_id': product.shopify_variant_id,
                    'status': 'synced',
                })
            except Exception as e:
                db.rollback()
                results.append({'cj_row_id': cj_id, 'status': 'failed', 'error': str(e)[:300]})
        return {'status': 'success', 'count': len(results), 'results': results}
    finally:
        shopify_service.close_session()
```

- [ ] **Step 3: Verify endpoint locally**

Run:

```bash
curl -sS -X POST http://localhost:8000/api/v1/admin/cj/sync-to-shopify \
  -H 'Content-Type: application/json' \
  -d '{"limit": 3, "only_with_video": false}' | python3 -m json.tool
```

Expected: `results[].status` are `synced` and include Shopify IDs.

---

### Task 4: Validation steps in Shopify + purchase flow

**Files:**
- No code required for the first run (manual verification)

- [ ] **Step 1: Verify image order**
  - Open Shopify Admin → Products → pick one synced product
  - Confirm gallery order matches CJ `raw_json.productImage` order.

- [ ] **Step 2: Verify video playback (A)**
  - Open the Shopify storefront product page
  - Confirm the `<video>` block renders and plays.

- [ ] **Step 3: Verify DraftOrder checkout**
  - Use existing API to create DraftOrder for the synced `shopify_variant_id` and open `invoice_url`.
  - Confirm checkout opens and a test payment can be completed.

---

## Self-Review Checklist
- Spec coverage: covers A video (external), image upload to Shopify CDN, and checkout validation via DraftOrder.
- Placeholder scan: no TBD/TODO; commands and code are included.
- Type consistency: uses existing `Product` fields (`product_id_1688`, `images`, `origin_video_url`, `shopify_*`).

