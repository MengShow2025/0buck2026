# Settings Dual-Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive settings drawer featuring categorized card groups for Account, System, and AI Configuration (3-Layer Stack), integrated with the AppContext for dual-track conversational mutation.

**Architecture:** Extend `AppContext.tsx` with robust configuration states (AI Persona, LTM Memory Tags, Notifications). Create `SettingsDrawer.tsx` with a highly polished iOS-style grouping. Finally, wire up the mock AI responses to trigger these new settings directly from the chat interface.

**Tech Stack:** React Context, Tailwind CSS (Cards, Switches, Dividers), Lucide React Icons.

---

### Task 1: Extend AppContext for Settings Configuration

**Files:**
- Modify: `frontend/src/components/VCC/AppContext.tsx`

- [ ] **Step 1: Add new configuration types and state variables**
Expand the `AppContextType` interface to include the new settings: `notifications`, `aiPersona`, `aiCustomInstructions`, and `aiMemoryTags`, along with their respective setters.

- [ ] **Step 2: Implement state initialization and providers**
Add the `useState` hooks for these new properties (with sensible defaults) inside `AppProvider`, and expose them in the context value.

- [ ] **Step 3: Add `settings` to `DrawerType`**
Ensure `'settings'` is a valid value in the `DrawerType` union.

### Task 2: Create the Settings Drawer Component

**Files:**
- Create: `frontend/src/components/VCC/Drawer/SettingsDrawer.tsx`

- [ ] **Step 1: Scaffold the Drawer layout**
Build a scrollable container with a sticky header (Back button and Title).

- [ ] **Step 2: Implement Card Group 1: Account & Security**
Design a `div` with `bg-white dark:bg-[#1C1C1E] rounded-2xl` containing user profile info, Password Change, and Social Login toggles.

- [ ] **Step 3: Implement Card Group 2: System Preferences**
Design the group for Appearance (Dark/Light/System), Language, and Notifications.

- [ ] **Step 4: Implement Card Group 3: AI Personalization (L2 & L3)**
Design the group representing the 3-Layer Stack:
  - L2: Butler Persona selection (Professional, Friendly, Concise).
  - L3: Custom Instructions textarea.
  - L3: Memory Vault tag list (with delete buttons).

- [ ] **Step 5: Implement Card Group 4: General**
Add Cache clear and About sections at the bottom.

### Task 3: Register Settings Drawer and Add Entry Point

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/GlobalDrawer.tsx`
- Modify: `frontend/src/components/VCC/Drawer/LoungeDrawer.tsx` (or another appropriate header)

- [ ] **Step 1: Register `SettingsDrawer` in `GlobalDrawer.tsx`**
Import and conditionally render `<SettingsDrawer />` when `activeDrawer === 'settings'`. Hide the global header for it.

- [ ] **Step 2: Add a Settings icon/button to the application header**
In a suitable location (e.g., the top right of the main app header or inside an existing menu), add a `Settings` cog icon that calls `pushDrawer('settings')`.

### Task 4: Implement Conversational Track (Mock AI Commands)

**Files:**
- Modify: `frontend/src/components/VCC/CustomMessageUI.tsx`
- Modify: `frontend/src/components/VCC/VCCInput.tsx`

- [ ] **Step 1: Update `CustomMessageUI.tsx` handler**
Expand the `0B_SYSTEM_ACTION` listener to handle new actions like `SET_PERSONA` and `CLEAR_MEMORY`, linking them to the new context setters.

- [ ] **Step 2: Add mock triggers in `VCCInput.tsx`**
Create specific mock chat inputs (e.g., "Be more professional" or "Clear my memory") that reply with the corresponding `0B_SYSTEM_ACTION` attachment, proving the dual-track system works.