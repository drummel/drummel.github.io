// Hex grid using axial coordinates (q, r)
// Flat-top hexagons

const HexGrid = (() => {
  // Six directions for flat-top hex neighbors
  const DIRECTIONS = [
    { q: 1, r: 0 },   // E
    { q: 1, r: -1 },  // NE
    { q: 0, r: -1 },  // NW
    { q: -1, r: 0 },  // W
    { q: -1, r: 1 },  // SW
    { q: 0, r: 1 },   // SE
  ];

  function key(q, r) {
    return `${q},${r}`;
  }

  function parse(k) {
    const [q, r] = k.split(',').map(Number);
    return { q, r };
  }

  function neighbors(q, r) {
    return DIRECTIONS.map(d => ({ q: q + d.q, r: r + d.r }));
  }

  // Get the two hexes that are neighbors of both (q1,r1) and (q2,r2)
  function sharedNeighbors(q1, r1, q2, r2) {
    const n1 = neighbors(q1, r1);
    const n2 = neighbors(q2, r2);
    const shared = [];
    for (const a of n1) {
      for (const b of n2) {
        if (a.q === b.q && a.r === b.r &&
            !(a.q === q1 && a.r === r1) &&
            !(a.q === q2 && a.r === r2)) {
          shared.push(a);
        }
      }
    }
    return shared;
  }

  // Convert axial hex to pixel (flat-top)
  function hexToPixel(q, r, size) {
    const x = size * (3 / 2 * q);
    const y = size * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
    return { x, y };
  }

  // Convert pixel to axial hex (flat-top)
  function pixelToHex(px, py, size) {
    const q = (2 / 3 * px) / size;
    const r = (-1 / 3 * px + Math.sqrt(3) / 3 * py) / size;
    return hexRound(q, r);
  }

  function hexRound(qf, rf) {
    const sf = -qf - rf;
    let q = Math.round(qf);
    let r = Math.round(rf);
    let s = Math.round(sf);
    const qDiff = Math.abs(q - qf);
    const rDiff = Math.abs(r - rf);
    const sDiff = Math.abs(s - sf);
    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s;
    } else if (rDiff > sDiff) {
      r = -q - s;
    }
    return { q, r };
  }

  // Get hex corner points for drawing
  function hexCorners(cx, cy, size) {
    const corners = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 180 * (60 * i);
      corners.push({
        x: cx + size * Math.cos(angle),
        y: cy + size * Math.sin(angle),
      });
    }
    return corners;
  }

  // Check if removing a piece at (q,r) would disconnect the hive
  function isArticulationPoint(q, r, pieces) {
    const k = key(q, r);
    const occupied = new Set();
    for (const [pk] of pieces) {
      if (pk !== k) occupied.add(pk);
    }
    if (occupied.size === 0) return false;

    const start = occupied.values().next().value;
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
      const curr = queue.shift();
      const { q: cq, r: cr } = parse(curr);
      for (const n of neighbors(cq, cr)) {
        const nk = key(n.q, n.r);
        if (occupied.has(nk) && !visited.has(nk)) {
          visited.add(nk);
          queue.push(nk);
        }
      }
    }
    return visited.size !== occupied.size;
  }

  // Freedom of movement: can a piece slide from (q1,r1) to adjacent (q2,r2)?
  // The two shared neighbors form the "gate". For a valid slide:
  // - At least one shared neighbor must be occupied (something to slide along)
  // - Not both can be occupied (gate is physically blocked)
  function canSlide(q1, r1, q2, r2, occupied) {
    const shared = sharedNeighbors(q1, r1, q2, r2);
    if (shared.length === 2) {
      const s0 = occupied.has(key(shared[0].q, shared[0].r));
      const s1 = occupied.has(key(shared[1].q, shared[1].r));
      return (s0 || s1) && !(s0 && s1);
    }
    return true;
  }

  // Get positions adjacent to the hive (empty cells next to at least one piece)
  function getAdjacentEmpty(pieces) {
    const empty = new Set();
    for (const [k] of pieces) {
      const { q, r } = parse(k);
      for (const n of neighbors(q, r)) {
        const nk = key(n.q, n.r);
        if (!pieces.has(nk)) {
          empty.add(nk);
        }
      }
    }
    return empty;
  }

  return {
    DIRECTIONS,
    key,
    parse,
    neighbors,
    sharedNeighbors,
    hexToPixel,
    pixelToHex,
    hexCorners,
    isArticulationPoint,
    canSlide,
    getAdjacentEmpty,
  };
})();
