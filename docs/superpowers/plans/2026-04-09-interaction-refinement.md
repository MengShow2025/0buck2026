# Interaction and Layout Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the interaction issue in `NotificationDrawer.tsx` to make reply cards more clickable, and limit the "Group Buy" and "Topics" sections in `SquareDrawer.tsx` to 3 items with a functional "All" button.

**Architecture:**
1.  **NotificationDrawer**: Make the card's content area clickable to trigger the reply state if the notification type is `interaction` or `reply`. Ensure the input field focuses correctly.
2.  **SquareDrawer**: Use `slice(0, 3)` on the data arrays for the "Group Buy" and "Topics" sections. Ensure the "All" button correctly triggers the `all_group_buy` and `all_topics` drawer types.

**Tech Stack:** React, Tailwind CSS, Lucide React.

---

### Task 1: Refine NotificationCard Interaction

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/NotificationDrawer.tsx`

- [ ] **Step 1: Make the card content area clickable for reply-type notifications.**
    Wrap the content in a `div` with an `onClick` that sets `isReplying` to `true` if the type is `interaction` or `reply`.

- [ ] **Step 2: Ensure the input focuses correctly.**
    Add a `ref` to the input and use `useEffect` or simply `autoFocus`. (Already has `autoFocus`, but let's double-check).

- [ ] **Step 3: Test the click interaction.**
    Ensure clicking anywhere in the middle of the card (not on the header or footer) triggers the reply input.

### Task 2: Limit SquareDrawer Sections

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/SquareDrawer.tsx`

- [ ] **Step 1: Update `GROUP_BUY_DATA` rendering to show only 3 items.**
    Use `GROUP_BUY_DATA.slice(0, 3).map(...)`.

- [ ] **Step 2: Update `TOPICS` rendering to show only 3 items.**
    Use `TOPICS.slice(0, 3).map(...)`.

- [ ] **Step 3: Ensure "All" buttons are functional.**
    The "All" buttons already have `onClick={() => setActiveDrawer('all_group_buy')}` and `onClick={() => setActiveDrawer('all_topics')}`. Ensure `GlobalDrawer.tsx` handles these correctly (it does).

- [ ] **Step 4: Verify the layout.**
    Check that only 3 items are visible in each section.

---

### Task 3: Commit and Verify

- [ ] **Step 1: Commit the changes.**
    `git add frontend/src/components/VCC/Drawer/NotificationDrawer.tsx frontend/src/components/VCC/Drawer/SquareDrawer.tsx`
    `git commit -m "refactor: fix notification reply interaction and limit square sections"`
