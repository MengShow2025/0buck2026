# 0Buck Admin Dashboard Design Specification

## Overview
This document outlines the architecture, routing, component strategy, and state management for the 0Buck Admin Dashboard. The dashboard will be integrated directly into the existing React/Vite frontend rather than running as a separate standalone project.

## 1. Routing Strategy
**Decision:** We will introduce `react-router-dom` to the project.
- **Why:** The current vanilla `window.location.pathname` check is sufficient for 1-2 pages (like `/diagram`), but an Admin Dashboard inherently requires nested routing (`/admin/products`, `/admin/orders`, `/admin/users/123`).
- **Implementation:** 
  - Wrap the entire application in `<BrowserRouter>`.
  - Create a top-level route split:
    - `/` -> `<MainApp />` (The existing C-end Chat application)
    - `/admin/*` -> `<AdminLayout />` (The new B-end Dashboard)
    - `/diagram` -> `<ArchitectureDiagram />`

## 2. Component Library & Styling
**Decision:** We will integrate `shadcn/ui` alongside the existing Tailwind CSS setup.
- **Why:** Admin panels are data-heavy. Building accessible Data Tables with sorting/pagination, Select dropdowns, and complex Dialogs from scratch using raw Tailwind is extremely time-consuming. `shadcn/ui` provides copy-paste Radix-based components that are fully customizable with Tailwind.
- **Installation:** We will initialize `npx shadcn@latest init` in the `frontend` folder and start adding required components (Table, Button, Input, Dialog, Sidebar).

## 3. Core Admin Domains (Phase 1)
Based on the requirements, the Admin Dashboard will cover four core pillars. Each will map to a specific route and feature set:

### A. Product & Supply Chain (`/admin/products`)
- **Features:** 
  - Data table listing all products from `candidate_products` and `products`.
  - Forms to edit pricing, stock, and descriptions.
  - Approve/Reject actions for new supplier listings.

### B. Order & Logistics Fulfillment (`/admin/orders`)
- **Features:**
  - View all user orders and their current status (Paid, Shipped, Refunded).
  - Webhook status monitoring (did Shopify sync correctly?).
  - Manual override for refund approvals or dispute resolutions.

### C. Financial & Rewards Audit (`/admin/finance`)
- **Features:**
  - Overview of platform Points (PTS) issued vs. burned.
  - Withdrawal request queue (users cashing out).
  - Ability to adjust the global reward multipliers (e.g., setting the check-in reward rate).

### D. AI Butler Configuration (`/admin/ai`)
- **Features:**
  - Interface to edit `PersonaTemplate` records (changing system prompts dynamically).
  - Anonymized view of AI chat logs to debug hallucination or prompt injection issues.
  - Dashboard showing token usage and API key routing statistics.

## 4. Authentication & Security
- **Access Control:** The backend already has an `@router(dependencies=[Depends(get_current_admin)])` setup in `admin.py`.
- **Frontend Auth Flow:** 
  - The `/admin` routes will check if the user has an active token and if `user.user_type === 'admin'`.
  - If not authenticated, redirect to `/admin/login`.
  - All API calls made from the dashboard will use the existing Axios interceptor to attach the JWT token.

## 5. Directory Structure
To keep the Admin code isolated from the C-end code, we will create a dedicated `Admin` folder inside `src/components/`:

```text
frontend/src/
├── components/
│   ├── VCC/                # Existing C-end code
│   └── Admin/              # NEW Admin code
│       ├── Layout/         # Sidebar, Header, Breadcrumbs
│       ├── Pages/          # Products, Orders, Finance, AI
│       ├── Components/     # Admin-specific UI (StatsCards, Charts)
│       └── ui/             # shadcn generated components
├── routes/                 # NEW router definitions
└── App.tsx                 # Updated to handle Routing
```

## 6. Implementation Steps
1. Install `react-router-dom` and configure `<BrowserRouter>` in `main.tsx`.
2. Initialize `shadcn/ui` and install base components (Sidebar, Table, Input).
3. Scaffold the `<AdminLayout />` with a persistent left-hand navigation sidebar.
4. Build out the blank pages for the 4 core domains.
5. (Subsequent PRs) Connect each page to the corresponding `admin.py` endpoints.