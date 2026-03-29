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

## Known AI Flaws (Current Implementation)

### Flaw 1: Ant Shuffling (Critical)

**Problem**: The AI moves an ant from one hex adjacent to the opponent's queen
to another hex adjacent to the queen. This scores highly because "adjacent to
queen = +20" but accomplishes nothing — the surround count doesn't change.

**Root cause**: The scoring function evaluates the **absolute position** of the
destination, not the **net change** in board state. Moving from adjacent→adjacent
scores the same as moving from far→adjacent.

**Fix**: Score moves based on the **delta** in opponent queen surround count
and board evaluation, not absolute destination quality. An ant moving between
two queen-adjacent hexes should score ~0, not +20.

### Flaw 2: Helping the Opponent (Critical)

**Problem**: The AI sometimes moves a piece away from the opponent's queen,
reducing their surround count. This happens because the scoring doesn't check
whether the origin hex was contributing to a surround.

**Root cause**: The scoring only looks at where the piece is GOING, not what
it's LEAVING. If a piece was adjacent to the opponent's queen and moves away,
the opponent's surround count drops by 1 — a huge gift.

**Fix**: Before scoring a move, check if the origin hex is adjacent to the
opponent's queen. If so, apply a heavy penalty for leaving unless the
destination hex is ALSO adjacent (maintaining surround) or the move is winning.

### Flaw 3: Under-valuing Placement (Moderate)

**Problem**: The AI prefers moving existing pieces over placing new ones from
hand, even when placement would be objectively stronger.

**Root cause**: Movement actions toward the opponent's queen score +20-30,
which often exceeds placement scores. The AI doesn't account for the
opportunity cost of not deploying pieces.

**Fix**: Add a bonus for placement actions when pieces remain in hand.
Especially ants and beetles after the queen is placed — these should get a
strong "deploy now" bonus.

### Flaw 4: No Oscillation Detection (Moderate)

**Problem**: The AI can get stuck moving the same piece back and forth between
two hexes indefinitely.

**Fix**: Track the last N moves and penalize any move that returns a piece to
a position it was at 1-2 turns ago.

### Flaw 5: Simulation Doesn't Compare Before/After (Minor)

**Problem**: The `simulateAction` function evaluates the board AFTER the move
but doesn't compare it to the board BEFORE. This means moves that don't change
the evaluation score the same as transformative moves.

**Fix**: Compute `evaluateBoard(after) - evaluateBoard(before)` to get the
true delta.

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
