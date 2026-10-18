# Salad Shark - Global Leaderboard, Mobile/Desktop Layout, Leveling & Card Checkout Overhaul

A major architectural update introducing a persistent Express backend for global competitive rankings, a responsive mobile/desktop viewport with ergonomic touch thumb zones, permanent account-level progression across runs, and an instant 1-click credit card checkout for the Carnivore Megalodon skin.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been aligned based on user selections:
> - **Global Leaderboard Store**: Full-stack Express backend API (`server.ts`) with persistent JSON storage (`data/leaderboard.json`) hosting `/api/leaderboard` endpoints (GET top 10, POST submit score).
> - **Card Checkout Fix**: Instant 1-click test authorization with pre-validated arcade test card, zero typing friction, responsive mobile drawer geometry, and seamless transition to the unboxing cutscene.
> - **Permanent Leveling Progression**: Account Level and XP persist permanently across game sessions. Every veggie/meat chomped adds to permanent account XP, permanently unlocking ocean realms (Coral Lagoon at Level 1, Sunken Atlantis at Level 6, and Magma Sea at Level 11).
> - **Mobile & Desktop Adaptive Viewport**: Dynamic viewport fitting for mobile (375px–430px) and desktop (1440px), broad touch drag zones, ergonomic dual thumb buttons (Left: Skill, Right: Leap), and keyboard shortcuts (`A/D/Arrows`, `Space/W`, `E/Q`).

---

## 1. Overview & Core Concept

This update transforms *Salad Shark* into a cross-platform competitive arcade experience:
- **Global Leaderboard**: Players submit their high scores upon game over or view the top 10 leaderboard at any time. Powered by a persistent Express API backend.
- **Mobile & Desktop Parity**: Flawless touch drag controls, dedicated thumb clusters for one-handed mobile play, responsive canvas scaling, and full desktop keyboard navigation.
- **Permanent Account Progression**: Player Level and XP never reset between game overs. Cumulative chomps unlock higher difficulty tiers, bigger coin bonuses (+50 coins per level), and permanent access to Sunken Atlantis and Magma Sea.
- **Polished Card Checkout**: Eliminates input validation snags on mobile, providing an instant 1-click "Authorize & Unlock ($2.99)" test flow alongside the 800-coin alternative.

---

## 2. User Experience & Visual Design

### A. Global Top 10 Leaderboard Modal / View
```
┌──────────────────────────────────────────────────────────────┐
│                    GLOBAL LEADERBOARD                        │
│   Competitive Rankings across all Salad Shark chompers       │
├───────┬──────────────────────┬─────────┬──────────┬──────────┤
│ RANK  │ PLAYER               │ SCORE   │ COMBO    │ REALM    │
├───────┼──────────────────────┼─────────┼──────────┼──────────┤
│ 🥇 #1 │ MegalodonKing        │ 245 pts │ 34x      │ Magma    │
│ 🥈 #2 │ RomaineRebel         │ 188 pts │ 22x      │ Atlantis │
│ 🥉 #3 │ KaleConqueror        │ 162 pts │ 19x      │ Atlantis │
│   #4  │ SharkyFan99          │ 120 pts │ 15x      │ Lagoon   │
│  ...  │ (Top 10 Rankings)    │ ...     │ ...      │ ...      │
├───────┴──────────────────────┴─────────┴──────────┴──────────┤
│ [Your Best: 142 pts · Rank #5]       [Refresh]   [Close]     │
└──────────────────────────────────────────────────────────────┘
```
- **Post-Game Submission**: Upon Game Over, players can submit their name/tag with a quick text field or use a randomized shark nickname generator (e.g., *SaltySwimmer*, *ApexGrazer*, *AvocadoAce*).
- **Tabular Numerals**: Leaderboard scores, combos, and ranks use monospace tabular numerals for vertical alignment.
- **Trophy Styling**: Gold, silver, and bronze badges for top 3 positions with glowing accents.

