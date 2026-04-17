# Admin Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dedicated `/admin/login` page and protect all `/admin/*` routes to only allow users with `user_type === 'admin'`.

**Architecture:** 
1. Create `AdminLoginPage.tsx` with a simple email/password form that calls `api.login()`.
2. Update `AdminLayout.tsx` to check `user.user_type` from `AppContext`. If missing or not admin, `<Navigate to="/admin/login" replace />`.
3. Add a logout button to the Admin Sidebar.
4. Add the route `<Route path="/admin/login" element={<AdminLoginPage />} />` to `App.tsx`.

**Tech Stack:** React, Tailwind CSS, React Router DOM, Axios

---

### Task 1: Create Admin Login Page

**Files:**
- Create: `frontend/src/components/Admin/Pages/AdminLoginPage.tsx`

- [ ] **Step 1: Write AdminLoginPage component**

Create `frontend/src/components/Admin/Pages/AdminLoginPage.tsx`:
```tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../VCC/AppContext';
import api from '../../../services/api';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { fetchUser, showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The backend expects application/x-www-form-urlencoded for login
      const formData = new URLSearchParams();
      formData.append('username', email); // OAuth2 expects username, not email
      formData.append('password', password);

      const res = await api.login(formData);
      if (res.data?.access_token) {
        localStorage.setItem('token', res.data.access_token);
        
        // Wait for user context to refresh
        await fetchUser();
        
        // Redirect to where they came from, or /admin
        const from = location.state?.from?.pathname || "/admin";
        navigate(from, { replace: true });
        showToast('Admin logged in successfully', 'success');
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          0Buck Admin <span className="text-amber-500">Portal</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your administrator credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-bold">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="admin@0buck.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Admin/Pages/AdminLoginPage.tsx
git commit -m "feat(admin): create dedicated admin login page component"
```

### Task 2: Protect Admin Layout & Add Logout

**Files:**
- Modify: `frontend/src/components/Admin/Layout/AdminLayout.tsx`

- [ ] **Step 1: Add protection and logout**

Modify `frontend/src/components/Admin/Layout/AdminLayout.tsx`:
```tsx
import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Wallet, Bot, LogOut } from 'lucide-react';
import { AIPersonaPage } from '../Pages/AIPersonaPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { FinancePage } from '../Pages/FinancePage';
import { useAppContext } from '../../VCC/AppContext';

const AdminSidebar = () => {
  const { user, setUser, showToast } = useAppContext();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/admin/finance", icon: Wallet, label: "Finance" },
    { to: "/admin/ai", icon: Bot, label: "AI Butler" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully', 'success');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-black tracking-tight text-amber-500">0Buck Admin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="mb-4 px-4">
          <div className="text-xs text-gray-500 font-bold uppercase">Logged in as</div>
          <div className="text-sm text-white font-bold truncate">{user?.email}</div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-bold text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { user } = useAppContext();
  const location = useLocation();

  // Protect the entire /admin/* route
  if (!user || user.user_type !== 'admin') {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 shrink-0 flex items-center px-8">
          <span className="font-bold text-gray-500">Admin Dashboard Mode</span>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<h2 className="text-2xl font-black text-gray-900">Overview</h2>} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<h2 className="text-2xl font-black text-gray-900">Order Fulfillment</h2>} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/ai" element={<AIPersonaPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Admin/Layout/AdminLayout.tsx
git commit -m "feat(admin): protect admin routes and add sidebar logout"
```

### Task 3: Update App Routes

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Wire up AdminLoginPage**

Modify `frontend/src/App.tsx`:
```tsx
// add import
import { AdminLoginPage } from './components/Admin/Pages/AdminLoginPage';

// add Route BEFORE /admin/* so it doesn't get caught by the protected layout
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/diagram" element={<ArchitectureDiagram />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 2: Run build to verify types**

Run: `cd frontend && npm run build`
Expected: Build passes.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat(admin): add admin login route to top level router"
```
EOF