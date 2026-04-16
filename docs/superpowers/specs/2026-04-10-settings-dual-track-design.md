# 0Buck Settings & AI Configuration (Dual-Track) Design

## 1. Overview
The configuration system for 0Buck will support a **Dual-Track Mechanism**:
1.  **GUI Track**: A traditional, long-scrolling, categorized `SettingsDrawer` following an iOS-style card group layout.
2.  **Conversational Track**: All configurations exposed in the GUI can also be mutated via natural language interactions with the AI Butler (e.g., "Change to dark mode", "Forget my preference for black items"), leveraging the `0B_SYSTEM_ACTION` protocol.

## 2. Architecture & Modules

### 2.1 AI 3-Layer Cognitive Architecture Integration
The settings UI must strictly adhere to the AI 3-Layer Stack:
*   **L1 (Enforcement/Skeleton)**: Platform red lines (profit margins, vendor obfuscation). **Invisible and immutable to the user.**
*   **L2 (Strategy/Skin)**: Butler Persona templates (e.g., Professional, Friendly). **User-selectable from predefined options.**
*   **L3 (Surface/Soul)**: User custom instructions and Long-Term Memory (LTM) facts extracted via the Asynchronous Reflection Loop. **Fully mutable and clearable by the user.**

### 2.2 GUI Layout (Settings Drawer)
Implemented as a global drawer (`DrawerType: 'settings'`), categorized into distinct Card Groups:

**Group 1: Account & Security**
*   **Profile Summary**: Avatar, Nickname, Email.
*   **Password Management**: Trigger sub-flow.
*   **Social Logins**: Toggles for Google/Apple/Facebook (UI only for now).
*   **Danger Zone**: Delete Account button (Red styling).

**Group 2: System Preferences**
*   **Appearance**: System / Light / Dark toggle.
*   **Language**: Language selection.
*   **Notifications**: Toggles for Push, Radar, and Order updates.

**Group 3: AI Personalization (L2 & L3)**
*   **Butler Persona (L2)**: Select from platform templates.
*   **Model Engine**: Quick access to BYOK (Bring Your Own Key) model selection.
*   **Custom Instructions (L3)**: Text area for hardcoded user rules.
*   **Memory Vault (L3)**: View extracted tags (e.g., `[Likes Black]`) with the ability to delete individual tags or clear all.

**Group 4: General**
*   **Cache Management**: Clear local storage.
*   **Legal & About**: ToS, Privacy Policy, Version info.

## 3. Implementation Details

### 3.1 State Management (`AppContext.tsx`)
Expand global state to hold:
*   `theme` (already exists)
*   `language` (already exists)
*   `notifications` (boolean object)
*   `aiPersona` (string: 'professional' | 'friendly' | 'concise')
*   `aiCustomInstructions` (string)
*   `aiMemoryTags` (string array)

### 3.2 Conversational Track Mapping
Enhance `CustomMessageUI.tsx` and the mock AI response handler to parse intents that mutate these new states.
Example:
*   User: "Be more professional" -> AI responds -> Dispatches `0B_SYSTEM_ACTION: { action: 'SET_PERSONA', value: 'professional' }` -> Updates `AppContext.aiPersona`.

## 4. UI/UX Specifications
*   **Card Grouping**: White/Dark cards with `rounded-2xl`, inner dividers `divide-y`, and subtle shadows.
*   **Interactions**: Smooth toggle switches, active scaling (`active:scale-98`), and clear visual hierarchy (gray section headers).
*   **Responsiveness**: Full height scrolling container with a sticky/fixed transparent header.
