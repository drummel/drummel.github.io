# Big Sur Trip Planner

**Dates:** January 30 – February 1, 2026 (Friday arrival, Sunday return)

## Trip Context

- **Staying:** Near Malpaso Creek Beach Cove (Garrapata State Park area)
- **Return:** San Rafael — not rushed, can stay until 9pm Sunday
- **Weather:** 59-60°F, 18-26% rain chance (looking good!)

## Seasonal Bonuses (Perfect Timing!)

- 🌺 **Calla Lily Valley** — peak bloom starting late January!
- 🐋 **Gray Whale Migration** — mid-January is PEAK viewing
- 🦦 **Sea Otter Pups** — born January-March

---

## Design Thinking & Requirements

### 1. Two-Phase Discovery + Scheduling Model

**Phase 1 (Discovery):** Browse all activities, mark them as:
- ⭐ **Interested** — might want to do
- ❤️ **Must-Do** — definitely want to do
- **Pass** — not interested, hide from scheduler

**Phase 2 (Scheduling):** All items (except passed) appear in the scheduler sidebar

### 2. Scheduling Granularity

- Keep it simple: **Morning / Afternoon buckets** per day (not specific times)
- Allow reordering within buckets
- Show preference badges (⭐/❤️) on scheduled items
- "Pass" items don't appear in the scheduling view

### 3. Multi-User / Multi-Plan Local Storage

- First visit: Prompt for name ("What's your name?")
- Favorites are tied to YOU (personal preferences)
- Plans are schedules you experiment with — one person can have multiple plans
- Switch between users via dropdown
- Switch between plans for a given user
- Auto-save every change (no "unsaved changes" anxiety)

### 4. URL Hash Sharing

- Encode selections in URL hash for sharing
- Use compressed/encoded format if plain text gets too long (pragmatic)
- Update hash in real-time using `replaceState` (don't spam browser history)
- Floating "Share This Plan" button → copies link to clipboard

### 5. Shared Link Import Flow

- Opening a shared link shows: "You're viewing [Name]'s [Plan Name]"
- Options: **[Save a Copy]** or **[Just Browsing]**
- Importing creates YOUR copy — doesn't overwrite their data or your existing plans
- Shared links shouldn't auto-save to your localStorage

### 6. Driving Time Estimates

- Activities tagged by zone (north/central/south/carmel)
- Calculate rough drive times between scheduled items
- Show running totals: Activity count, Total hours, Driving time
- Sunday shows ETA home to San Rafael (accounting for 2hr drive)

### 7. Content Categories

**Hikes:**
- Ewoldsen Trail, Soberanes Canyon, Garrapata Bluffs
- Pfeiffer Falls + Valley View, Partington Cove Tunnel
- Point Lobos Reserve

**Beaches:**
- Pfeiffer Beach, Garrapata Beach, Andrew Molera Beach

**Scenic:**
- McWay Falls, Bixby Bridge, 17-Mile Drive

**Seasonal:**
- Calla Lily Valley (Peak Bloom!)
- Gray Whale Watching (Peak Migration!)

**Food - Big Sur:**
- Nepenthe, Cafe Kevah, Big Sur Bakery
- Big Sur River Inn, Deetjen's, Big Sur Taphouse

**Food - Provisions:**
- Big Sur Deli, Big Sur Village General Store

**Food - Carmel:**
- Stationæry (Michelin Bib), Carmel Belle, La Bicyclette
- Carmel Bakery, Bruno's Market & Deli

**Culture:**
- Henry Miller Library

### 8. Sunday Flexibility

- NOT rushed to get home
- Getting back by 9pm is fine
- Want to maximize time in Big Sur on Sunday
- 7am checkout, then activities, then head north

---

## Key UX Principles

- **Pragmatic over perfect** — if something's "good enough," go with it
- **No anxiety** — auto-save, don't warn about unsaved changes
- **Clear separation** — your data vs. shared previews
- **Collaborative** — couples/groups can each build their own version
- **Simple mental model** — favorites are YOU, plans are SCHEDULES

---

## Zone-Based Drive Times

From cabin at Garrapata:
- **North (Garrapata area):** ~5 min
- **Central (Big Sur Village, Nepenthe):** ~25 min
- **South (McWay, Ewoldsen):** ~40 min
- **Carmel (Point Lobos, town):** ~25 min

---

## File Structure

```
big-sur-jan-26/
├── index.html      # Main HTML structure
├── styles.css      # All CSS styles
├── app.js          # Application logic and data
└── README.md       # This file
```

---

## Development Notes

- All state saved to localStorage under key `bigSurPlanner`
- URL hash encoding uses base64 for compact sharing
- Drag-and-drop for scheduling uses native HTML5 API
- No external dependencies (vanilla JS)
