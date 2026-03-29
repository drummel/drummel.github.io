# Bug Chess AI Strategy Document

## Overview

This document describes the AI strategy system for Bug Chess, a Hive-inspired
hex strategy game. It covers the strategic principles, known flaws, and the
reasoning behind each design decision.

---

## Core Strategic Principles of Hive

### 1. Queen Liberty Count (Most Important)

The single most important heuristic in Hive is **how many sides of each queen
are surrounded**. A queen with 6/6 sides filled is dead. Every strategic
decision should ultimately serve one of two goals:

- **Increase** opponent queen's surround count
- **Decrease** (or prevent increase of) own queen's surround count

### 2. The First Piece is Permanently Pinned

The very first piece placed in a game becomes the "root" of the hive. Because
both players build outward from it, it almost always remains an **articulation
point** (removing it would split the hive into two disconnected components)
for the entire game.

**Implication**: Never place a high-value piece (Ant, Beetle) first. Spend an
expendable Spider or Grasshopper as the foundation.

### 3. Queen Placement Timing

- **Turn 1**: Too early. Queen is exposed with no support pieces.
- **Turn 2**: Ideal. Unlocks movement for all your pieces with minimal exposure.
- **Turn 3**: Acceptable but costs one turn of mobility.
- **Turn 4**: Forced placement. You've wasted turns that could have been movement.

Tournament players near-universally place queen on turn 2.

### 4. Piece Values (When Mobile)

| Piece | Offensive Value | Why |
|-------|----------------|-----|
| Ant | Highest | Unlimited perimeter movement. Can reach any open hex in one turn. |
| Beetle | Very High | Can climb on top of queen (immobilizes it) or pin other pieces. |
| Mosquito | Very High | Copies any adjacent type. Can act as ant, beetle, etc. |
| Ladybug | High | Moves 2-on-top-1-down. Can reach interior hexes ants cannot. |
| Grasshopper | Medium | Jumps in straight lines. Good for leaping over defensive walls. |
| Spider | Low | Exactly 3 spaces. Predictable and limited. |
| Pillbug | Situational | Weak movement but special grab ability can be game-changing. |

### 5. Placement vs Movement Priority

**Pieces in hand are useless.** A common beginner mistake is shuffling existing
pieces around while leaving powerful pieces in hand. The AI should strongly
prefer placing new pieces (especially ants and beetles) over making marginal
moves with existing pieces.

**Rule of thumb**: Only move a piece instead of placing if:
- The move directly increases opponent queen surround
- The move prevents imminent loss (queen defense)
- You have no pieces left in hand
- A beetle can get on/adjacent to the opponent's queen

---

## How the AI System Works

The AI operates as a three-stage pipeline: **action generation**, **scoring**,
and **selection**. Each difficulty level uses the same first two stages but
differs in how it combines scores and selects the final action.

### Stage 1: Action Generation (`getAllActions`)

On each turn, the AI enumerates every legal action available to it:

1. **Placement actions**: For every piece type remaining in hand, and every
   valid placement hex (adjacent to friendly, not adjacent to enemy), generate
   a `{kind: 'place', type, q, r}` action. If the queen must be placed this
   turn (turn 4 forced placement), only queen placements are generated.

2. **Movement actions**: For every piece the AI owns on the board (top of
   stack only), compute all legal destination hexes using `Pieces.getValidMoves`.
   This respects one-hive rule, freedom of movement / gate checks, and
   piece-specific movement rules. Each becomes a `{kind: 'move', fromQ, fromR,
   toQ, toR, pieceType}` action.

3. **Pillbug special actions**: If the AI has a pillbug (or mosquito copying
   pillbug), the special grab-and-relocate targets are also enumerated.

This typically produces 20-200+ candidate actions in the mid-game.

### Stage 2: Scoring (`scoreAction`)

Each candidate action is scored by a heuristic function that considers:

#### For Placement Actions:
- **Opening book priority**: A lookup table maps turn number to preferred piece
  types. Turn 1 prefers expendable pieces (spider, grasshopper), turn 2 demands
  queen, turns 3+ prefer offensive pieces (ant, beetle). The piece's position
  in the priority list maps to a score (higher priority = higher score).
- **First-piece penalty**: Ant on turn 1 gets -30 (will be permanently pinned).
  Beetle on turn 1 gets -15.
- **Queen timing bonus**: Queen on turn 2 gets +30. Queen on turn 1 gets -25.
- **Deployment urgency**: When 4+ pieces remain in hand, all placements get +15.
  Ants get an additional +12 after queen is placed, beetles +10.
- **Position quality**: Distance to opponent queen (closer = better), +20 for
  adjacent placement. Compact placement bonus (+2 per adjacent friendly piece).
- **Queen safety**: When placing the queen specifically, scores open neighbors
  (+3 each) and penalizes adjacent enemy pieces (-8 each).

#### For Movement Actions:
- **Move-away penalty** (critical fix): If the piece is currently adjacent to
  the opponent's queen and would move to a non-adjacent hex, score -35. This
  prevents the AI from accidentally reducing the opponent's surround count.
