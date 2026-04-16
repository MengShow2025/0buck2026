# My Feeds Comment and Reply Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the comment reply logic in `MyFeedsDrawer.tsx` to allow replying to specific comments and collapse comments when clicking on empty space.

**Architecture:** 
1.  Update the state to track which feed's comments are expanded and who the user is replying to (specific comment vs. general post).
2.  Add click handlers to comments to set the reply target.
3.  Add a global click handler to the drawer container to collapse comments when clicking outside active cards.

**Tech Stack:** React, Tailwind CSS, Lucide React.

---

### Task 1: Update State and Reply Logic

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/MyFeedsDrawer.tsx`

- [ ] **Step 1: Update state definitions for expanded comments and specific replies.**

```typescript
// Replace:
// const [replyingTo, setReplyingTo] = useState<string | null>(null);
// With:
const [replyingTo, setReplyingTo] = useState<{ feedId: string, userName?: string } | null>(null);
const [expandedFeedIds, setExpandedFeedIds] = useState<Set<string>>(new Set());

const toggleComments = (feedId: string) => {
  const newSet = new Set(expandedFeedIds);
  if (newSet.has(feedId)) {
    newSet.delete(feedId);
    if (replyingTo?.feedId === feedId) setReplyingTo(null);
  } else {
    newSet.add(feedId);
  }
  setExpandedFeedIds(newSet);
};
```

- [ ] **Step 2: Update `handleReply` to support targeted replies.**

```typescript
const handleReply = (feedId: string) => {
  if (!replyContent.trim()) return;
  
  const targetUser = replyingTo?.userName;
  const finalContent = targetUser ? `@${targetUser} ${replyContent}` : replyContent;

  setFeeds(feeds.map(f => {
    if (f.id === feedId) {
      return {
        ...f,
        comments: [...f.comments, { id: `c${Date.now()}`, user: '我', text: finalContent, time: '刚刚' }]
      };
    }
    return f;
  }));
  setReplyContent('');
  setReplyingTo(null);
};
```

### Task 2: Update UI for Clickable Comments and Collapsing

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/MyFeedsDrawer.tsx`

- [ ] **Step 1: Make comments clickable to trigger reply.**

```tsx
{/* Find the comment mapping and add onClick */}
{feed.comments.map((comment) => (
  <div 
    key={comment.id} 
    className="flex gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded-xl transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      setReplyingTo({ feedId: feed.id, userName: comment.user });
    }}
  >
    {/* ... avatar and text ... */}
  </div>
))}
```

- [ ] **Step 2: Update the `MessageSquare` button to toggle expansion.**

```tsx
<button 
  onClick={(e) => { e.stopPropagation(); toggleComments(feed.id); }}
  className={`flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-all duration-200 ${expandedFeedIds.has(feed.id) ? 'text-blue-500 scale-110' : 'text-gray-400 hover:text-blue-500'}`}
>
  <MessageSquare className={`w-4 h-4 ${expandedFeedIds.has(feed.id) ? 'fill-current' : ''}`} /> {feed.comments.length}
</button>
```

- [ ] **Step 3: Update the conditional rendering of the comments section.**

```tsx
{/* Replace: (feed.comments.length > 0 || replyingTo === feed.id) */}
{expandedFeedIds.has(feed.id) && (
  <div className="bg-gray-50/50 dark:bg-white/5 border-t border-gray-100/50 dark:border-white/5 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
    {/* ... comments ... */}
    {/* Update placeholder if replying to specific user */}
    <input 
      placeholder={replyingTo?.userName ? `回复 @${replyingTo.userName}...` : "写下你的回复..."}
      // ... rest of input ...
    />
  </div>
)}
```

- [ ] **Step 4: Implement "click empty space to close" on the outer container.**

```tsx
<div 
  className="flex flex-col h-full bg-[#F2F2F7] dark:bg-[#000000] overflow-y-auto pb-24"
  onClick={() => {
    setExpandedFeedIds(new Set());
    setReplyingTo(null);
  }}
>
  {/* ... contents ... */}
</div>
```

### Task 3: Commit and Verify

- [ ] **Step 1: Verify the interaction.**
    - Clicking a comment sets the reply target and shows "回复 @User".
    - Clicking the message icon toggles the comment section.
    - Clicking anywhere outside the feed card/comments collapses all expanded comments.
- [ ] **Step 2: Commit changes.**

```bash
git add frontend/src/components/VCC/Drawer/MyFeedsDrawer.tsx
git commit -m "feat(feeds): refine reply logic and comment collapse behavior"
```
