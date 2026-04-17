# Admin Products Detailed Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a detailed candidate product audit and publish workflow in the Admin Dashboard, integrating with real candidate DB (`status = 'pending'`), AI polish APIs, and notifications.

**Architecture:** We will modify the `adminApi` in `backend` to expose detailed candidate data (media, prices, warehouses, links), add a patch endpoint to update these details and trigger AI polishing. On the frontend, `ProductsPage.tsx` will be extended with a visual "Audit Drawer/Modal" to allow admins to view full media, modify text/pricing, and click "Save" or "Save & Publish". We will also implement a notification logic (via IM/Feishu) so the Butler (Accio) reminds admins of pending items.

**Tech Stack:** FastAPI, SQLAlchemy, React, Tailwind, Lucide React, Axios.

---

### Task 1: Backend Candidate Audit Endpoints

**Files:**
- Modify: `backend/app/api/admin.py`
- Modify: `backend/app/services/supply_chain.py` (if needed for AI repolish)

- [ ] **Step 1: Ensure candidate fetch defaults to 'pending'**
Modify `list_sourcing_candidates` in `admin.py` to default `status="pending"` instead of `"new"` (or allow fetching both) and ensure all fields (title_en_preview, description_en_preview, estimated_sale_price, structural_data, amazon_price, etc.) are properly mapped for the frontend.

- [ ] **Step 2: Create Candidate Details/Patch Endpoint**
We already have `@router.patch("/sourcing/candidates/{candidate_id}")`. Ensure it allows updating `estimated_sale_price`, `title_en_preview`, `description_en_preview`, etc.

- [ ] **Step 3: Create AI Re-polish Endpoint**
Create `@router.post("/sourcing/candidates/{candidate_id}/repolish")`. This endpoint should take the candidate ID, run it through the AI polishing logic (you can mock this or use the existing `c2m_service` / LLM call if available), and update `title_en_preview` and `description_en_preview`.

- [ ] **Step 4: Create Batch Action Endpoint for Save & Publish**
We already have `@router.post("/sourcing/candidates/{candidate_id}/approve")` which syncs to Shopify. Ensure this moves the status to 'published' and inserts into `products` table if it isn't doing so already.

### Task 2: Frontend API Integration

**Files:**
- Modify: `frontend/src/services/api.ts`

- [ ] **Step 1: Add new API methods to `adminApi`**
Add methods for fetching pending candidates explicitly, updating candidate details, triggering AI repolish, and fetching single candidate details if needed.

```typescript
  getCandidates: (status = 'pending') => api.get(`/admin/sourcing/candidates?status=${status}`),
  updateCandidate: (id: string, data: any) => api.patch(`/admin/sourcing/candidates/${id}`, data),
  repolishCandidate: (id: string) => api.post(`/admin/sourcing/candidates/${id}/repolish`),
```

### Task 3: Frontend Products Audit Drawer/Modal UI

**Files:**
- Modify: `frontend/src/components/Admin/Pages/ProductsPage.tsx`
- Create: `frontend/src/components/Admin/Pages/CandidateAuditDrawer.tsx` (or build modal inside ProductsPage)

- [ ] **Step 1: Create the visual audit interface**
Build a drawer/modal component that receives a `candidate` object.
It should display:
  - Media Gallery (Images from `candidate.images`).
  - Editable Inputs for Title (`title_en_preview`) and Description (`description_en_preview`).
  - A button next to Title/Description to "AI 重新优化" (calls repolish API).
  - Pricing Section: Editable 0buck Sale Price, Shipping Cost, Compare-at Price. Displays Margin ratio.
  - Links: Clickable icons for "阿里采购链接" (`source_url`) and "亚马逊比价" (`market_comparison_url`).
  - Read-only fields: Category, Merchant Tier (from `supplier_info`), Warehouses (`warehouse_anchor`).

- [ ] **Step 2: Implement Save and Publish Handlers**
In the drawer, provide buttons:
  - "保存" (Save): Calls `updateCandidate` and closes drawer.
  - "保存并发布" (Save & Publish): Calls `updateCandidate` then `approveCandidate`, and closes drawer.

- [ ] **Step 3: Wire up the List View**
In `ProductsPage.tsx`, change the "Sourcing Candidates" tab to fetch `status='pending'`. Replace the generic "Approve/Reject" inline buttons with a primary "去审核 (Audit)" button that opens the new `CandidateAuditDrawer`.

### Task 4: Accio Audit Notification

**Files:**
- Modify: `backend/app/workers/shopify_tasks.py` or create `backend/app/workers/audit_tasks.py`

- [ ] **Step 1: Create a background task for pending audit reminder**
Create a celery task or a simple background job that counts `SELECT COUNT(id) FROM candidate_products WHERE status = 'pending'`. If count > 0, use `app.api.im_gateway.send_rich_message` or similar logic to send a notification to the admin user (e.g., Feishu or internal chat) saying: "您有 N 款新商品等待审核上架，请前往管理后台处理。"

- [ ] **Step 2: Trigger the task**
Either set it up as a periodic Celery beat task (e.g., daily at 10 AM) or trigger it at the end of the AI discovery pipeline.