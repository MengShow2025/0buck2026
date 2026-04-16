# Home AI Chat Background Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make only the home AI chat page background align with the "Me" page light-theme background while leaving private/group chat drawers unchanged.

**Architecture:** Scope the visual change to the home root container in `App.tsx` so the home scene gets its own light background treatment. Keep drawer-based chat pages on their existing background styles by not editing `ChatRoomDrawer.tsx`, `CustomMessageUI.tsx`, or shared theme variables.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Audit Current Home-Only Background Boundary

**Files:**
- Modify: `frontend/src/App.tsx`
- Reference: `frontend/src/components/VCC/Drawer/MeDrawer.tsx`

- [ ] **Step 1: Confirm the target reference color**

Read the home root and "Me" page root containers and note the exact class names:

```tsx
// App.tsx current root
<div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#ECE5DD] dark:bg-[#0b141a] relative overflow-hidden shadow-2xl font-sans transition-colors duration-300">

// MeDrawer.tsx target light background
<div className="flex flex-col h-full bg-gray-50 dark:bg-[#111111]">
```

- [ ] **Step 2: Define the containment rule**

Use this rule for the edit:

```ts
// Only change the home page root/background wrapper in App.tsx.
// Do not modify ChatRoomDrawer.tsx, CustomMessageUI.tsx, VCCInput.tsx, or index.css.
```

- [ ] **Step 3: Commit the boundary decision**

```bash
git add docs/superpowers/specs/2026-04-09-home-ai-chat-bg-design.md docs/superpowers/plans/2026-04-09-home-ai-chat-bg-alignment.md
git commit -m "docs: plan home ai chat background alignment"
```

### Task 2: Align Home AI Chat Background With Me Page

**Files:**
- Modify: `frontend/src/App.tsx`
- Verify: `frontend/src/App.tsx`

- [ ] **Step 1: Write the minimal home-only implementation**

Replace the home root and its bottom input wrapper background classes with the same light-theme family as the "Me" page:

```tsx
return (
  <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-50 dark:bg-[#0b141a] relative overflow-hidden shadow-2xl font-sans transition-colors duration-300">
    <VortexContainer>
      <div className="flex flex-col gap-2 pb-4">
        {messages.map((msg) => (
          <CustomMessageUI
            key={msg.id}
            message={msg}
            isMyMessage={() => msg.user.id === 'user'}
          />
        ))}
      </div>
    </VortexContainer>

    {/* Fixed positioned input at the bottom */}
    <div className="w-full bg-gray-50 dark:bg-[#0b141a] pt-2 z-20">
      <VCCInput onSendMessage={handleSendMessage} />
    </div>

    {/* Global Drawer Overlay */}
    <GlobalDrawer />
  </div>
);
```

- [ ] **Step 2: Verify no drawer chat colors were touched**

Run a targeted diff check and ensure only `App.tsx` changed:

```bash
git diff -- frontend/src/App.tsx frontend/src/components/VCC/Drawer/ChatRoomDrawer.tsx frontend/src/components/VCC/CustomMessageUI.tsx frontend/src/components/VCC/VCCInput.tsx frontend/src/index.css
```

Expected: only `frontend/src/App.tsx` has intentional changes.

- [ ] **Step 3: Run diagnostics**

Run diagnostics for the edited file:

```text
GetDiagnostics(file:///Users/long/Desktop/0buck/frontend/src/App.tsx)
```

Expected: no new diagnostics.

- [ ] **Step 4: Manual verification checklist**

Confirm these outcomes in the UI:

```text
1. Home AI chat page background matches the light gray family used by the Me page.
2. Private chat drawer remains on its original beige/light chat background.
3. Group chat drawer remains on its original beige/light chat background.
4. Bubble readability and input readability remain unchanged.
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "fix: align home ai chat background with me page"
```
