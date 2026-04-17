# Admin Dashboard Authentication Design

## Overview
Currently, the frontend Admin Dashboard (`/admin/*`) is completely unprotected. Anyone can access the routes (though the backend APIs will reject their requests with 403 Forbidden). We need to implement a dedicated frontend Authentication flow for the B-end dashboard using the existing backend bootstrap admin mechanism.

## 1. Authentication Flow
**Decision:** We will create a dedicated `/admin/login` page that uses the existing `api.login(email, password)` endpoint.

**Flow Details:**
1. User navigates to `/admin`.
2. `<AdminLayout>` checks the `user` object from `AppContext`.
3. **If `!user` OR `user.user_type !== 'admin'`**: Redirect to `/admin/login`.
4. The user enters the `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` (configured in `.env`) on the `/admin/login` page.
5. The login page calls `api.login()`.
6. Upon success, it updates the global `AppContext` with the new token and user info, then redirects back to `/admin`.

## 2. Component Changes
- **New File:** `frontend/src/components/Admin/Pages/AdminLogin.tsx`
  - A simple, professional, centered login form using the existing `Card`, `Input`, and `Button` components.
  - Takes Email and Password.
  - Handles loading states and error messages natively.
- **Modified File:** `frontend/src/components/Admin/Layout/AdminLayout.tsx`
  - Add a `useEffect` or inline check to redirect unauthenticated or non-admin users to `/admin/login`.
- **Modified File:** `frontend/src/App.tsx`
  - Add the route `<Route path="/admin/login" element={<AdminLogin />} />`.

## 3. Security Considerations
- The backend `auth.py` already handles the "Default Admin Bootstrap". If the environment variables match, it immediately returns a JWT token with `user_type="admin"`.
- We do not need to build a "Register Admin" page, as admins are created via database scripts or the `.env` bootstrap mechanism.
- We will add a "Logout" button to the `AdminSidebar` to clear the token and redirect to `/admin/login`.