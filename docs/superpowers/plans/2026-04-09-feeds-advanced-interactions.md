# My Feeds Media Sorting and Comment Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement drag-and-drop sorting for media uploads in the post creation UI and refactor the comment system into a nested tree structure (YouTube style).

**Architecture:**
1.  **Media Sorting:** Use `onDragStart`, `onDragOver`, and `onDrop` events to allow reordering the `selectedMedia` array in `MyFeedsDrawer.tsx`.
2.  **Comment Tree:** Refactor `INITIAL_MY_FEEDS` to support nested `replies` and create a recursive `CommentItem` component that renders replies indented directly under the parent comment.

**Tech Stack:** React, Tailwind CSS, Lucide React (no external drag-and-drop libraries needed for this simple requirement).

---

### Task 1: Implement Drag-and-Drop Media Sorting

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/MyFeedsDrawer.tsx`

- [ ] **Step 1: Add drag-and-drop handlers to the media preview grid.**

```typescript
const handleDragStart = (index: number) => (e: React.DragEvent) => {
  e.dataTransfer.setData('draggedIndex', index.toString());
};

const handleDrop = (index: number) => (e: React.DragEvent) => {
  const draggedIndex = parseInt(e.dataTransfer.getData('draggedIndex'));
  if (draggedIndex === index) return;
  
  const newMedia = [...selectedMedia];
  const [removed] = newMedia.splice(draggedIndex, 1);
  newMedia.splice(index, 0, removed);
  setSelectedMedia(newMedia);
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
};
```

- [ ] **Step 2: Update the JSX to enable dragging.**

```tsx
{selectedMedia.map((m, idx) => (
  <div 
    key={idx}
    draggable
    onDragStart={handleDragStart(idx)}
    onDragOver={handleDragOver}
    onDrop={handleDrop(idx)}
    className="relative aspect-square rounded-xl overflow-hidden border border-white/20 shadow-sm group cursor-move active:opacity-50"
  >
    {/* ... media content ... */}
  </div>
))}
```

### Task 2: Refactor Comment System to a Tree Structure

**Files:**
- Modify: `frontend/src/components/VCC/Drawer/MyFeedsDrawer.tsx`

- [ ] **Step 1: Update Mock Data Structure.**

```typescript
// Update INITIAL_MY_FEEDS to include replies
const INITIAL_MY_FEEDS = [
  {
    // ...
    comments: [
      { 
        id: 'c1', 
        user: 'Alex', 
        text: '真的假的？我也想抢！', 
        time: '1小时前',
        replies: [
          { id: 'r1', user: 'Lorna', text: '真的，我也抢到了一个。', time: '30分钟前' }
        ]
      },
      { id: 'c2', user: 'Jack', text: '下次什么时候还有活动？', time: '10分钟前', replies: [] }
    ],
    // ...
  }
];
```

- [ ] **Step 2: Create a recursive `CommentItem` component.**

```tsx
const CommentItem: React.FC<{ 
  comment: any; 
  onReply: (userName: string) => void;
  isReply?: boolean;
}> = ({ comment, onReply, isReply }) => (
  <div className={`flex flex-col gap-2 ${isReply ? 'ml-10 mt-2' : ''}`}>
    <div className="flex gap-3">
      <div className={`${isReply ? 'w-6 h-6 rounded-[8px] text-[10px]' : 'w-8 h-8 rounded-[12px] text-[12px]'} bg-gray-200 dark:bg-white/10 flex items-center justify-center font-black text-gray-500 shrink-0`}>
        {comment.user.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`${isReply ? 'text-[12px]' : 'text-[13px]'} font-black text-gray-900 dark:text-white`}>{comment.user}</span>
          <span className="text-[10px] text-gray-400 font-bold">{comment.time}</span>
        </div>
        <p className={`${isReply ? 'text-[12px]' : 'text-[13px]'} text-gray-600 dark:text-gray-400 leading-snug font-medium`}>{comment.text}</p>
        <button 
          onClick={() => onReply(comment.user)}
          className="text-[11px] font-bold text-gray-400 mt-1 hover:text-[var(--wa-teal)] transition-colors"
        >
          回复
        </button>
      </div>
    </div>
    {comment.replies && comment.replies.length > 0 && (
      <div className="border-l-2 border-gray-100 dark:border-white/5 ml-4">
        {comment.replies.map((reply: any) => (
          <CommentItem key={reply.id} comment={reply} onReply={onReply} isReply />
        ))}
      </div>
    )}
  </div>
);
```

- [ ] **Step 3: Update the `handleReply` logic to handle tree insertions.**
    *(For this mock version, we'll append to the top-level or parent depending on state).*

### Task 3: Commit and Verify

- [ ] **Step 1: Test media reordering.**
- [ ] **Step 2: Test recursive comment rendering.**
- [ ] **Step 3: Commit changes.**
