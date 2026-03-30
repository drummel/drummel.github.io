# Bug Chess AI Strategy Document

## Overview

This document describes the AI strategy system for Bug Chess, a Hive-inspired
hex strategy game. It covers the architecture, strategic principles, evaluation
function, search engine, and difficulty level design.

---

## Architecture

The AI is split into four files for maintainability and testability:

| File | Purpose |
|------|---------|
| `ai-eval.js` | Evaluation function, game-phase detection, board analysis helpers |
| `ai-zobrist.js` | Zobrist hashing, transposition table for caching positions |
| `ai-search.js` | Negamax with alpha-beta pruning, iterative deepening, move ordering, killer moves |
| `ai.js` | Orchestrator: difficulty configs, oscillation detection, action selection |

### Dependency Chain

```
HexGrid, Pieces, GameState  (game engine)
         ↓
      ai-eval.js            (evaluation)
         ↓
     ai-zobrist.js          (position hashing)
         ↓
     ai-search.js           (search engine)
         ↓
       ai.js                (orchestrator)
```

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

## Search Engine (`ai-search.js`)

### Algorithm: Negamax with Alpha-Beta Pruning

The AI uses negamax (a simplified minimax formulation) with alpha-beta pruning
to search the game tree. This is the same fundamental approach used by chess
engines and proven Hive engines like Mzinga and shaw3257/hive.