- **Shuffle penalty**: Moving between two queen-adjacent hexes scores -5.
  This prevents the aimless ant-shuffling behavior.
- **New adjacency bonus**: Moving FROM a non-adjacent hex TO adjacent scores
  +25 plus surround_count * 10. Only genuinely new threats are rewarded.
- **Beetle on queen**: Moving a beetle onto the queen's hex (distance 0) scores
  +50. This is the single highest-value move in the game.
- **Approach bonus**: For pieces not already adjacent, each hex closer to the
  opponent queen scores +4.
- **Defense**: If own queen has 3+ sides surrounded and the piece is adjacent
  to it, moving away gets -20.
- **Queen movement**: Moving the queen itself gets -8 (usually bad) unless it
  reduces the queen's surround count (escaping = +20).
- **Deployment preference**: If 4+ pieces in hand, movements get -10 (prefer
  placing). If 2+ in hand and the move doesn't threaten the opponent queen
  (distance > 2), gets -8.
- **Oscillation penalty**: If this move reverses a recent move (same piece
  going back), -50.

#### For Pillbug Special Actions:
- +25 for pulling an enemy piece away from own queen (distance 1)
- +20 for placing any piece adjacent to opponent queen

### Stage 3: Selection (Difficulty-Dependent)

#### Easy (`pickEasy`)
1. Score all actions with `scoreAction` + random noise (0 to 40)
2. Sort by score descending
3. Pick randomly from the **top 50%**

The large random noise means easy frequently picks bad moves, but the base
scoring prevents completely nonsensical play.

#### Medium (`pickMedium`)
1. Score all actions with `scoreAction` + small noise (0 to 10)
2. Sort by score descending
3. Pick randomly from the **top 3**

Follows the heuristics fairly well but has some unpredictability.

#### Hard (`pickHard`)
1. Score all actions with `scoreAction` (weight x2) + `simulateDelta` (weight x3)
   + tiny noise (0 to 5)
2. Sort by score descending
3. Pick randomly from the **top 2**

`simulateDelta` clones the board, applies the action, and computes:
`evaluateBoard(after) - evaluateBoard(before)`. This catches moves that look
good heuristically but don't actually improve the board state, and finds
moves that the heuristics might undervalue.

#### Impossible (`pickImpossible`)
1. For each action, compute:
   - `scoreAction` (weight x2)
   - `simulateDelta` (weight x3)
   - **2-ply counter**: Clone the board after the move, evaluate from the
     opponent's perspective using `evaluateBoard`, negate it (opponent's gain
     is our loss), weight x0.5
2. Sum all three components
3. Pick the **single highest-scoring action** (no randomness)

The 2-ply analysis means the AI avoids moves that look good for it but leave
the opponent in an even better position. It's not a full minimax (doesn't
enumerate opponent responses), but the static evaluation from the opponent's
perspective catches many blunders.

### Board Evaluation (`evaluateBoard`)

This function takes a board position and returns a numeric score from the
perspective of a given player. It's used by the simulation stages (hard and
impossible) to evaluate hypothetical board states.

Components:
1. **Queen liberty count**: +30 per side of opponent queen surrounded, -35 per
   side of own queen surrounded. +10000 for win, -10000 for loss.
2. **Critical thresholds**: +120 when opponent queen has 5/6 sides (one move
   from winning), -140 when own queen has 5/6 (one move from losing).
