# i18n 多语言切换（不改 CSV）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不修改 `0Buck_i18n_Translation_Table.csv` 的前提下，让前端可切换 `ja/ko/es/fr/de/ar`，并保持文案英文兜底、阿语 RTL。

**Architecture:** 扩展前端 `Language` 枚举与设置页选项；`translate()` 对新语言统一回退英文；切换到 `ar` 时设置 `document.documentElement.dir='rtl'`。

**Tech Stack:** React + TypeScript + Vite；自研 `translate()`；SettingsDrawer 自定义下拉。

---

## File Map

- Modify: `frontend/src/components/VCC/AppContext.tsx`
- Modify: `frontend/src/components/VCC/Drawer/SettingsDrawer.tsx`
- Modify: `frontend/src/i18n/index.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/VCC/CustomMessageUI.tsx`

---

### Task 1: Extend language type + runtime translator

**Files:**
- Modify: `frontend/src/i18n/index.ts`

- [ ] **Step 1: Write failing type check**

Run: `npm -C frontend run build`

Expected: PASS (baseline)

- [ ] **Step 2: Extend Language type and translator**

Update `frontend/src/i18n/index.ts`:

```ts
export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ar';

export function translate(language: Language, key: string): string {
  if (language === 'zh') {
    return zhDict[key] ?? enDict[key] ?? key;
  }
  return enDict[key] ?? key;
}
```

- [ ] **Step 3: Run build to verify**

Run: `npm -C frontend run build`

Expected: PASS

---

### Task 2: Extend AppContext language state + navigator mapping + RTL

**Files:**
- Modify: `frontend/src/components/VCC/AppContext.tsx`

- [ ] **Step 1: Expand `Language` union type**

Update `type Language = ...` to include: `en/zh/ja/ko/es/fr/de/ar`.

- [ ] **Step 2: Improve navigator → Language mapping**

In `useState<Language>(() => { ... })` initializer:

```ts
const raw = (navigator.language || 'en').toLowerCase();
if (raw.startsWith('zh')) return 'zh';
if (raw.startsWith('ja')) return 'ja';
if (raw.startsWith('ko')) return 'ko';
if (raw.startsWith('es')) return 'es';
if (raw.startsWith('fr')) return 'fr';
if (raw.startsWith('de')) return 'de';
if (raw.startsWith('ar')) return 'ar';
return 'en';
```

- [ ] **Step 3: Add RTL dir effect**

Add an effect watching `language`:

```ts
useEffect(() => {
  const root = window.document.documentElement;
  root.dir = language === 'ar' ? 'rtl' : 'ltr';
  root.lang = language;
}, [language]);
```

- [ ] **Step 4: Ensure `t()` still works**

Keep: `t(key) => translate(language, key)`.

- [ ] **Step 5: Run build to verify**

Run: `npm -C frontend run build`

Expected: PASS

---

### Task 3: Add language options in SettingsDrawer (labels are literals)

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/SettingsDrawer.tsx`

- [ ] **Step 1: Update language dropdown options**

Replace current 2-item options with:

```ts
options={[
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ar', label: 'العربية' }
]}
```

- [ ] **Step 2: Run build to verify**

Run: `npm -C frontend run build`

Expected: PASS

---

### Task 4: Harden `SET_LANGUAGE` system action

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/VCC/CustomMessageUI.tsx`

- [ ] **Step 1: Add language allow-list**

Add a helper in each file:

```ts
const ALLOWED_LANGUAGES = new Set(['en','zh','ja','ko','es','fr','de','ar']);
function isAllowedLanguage(v: unknown): v is string {
  return typeof v === 'string' && ALLOWED_LANGUAGES.has(v);
}
```

- [ ] **Step 2: Guard setLanguage**

When receiving `SET_LANGUAGE`, only call `setLanguage` if allowed.

- [ ] **Step 3: Manual verification**

Run dev: `npm -C frontend run dev` then send a system action payload with invalid language, confirm no crash.

---

### Task 5: Verification checklist

- [ ] **Step 1: Verify UI switching**

Open Settings → Language and switch to `ja/ko/es/fr/de/ar`. Confirm:
- UI does not show raw i18n keys
- New languages display English (expected)

- [ ] **Step 2: Verify RTL**

Switch to Arabic `ar` and confirm `document.documentElement.dir === 'rtl'`.

- [ ] **Step 3: Verify no console errors**

Check browser console for errors/warnings.

