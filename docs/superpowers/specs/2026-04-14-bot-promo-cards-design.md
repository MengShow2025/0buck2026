# Bot Promo Cards Design

## 1. Goal

Build a unified promotion system that allows users/KOLs to generate and distribute three card types through bound external IM bots:

- Product promo card
- Merchant promo card
- Personal invite card

All cards must carry auditable attribution metadata so reward ownership and category settlement remain deterministic.

## 2. Scope

In scope:

- Card generation and rendering for Feishu, WhatsApp, Telegram, Discord
- Unified share link issuance with `share_token`
- Order attribution persistence from `share_token`
- Reward category mapping without changing existing payout priority
- Fan Center / Reward History data endpoints for real metrics (replace current mock data)
- Basic anti-abuse controls and operational observability

Out of scope (this phase):

- New reward formulas or changing existing reward priority
- Full campaign CMS
- Full BI warehouse rollout

## 3. Constraints and Principles

- Keep existing reward logic intact (current priority and settlement remain source of truth).
- Add attribution, observability, and distribution capability without over-complicating current models.
- One order maps to one final attribution category (no multi-category split per order).
- Platform-specific message formats are adapter concerns, not business logic concerns.

## 4. Architecture

### 4.1 Core Modules

- `PromoCardService`  
  Builds normalized card payloads by type (`product`, `merchant`, `invite`).

- `ShareLinkService`  
  Issues signed share links and stores immutable share records.

- `IMPromoDispatcher`  
  Sends normalized cards to each platform via adapter (`feishu/whatsapp/telegram/discord`).

- `AttributionResolver`  
  Resolves `share_token` during purchase and writes order attribution fields.

- `PromoAnalyticsService`  
  Serves aggregate metrics for Fan Center and Reward History.

### 4.2 Data Model Additions

#### `promo_share_links` (new)

- `id`
- `share_token` (unique, indexed)
- `sharer_user_id`
- `share_category` (`group_buy` | `distribution` | `fan_source`)
- `card_type` (`product` | `merchant` | `invite`)
- `target_type` (`product` | `merchant` | `none`)
- `target_id` (nullable)
- `platform` (nullable; chosen send platform)
- `entry_type` (creator-selected source lane)
- `policy_version`
- `status` (`active` | `expired` | `revoked`)
- `created_at`, `expired_at`

#### `order_attributions` (new, 1:1 with order)

- `order_id` (unique)
- `share_token`
- `sharer_user_id`
- `share_category`
- `card_type`
- `target_type`
- `target_id`
- `entry_type`
- `policy_version`
- `created_at`

## 5. Card Types

### 5.1 Product Card

- Required data: product id, title, hero image, price range, CTA link
- Attribution intent: `distribution` (default) or `group_buy` (if generated from eligible order campaign context)

### 5.2 Merchant Card

- Required data: merchant id, merchant name, cover/logo, key tags, CTA link
- Attribution intent: `distribution`

### 5.3 Personal Invite Card

- Required data: sharer profile summary, invite proposition, CTA link
- Attribution intent: `fan_source`

## 6. Bot UX Flow

### 6.1 Generator Flow (User/KOL in bot)

1. Choose card type (`product`, `merchant`, `invite`)
2. Select target (if needed)
3. Generate card
4. Send card to selected bound platform conversation

### 6.2 Receiver Flow

1. Receiver opens card link
2. `share_token` stored in session/cookie
3. Registration/order uses token for attribution
4. Attribution written once at eligible order creation

## 7. Attribution and Reward Mapping

- Reward formulas remain unchanged.
- Attribution category drives settlement path:
  - `group_buy` -> group-buy reward path
  - `distribution` -> referral/distribution path
  - `fan_source` -> fan relationship path
- Existing priority behavior remains as-is; this design only ensures deterministic attribution object and traceability.

## 8. API Design (MVP)

### Promo Card

- `POST /api/v1/im/promo/cards/generate`
  - input: `card_type`, `target_type`, `target_id`, `platform`, `entry_type`
  - output: normalized card payload + `share_token` + universal link

- `POST /api/v1/im/promo/cards/send`
  - input: `share_token`, `platform`, `destination`
  - output: dispatch status + platform message id

### Share and Attribution

- `GET /api/v1/promo/links/{share_token}`
  - resolve and redirect with status checks

- internal: `resolve_share_token_for_order(order_context)`
  - writes `order_attributions`

### Analytics

- `GET /api/v1/rewards/fan-center/summary`
- `GET /api/v1/rewards/fan-center/orders`
- `GET /api/v1/rewards/transactions`
- `GET /api/v1/rewards/funnel`

## 9. Security and Risk Controls

- Signed share token (tamper-proof, expiry-aware)
- Per-user generation and send rate limit
- Platform-bound dispatch permission (must be linked IM account)
- Abuse flags on suspicious click/order bursts
- Safe rendering (sanitized text, no unsafe remote html)

## 10. Frontend Changes

- Replace static promotion actions with dynamic bot-card actions
- Fan Center: consume summary + funnel + order progress endpoints
- Reward History: consume real transaction feed + filters
- Keep existing visual language; no major IA change in this phase

## 11. Rollout Plan

### Phase A

- Feishu full path first (generate + send + attribution)
- Product + Invite cards enabled

### Phase B

- Merchant card enablement
- WhatsApp/Telegram/Discord adapters

### Phase C

- Full analytics board and risk tuning

## 12. Testing Strategy

- Unit:
  - share token generation/verification
  - card payload assembly
  - attribution resolver
- Integration:
  - card generate -> dispatch -> click -> order attribution chain
  - reward category mapping with existing settlement logic
- E2E:
  - linked user in bot sends card, receiver purchases, reward appears with expected category

## 13. Acceptance Criteria

- Users/KOLs can generate and send 3 card types from bot channels
- Every eligible attributed order stores immutable attribution record
- Reward ownership can be traced from order -> share token -> sharer
- Fan Center and Reward History use real backend metrics (no mock for key figures)
- No regression to existing reward payout logic