3. **Queen mobility**: +6 per legal slide the own queen could make.
4. **Self-surround exploitation**: +8 per opponent piece surrounding their own
   queen (they're helping us win).
5. **Pin differential**: +5 per opponent pinned piece minus own pinned pieces.
6. **Mobile ant count**: +10 per own mobile ant, -8 per opponent mobile ant.
   If 2+ own mobile ants and opponent queen has 2+ sides, extra +30.
7. **Piece proximity**: For each own piece within distance 3 of opponent queen,
   +(4 - distance) * 4. Beetle bonuses: +40 if on queen, +18 if adjacent.
   Ant bonus: +10 if within 2.

### Oscillation Detection

The AI maintains a `moveHistory` buffer of the last 10 actions. Before scoring
a move action, it checks if the move reverses any recent move (same piece,
swapped from/to coordinates). If so, -50 penalty. The history is cleared on
new game via `AI.reset()`.

---

## Known AI Flaws (Fixed)

### Flaw 1: Ant Shuffling (Critical) — FIXED

**Problem**: The AI moved an ant from one hex adjacent to the opponent's queen
to another adjacent hex. This scored +20 but accomplished nothing (surround
count unchanged).

**Root cause**: Scoring evaluated absolute destination quality, not net change.

**Fix applied**: Shuffling between two queen-adjacent hexes now scores -5.
Only moving FROM non-adjacent TO adjacent gets the +25 bonus.

### Flaw 2: Helping the Opponent (Critical) — FIXED

**Problem**: The AI moved pieces AWAY from the opponent's queen, reducing their
surround count.

**Root cause**: Scoring only looked at destination, never checked what was
being left behind.

**Fix applied**: -35 penalty for leaving a queen-adjacent hex to go non-adjacent.
The `isAdjacentTo` helper checks origin and destination independently.

### Flaw 3: Under-valuing Placement (Moderate) — FIXED

**Problem**: AI shuffled existing pieces instead of deploying from hand.

**Root cause**: Movement scores exceeded placement scores.

**Fix applied**: +15 bonus for any placement when 4+ pieces in hand. +12 for
ant placement, +10 for beetle after queen is placed. Movements get -10 when
4+ pieces unplayed, -8 for non-threatening moves when 2+ in hand.

### Flaw 4: No Oscillation Detection (Moderate) — FIXED

**Problem**: AI moved the same piece back and forth indefinitely.

**Fix applied**: `moveHistory` tracks last 10 moves. Any move that reverses a
recent move (same piece, swapped from/to) gets -50. History cleared on new game.

### Flaw 5: Simulation Doesn't Compare Before/After (Minor) — FIXED

**Problem**: `simulateAction` evaluated board AFTER move but didn't compare to
BEFORE. Do-nothing moves scored the same as transformative ones.

**Fix applied**: Replaced with `simulateDelta()` which computes
`evaluateBoard(after) - evaluateBoard(before)`. Used by Hard (weight x3)
and Impossible (weight x3) difficulty levels.

---

## Opening Book

### Player 1 (White, moves first)

| Turn | Action | Reasoning |
|------|--------|-----------|
| 1 | Place Spider/Grasshopper | Expendable piece as permanent foundation |
| 2 | Place Queen | Unlock movement immediately |
| 3 | Place Ant | Deploy best offensive piece (now mobile) |
| 4 | Place Ant or Beetle | Continue offensive deployment |
| 5+ | Move ants toward opponent queen | Begin pressure campaign |

### Player 2 (Black, moves second)

| Turn | Action | Reasoning |
|------|--------|-----------|
| 1 | Place Spider/Grasshopper | Mirror expendable foundation |
| 2 | Place Queen | Unlock movement |
| 3 | Place Ant (near opponent queen if possible) | Immediate threat |
| 4+ | Deploy Beetles, move Ants | Coordinate attack |

---

## Tactical Patterns

### The Ant Leapfrog

Deploy two ants. Move Ant A adjacent to opponent queen (forcing a response).
Next turn, move Ant B to a different adjacent hex. The opponent can only respond
to one threat at a time, so the surround count increases.

### Beetle on Queen

A beetle on top of the opponent's queen completely immobilizes it. The queen
cannot move while pinned under a beetle. This is often the setup for a kill
sequence: beetle pins queen, ants fill remaining sides.

### The Gate Trap

Position two pieces on either side of the queen's escape route, creating a
"gate" that prevents the queen from sliding out. The queen is now effectively
trapped even without being fully surrounded.

### Self-Surround Exploitation

The opponent's own pieces count toward surrounding their queen. If the opponent
places pieces carelessly around their queen, those pieces help you win. The AI
should recognize and exploit when the opponent has 2+ of their own pieces
adjacent to their queen.

---

## Difficulty Levels

### Easy
- Uses opening book loosely (50% random noise)
- Picks from top 50% of scored moves randomly
- Makes frequent sub-optimal moves
- Intended for: learning the game

### Medium
- Follows opening book
- Uses heuristic scoring with small noise
- Picks from top 3 moves
- Intended for: casual play

### Hard
- Opening book + heuristic scoring + 1-ply simulation
- Evaluates board state after each candidate move
- Picks from top 2 moves (slight variance)
- Intended for: experienced players

### Impossible
- All of the above + 2-ply analysis
- Simulates own move, then evaluates opponent's best counter
- Always picks the single best move (no randomness)
- Intended for: competitive challenge

---

## Evaluation Function Weights

| Factor | Weight | Notes |
|--------|--------|-------|
| Opponent queen surround (per side) | +30 | Primary offensive metric |
| Own queen surround (per side) | -35 | Slightly higher than offense (defense first) |
| Opponent queen 5 sides | +120 | One move from winning |
| Own queen 5 sides | -140 | Critical danger |
| Win (6 sides) | +10000 | Absolute |
| Loss (6 sides) | -10000 | Absolute |
| Queen mobility (per escape route) | +6 | More options = safer |
| Opponent pinned pieces (per piece) | +5 | Pinned pieces can't attack/defend |
| Mobile ants (per ant) | +10 | Key offensive resource |
| Opponent mobile ants (per ant) | -8 | Threatening |
| Beetle on opponent queen | +40 | Devastating pin |
| Beetle adjacent to opponent queen | +18 | Major threat |
| Ant within 2 of opponent queen | +10 | Immediate pressure |
| Opponent self-surround (per piece) | +8 | Exploit their mistakes |

---

## Future Improvements

1. **Move delta scoring**: Score based on board state change, not absolute position
2. **Oscillation prevention**: Track and penalize repeated positions
3. **Placement urgency**: Stronger incentive to deploy pieces from hand
4. **Move-away penalty**: Heavily penalize leaving opponent-queen-adjacent hexes
5. **Deeper search**: 3+ ply minimax with alpha-beta pruning for impossible
6. **Pattern recognition**: Detect common winning/losing configurations
7. **Endgame solver**: When few pieces remain, search to completion
