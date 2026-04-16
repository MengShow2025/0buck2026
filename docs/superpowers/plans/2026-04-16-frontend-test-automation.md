# Frontend Test Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce Vitest and React Testing Library to the frontend to enable automated unit and component testing, specifically targeting core utilities and isolated components.

**Architecture:** 
1. Install Vitest, jsdom, and React Testing Library dependencies.
2. Configure `vite.config.ts` to support Vitest.
3. Write a simple utility test (`checkoutBlockReason.test.ts`) to verify pure functions.
4. Write a basic component test (`BongoCat.test.tsx`) to verify rendering.
5. Add a `test` script to `package.json`.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, jsdom

---

### Task 1: Install Testing Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install Vitest and React Testing Library**

Run: 
```bash
cd frontend && npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/dom jsdom @vitest/ui
```
Expected: Packages installed successfully.

- [ ] **Step 2: Update package.json scripts**

Modify `frontend/package.json` to add a test script:
```json
  "scripts": {
    "i18n:sync": "python3 scripts/sync_i18n.py",
    "dev:vite": "vite",
    "dev": "node scripts/dev.mjs",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore(frontend): add vitest and testing-library dependencies"
```

### Task 2: Configure Vitest

**Files:**
- Modify: `frontend/vite.config.ts`
- Create: `frontend/vitest.setup.ts`

- [ ] **Step 1: Create setup file**

Create `frontend/vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 2: Update Vite config**

Modify `frontend/vite.config.ts` to include Vitest config:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add frontend/vite.config.ts frontend/vitest.setup.ts
git commit -m "build(frontend): configure vitest with jsdom and testing-library setup"
```

### Task 3: Write Utility Tests

**Files:**
- Create: `frontend/src/components/VCC/utils/checkoutBlockReason.test.ts`

- [ ] **Step 1: Write tests for checkoutBlockReason**

Create `frontend/src/components/VCC/utils/checkoutBlockReason.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { 
  getCheckoutBlockReasonText, 
  CHECKOUT_BLOCK_REASONS 
} from './checkoutBlockReason';

describe('checkoutBlockReason', () => {
  it('translates inactive reason correctly', () => {
    const mockTranslate = vi.fn((key: string) => `translated_${key}`);
    const result = getCheckoutBlockReasonText(mockTranslate, CHECKOUT_BLOCK_REASONS.INACTIVE);
    
    expect(mockTranslate).toHaveBeenCalledWith('checkout.block_reason.inactive');
    expect(result).toBe('translated_checkout.block_reason.inactive');
  });

  it('translates unknown reason to generic fallback', () => {
    const mockTranslate = vi.fn((key: string) => `translated_${key}`);
    const result = getCheckoutBlockReasonText(mockTranslate, 'some_random_reason');
    
    expect(mockTranslate).toHaveBeenCalledWith('checkout.blocked_unavailable');
    expect(result).toBe('translated_checkout.blocked_unavailable');
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `cd frontend && npm run test`
Expected: 1 test file passes.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/VCC/utils/checkoutBlockReason.test.ts
git commit -m "test(frontend): add unit tests for checkoutBlockReason utils"
```

### Task 4: Write Component Test

**Files:**
- Create: `frontend/src/components/VCC/BongoCat.test.tsx`

- [ ] **Step 1: Write tests for BongoCat**

Create `frontend/src/components/VCC/BongoCat.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BongoCat from './BongoCat';

describe('BongoCat Component', () => {
  it('renders correctly with default state', () => {
    render(<BongoCat isTyping={false} />);
    // Verify the container exists by looking for the paw elements
    const leftPaw = document.querySelector('.left-paw');
    expect(leftPaw).toBeInTheDocument();
  });

  it('applies typing animation class when isTyping is true', () => {
    const { container } = render(<BongoCat isTyping={true} />);
    // When typing, the animation class should be active
    const paws = container.querySelectorAll('.typing-animation');
    expect(paws.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `cd frontend && npm run test`
Expected: 2 test files pass.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/VCC/BongoCat.test.tsx
git commit -m "test(frontend): add component test for BongoCat"
```