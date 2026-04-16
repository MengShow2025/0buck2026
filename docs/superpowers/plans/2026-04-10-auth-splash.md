# 0Buck Unified Auth & Splash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建按需触发的单入口 `AuthDrawer` 认证系统以及首次进入应用的动态 `SplashScreen` 欢迎页。

**Architecture:** 
1. **AppContext**: 扩展全局状态，增加 `user`, `isAuthenticated`, `pendingAuthAction` (用于登录后自动执行拦截的动作)。
2. **SplashScreen**: 作为 `App.tsx` 挂载时的首屏遮罩，2秒后淡出揭开底层 VCC 聊天界面。
3. **AuthDrawer**: 承载核心的认证表单，采用无密码先行的单入口设计，分发新老用户流向 OTP 或 Password 校验，包含社交登录按钮。

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide Icons

---

### Task 1: 扩展 AppContext 的认证状态与动作缓存

**Files:**
- Modify: `frontend/src/components/VCC/AppContext.tsx`

- [ ] **Step 1: 更新类型定义与接口**

```typescript
export type DrawerType = 
  // ... existing types ...
  | 'coupons'
  | 'auth'; // 新增

// 添加用户信息接口
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  level: string;
}

export interface AppContextType {
  // ... existing fields ...
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  // 缓存需要鉴权的操作
  pendingAuthAction: (() => void) | null;
  setPendingAuthAction: (action: (() => void) | null) => void;
  // 拦截并鉴权的高阶执行器
  requireAuth: (action: () => void) => void;
}
```

- [ ] **Step 2: 实现状态逻辑**

在 `AppContextProvider` 内部实现新状态：

```tsx
const [user, setUser] = useState<UserProfile | null>(null);
const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
const isAuthenticated = !!user;

// 鉴权拦截器
const requireAuth = (action: () => void) => {
  if (isAuthenticated) {
    action();
  } else {
    setPendingAuthAction(() => action); // 缓存动作
    setActiveDrawer('auth'); // 弹出登录抽屉
  }
};
```

- [ ] **Step 3: 注入 Provider**

在 `return <AppContext.Provider value={{ ... }}>` 中加入：
```tsx
user,
setUser,
isAuthenticated,
pendingAuthAction,
setPendingAuthAction,
requireAuth,
```

---

### Task 2: 实现动态欢迎页 (Splash Screen)

**Files:**
- Create: `frontend/src/components/VCC/SplashScreen.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: 创建 SplashScreen 组件**

创建带有呼吸动画和渐变背景的欢迎页。

```tsx
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 模拟 1.8s 后开始淡出
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // 淡出动画 500ms 后通知父组件卸载
      setTimeout(onComplete, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#ECE5DD] dark:bg-[#111111] transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center animate-pulse">
        {/* Logo Placeholder */}
        <div className="w-20 h-20 bg-orange-500 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center mb-6 transform scale-110">
          <span className="text-white font-black text-3xl">0B</span>
        </div>
        {/* Slogan */}
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">0Buck</h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase">Chat. Shop. Earn 100% Back.</p>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 挂载到 App.tsx**

修改 `frontend/src/App.tsx`，引入并渲染 `SplashScreen`。

```tsx
import { SplashScreen } from './components/VCC/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppContextProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-[var(--wa-bg)]">
        {/* ... existing code ... */}
      </div>
    </AppContextProvider>
  );
}
```

---

### Task 3: 构建 AuthDrawer 基础架构与全局注册

**Files:**
- Create: `frontend/src/components/VCC/Drawer/AuthDrawer.tsx`
- Modify: `frontend/src/components/VCC/Drawer/GlobalDrawer.tsx`

- [ ] **Step 1: 创建 AuthDrawer 组件**

支持 Email 验证、OTP 和 Password 三步状态机。

```tsx
import React, { useState } from 'react';
import { Mail, KeyRound, ChevronLeft, ArrowRight } from 'lucide-react';
import { useAppContext } from '../AppContext';

type AuthStep = 'email' | 'otp' | 'password';

export const AuthDrawer: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const { setUser, pendingAuthAction, setPendingAuthAction, setActiveDrawer } = useAppContext();

  // 模拟登录成功逻辑
  const handleLoginSuccess = () => {
    setUser({
      id: 'u1',
      email: email,
      nickname: '0Buck Explorer',
      avatar: 'https://i.pravatar.cc/150?img=11',
      level: 'V1'
    });
    
    // 执行被拦截的动作
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    } else {
      setActiveDrawer('none'); // 无动作则直接关抽屉
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E] p-6 relative">
      {step !== 'email' && (
        <button onClick={() => setStep('email')} className="absolute top-6 left-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
          <span className="text-white font-black text-2xl">0B</span>
        </div>
        
        {step === 'email' && (
          <div className="w-full w-full animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">Welcome to 0Buck</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">Log in to unlock 100% Cashback.</p>
            
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              onClick={() => setStep('password')} // 简单Mock：下一步直接要求输密码
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'password' && (
          <div className="w-full w-full animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">{email}</p>
            
            <div className="relative mb-6">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                placeholder="Enter Password"
                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              onClick={handleLoginSuccess}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-transform active:scale-95 mb-4"
            >
              Log In
            </button>
            <p className="text-center text-sm font-bold text-orange-500 cursor-pointer">Forgot Password?</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 注册到 GlobalDrawer**

修改 `frontend/src/components/VCC/Drawer/GlobalDrawer.tsx`：

```tsx
import { AuthDrawer } from './AuthDrawer';

const titles: Record<DrawerType, string> = {
  // ...
  auth: 'Sign In / Sign Up',
};

// 在 renderContent 中添加
case 'auth':
  return <AuthDrawer />;
```

- [ ] **Step 3: 隐藏 Auth 抽屉的公共 Header**

在 `GlobalDrawer.tsx` 中，像隐藏聊天页 Header 一样隐藏 Auth 页 Header，保持沉浸感：

```tsx
const hideHeader = activeDrawer === 'chat_room' || activeDrawer === 'auth';
```

---

### Task 4: 测试鉴权拦截机制

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/CouponsDrawer.tsx`

- [ ] **Step 1: 应用 requireAuth 到领取操作**

在 `CouponsDrawer.tsx` 中测试拦截。修改 "去积分商城兑换" 按钮：

```tsx
<button 
  onClick={() => {
    requireAuth(() => {
      // 这里的操作只有在登录后（或已登录时）才会执行
      pushDrawer('wallet'); // 假装去钱包/积分页
    });
  }}
  className="bg-indigo-500 hover:bg-indigo-600 text-white text-[15px] font-black px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 w-full max-w-[240px]"
>
  去积分商城兑换
</button>
```

- [ ] **Step 2: 测试全流程**
1. 确保未登录。
2. 点击 "卡券与权益" -> 平台权益 -> "去积分商城兑换"。
3. 预期：弹出 `AuthDrawer`。
4. 输入邮箱，Continue，输密码，点击 Log In。
5. 预期：登录抽屉自动关闭，并**自动弹出** Wallet 抽屉（因为刚才被缓存的动作被执行了）。

---