### B. Adaptive Mobile & Desktop Layout Architecture
- **Desktop (1440px)**: Centered 16:9 arcade cabinet presentation, keyboard badges (`[A/D]`, `[SPACE]`, `[E]`), wide canvas backdrop.
- **Mobile (<768px)**:
  - Canvas scales dynamically to fit screen width while maintaining playfield aspect ratio.
  - **Full-Screen Touch Drag Zone**: Drag anywhere across the lower 60% of the screen to guide Sharky smoothly.
  - **Dual Ergonomic Thumb Cluster**:
    - **Bottom-Left Thumb Button (48x48px)**: Active Ability (`[SKILL]`) with circular cooldown ring and ready glow.
    - **Bottom-Right Thumb Button (54x54px)**: `[LEAP!]` button for vertical jumps.
  - **Compact Mobile HUD**: Slim top bar occupying <12% of screen height to preserve full visibility of falling items.

### C. Fixed Leveling System
- **Permanent Account Level**: Displayed in Title Menu, Header, and In-Game HUD.
- **Progress Bar**: Shows cumulative XP and requirement for next level (`LVL 4 [████░░] 42/50 XP`).
- **Level Up Rewards**: Leveling up triggers fanfare audio, screen sparkle burst, and +50 Coral Coins reward popup.
- **Permanent Realm Unlocks**:
  - Levels 1–5: *Coral Lagoon*
  - Levels 6–10: *Sunken Atlantis*
  - Levels 11+: *Magma Sea*

### D. Fixed Credit Card Checkout
- **1-Click Test Authorization**: Instant test autofill & authorize button that passes validation instantly.
- **Responsive Drawer**: Sized for mobile screens (`max-h-[90vh] overflow-y-auto`) with proper keyboard padding and tap target hitboxes.
- **Instant Receipt & Cutscene**: Authorizing card instantly updates `unlockedSkins`, stores in `localStorage`, and triggers the celebratory 3D unboxing cutscene.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Express Backend Storage vs Firebase
- **Chosen Approach**: Full-stack Express server (`server.ts`) with persistent JSON storage in `data/leaderboard.json`, served on port 3000 via `tsx server.ts`.
- **Why**: Zero external API keys or credentials required, instant local file persistence, fast response times, and built-in compatibility with the project's existing Node/Express dependencies.

### Decision 2: Permanent Account Leveling vs Per-Run Leveling
- **Chosen Approach**: Permanent account leveling that never resets on game over.
- **Why**: Eliminates player frustration, provides a rewarding sense of long-term progression, and unlocks subsequent ocean realms permanently.

### Decision 3: Touch Drag Zone + Dual Thumb Controls
- **Chosen Approach**: Full-screen horizontal touch tracking paired with dedicated bottom thumb buttons.
- **Why**: Follows mobile thumb-zone ergonomics, preventing reach fatigue while keeping controls intuitive for both touch and desktop users.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React SPA)                     │
│  App.tsx  <───>  GameCanvas.tsx  <───>  HUD & Thumb Controls │
│      │                                                      │
│      ├─── LeaderboardModal.tsx (Top 10 Global Table)        │
│      ├─── CreditCardCheckoutModal.tsx (1-Click Test Pay)    │
│      └─── SkinShopModal.tsx & SkinCutsceneModal.tsx         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST (/api/leaderboard)
┌──────────────────────────────▼──────────────────────────────┐
│                  Express Server (server.ts)                 │
│  - GET  /api/leaderboard -> returns top 10 scores           │
│  - POST /api/leaderboard -> adds score, trims to top 50     │
│  - Serves Vite middlewares in development mode              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Read / Write
┌──────────────────────────────▼──────────────────────────────┐
│               data/leaderboard.json (Persistent)            │
└─────────────────────────────────────────────────────────────┘
```

### Data Models:

```typescript
export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  maxCombo: number;
  level: number;
  skinId: string;
  mapId: string;
  createdAt: string;
}
```

---

## Verification & Deployment Plan

1. **Backend Verification**: Test `GET /api/leaderboard` and `POST /api/leaderboard` via Express server to confirm persistent score storage and sorting.
2. **Mobile Viewport Testing**: Test layout across mobile (375px, 414px) and desktop (1440px) breakpoints, ensuring touch zones and thumb buttons respond cleanly.
3. **Leveling Persistence**: Verify player Level and XP persist after Game Over and restart.
4. **Checkout Verification**: Verify 1-click test card payment unlocks Carnivore Shark and transitions directly into the unboxing cutscene.
5. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to verify zero type or build errors.