**Key properties:**
- Negamax negates scores at each level (my gain = opponent's loss)
- Alpha-beta prunes branches that cannot affect the outcome
- With good move ordering, effective branching factor drops from ~60 to ~15-20

### Iterative Deepening

Rather than searching to a fixed depth, the engine uses iterative deepening:
1. Search depth 1, store best move
2. Search depth 2 using depth-1 results for move ordering
3. Continue until time budget expires
4. Return the best result from the deepest completed search

**Benefits:**
- Always has a move ready (anytime algorithm)
- Previous iterations improve move ordering for subsequent ones
- Natural time management

### Move Ordering

Good move ordering is critical for alpha-beta efficiency. Moves are ordered by:

1. **Transposition table best move** (+10000 priority) — the best move from a
   previous search of this position
2. **Killer moves** (+5000) — moves that caused beta cutoffs at this depth
3. **Heuristic score** — the same strategic scoring used in the original AI

### Transposition Table (`ai-zobrist.js`)

Positions are hashed using Zobrist hashing (XOR of random numbers for each
piece-position combination). The transposition table stores:
- Hash key, search depth, score, flag (exact/upper/lower bound), best move
- 64K entry capacity with depth-priority replacement
- Cleared between searches at Hard/Impossible levels

### Quiescence Search

At the leaf nodes of the search tree, if the position is "volatile" (either
queen has 4+ sides surrounded), the search extends by 1-2 additional ply.
This prevents the horizon effect where the AI stops searching just before
a critical capture/surround sequence.

---

## Evaluation Function (`ai-eval.js`)

### Game Phase Detection

The evaluation adjusts weights based on the game phase:

| Phase | Condition | Weight Emphasis |
|-------|-----------|-----------------|
| Opening | Player turns < 4 | Deployment +50%, Queen surround -20% |
| Midgame | Default | Balanced |
| Endgame | Any queen 3+ surrounded, or few pieces in hand | Surround +50%, Safety +50%, Mobility -30% |

### Evaluation Components

| Factor | Base Weight | Notes |
|--------|-------------|-------|
| Opponent queen surround (per side) | +30 | Primary offensive metric |
| Own queen surround (per side) | -35 | Slightly higher than offense (defense first) |
| Opponent queen 5 sides | +120 | One move from winning |
| Own queen 5 sides | -140 | Critical danger |
| Win (6 sides) | +10000 | Absolute |
| Loss (6 sides) | -10000 | Absolute |
| Queen mobility (per escape route) | +6 | More options = safer |
| Queen gated sides | -5 / +5 | Gated empty hexes are traps |
| Opponent pinned pieces (per piece) | +5 | Pinned pieces can't attack/defend |
| Mobile ants (per ant) | +10 | Key offensive resource |
| Opponent mobile ants (per ant) | -8 | Threatening |
| Mobile beetles | +6 | Secondary offensive resource |
| Beetle on opponent queen | +40 | Devastating pin |
| Beetle adjacent to opponent queen | +18 | Major threat |
| Ant within 2 of opponent queen | +10 | Immediate pressure |
| Ladybug within 2 of opponent queen | +8 | Interior hex threat |
| Mosquito near beetle near queen | +12 | Can copy beetle to climb queen |
| Opponent self-surround (per piece) | +8 | Exploit their mistakes |
| Opponent threats near own queen | -8 to -15 | Ant/beetle proximity danger |
| Pieces in hand (own) | -2 each | Undeployed = wasted potential |
| Pieces in hand (opponent) | +1.5 each | Their wasted potential |

### Simple Evaluation

Easy difficulty uses a simplified evaluation with only 3 components:
queen surround differential, pin differential. This is fast but strategically
weak, which is appropriate for the easiest level.

---

## Difficulty Levels

### Design Philosophy

Research (Kampert 2023, Nasar 2022) consistently shows that **search depth**
is the most effective difficulty differentiator. The current system uses depth
as the primary knob, with evaluation complexity and noise as secondary levers.

### Easy — "Learning Opponent"

| Parameter | Value |
|-----------|-------|
| Algorithm | Heuristic scoring only (no tree search) |
| Search depth | 0 |
| Noise | Gaussian-approximated, σ ≈ 40 |
| Selection | Random from top 50% |
| Evaluation | Simple (3 components) |
| Transposition table | No |

Makes frequent sub-optimal moves but follows basic strategic principles
(place queen early, don't waste ants as first piece). Suitable for
learning the game.

### Medium — "Club Player"

| Parameter | Value |
|-----------|-------|
| Algorithm | Negamax alpha-beta |
| Search depth | 2 ply |
| Noise | σ ≈ 8 |
| Selection | Top 3, random |
| Evaluation | Full (phase-aware) |
| Transposition table | No |
| Time budget | 800ms |

Plays competently, catches 2-move tactics. Some unpredictability from
noise prevents feeling robotic. Suitable for casual play.

### Hard — "Tournament Player"

| Parameter | Value |
|-----------|-------|
| Algorithm | Negamax alpha-beta + iterative deepening |
| Search depth | 3-4 ply |
| Noise | None |
| Selection | Best move (deterministic) |
| Evaluation | Full (phase-aware) |
| Transposition table | Yes (64K entries) |
| Quiescence | 1 ply |
| Time budget | 2 seconds |

Plays strong tactical game with multi-move lookahead. Finds combinations
that require seeing 3-4 moves ahead. Suitable for experienced players.

### Impossible — "Engine Level"

| Parameter | Value |
|-----------|-------|
| Algorithm | Negamax alpha-beta + iterative deepening |
| Search depth | 4-6 ply |
| Noise | None |
| Selection | Best move (deterministic) |
| Evaluation | Full (phase-aware) |
| Transposition table | Yes (64K entries) |
| Quiescence | 2 ply |
| Time budget | 3.5 seconds |

Near-optimal play. Deep tactical analysis, quiescence search prevents
horizon-effect blunders, and full positional understanding. Suitable for
competitive challenge.

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
recognizes and exploits when the opponent has 2+ of their own pieces
adjacent to their queen.

---

## Oscillation Detection

The AI maintains a `moveHistory` buffer of the last 10 actions. Before selecting
a move, it checks if the move reverses any recent move (same piece, swapped
from/to coordinates). Oscillating moves receive a -50 penalty or are replaced
with the next best alternative from search results.

---

## Research References

The AI design draws from these published Hive AI research works:

- **Kampert, "Better AI for Hive" (Leiden University, IEEE)** — Alpha-beta
  with iterative deepening + transposition tables. Branching factor ~60.
- **Nasar, "Hive AI" (University of Leeds)** — 15 heuristics with genetic
  algorithm tuned weights. Queen weighted 2x other factors.
- **"Strategies in Hive" (KTH Royal Institute of Technology)** — Tempo
  concepts, pinning strategies, piece valuations.
- **"A Monte Carlo Strategy for Hive" (Leiden University)** — MCTS comparison,
  circling and beetle-drop tactics.
- **Mzinga (Jon Thysell)** — ~90 evaluation metrics, evolutionary weight
  training, Universal Hive Protocol.
- **HiveMind (cmelchior)** — 22K+ game analysis, negamax with alpha-beta,
  iterative deepening, killer heuristic, transposition tables.
- **shaw3257/hive** — Proves minimax with alpha-beta works in client-side
  JavaScript via Web Workers.

---

## Future Improvements

1. **Web Worker**: Move search to a separate thread to avoid UI blocking
2. **Opening book database**: Pre-computed strong openings from game analysis
3. **Evolutionary weight tuning**: Population of AIs playing each other
4. **Pattern recognition**: Detect known winning/losing configurations
5. **Endgame solver**: When few pieces remain, search to completion
6. **Null move pruning**: Skip a turn to quickly identify strong positions
