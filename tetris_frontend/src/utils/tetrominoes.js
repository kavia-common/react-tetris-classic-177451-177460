//
// Tetromino definitions, rotations, colors, and the 7-bag generator
//

// PUBLIC_INTERFACE
export const TETROMINOES = {
  I: {
    shape: [
      [[0,0,0,0],
       [1,1,1,1],
       [0,0,0,0],
       [0,0,0,0]],
      [[0,0,1,0],
       [0,0,1,0],
       [0,0,1,0],
       [0,0,1,0]]
    ],
    color: '#22d3ee' // cyan
  },
  J: {
    shape: [
      [[1,0,0],
       [1,1,1],
       [0,0,0]],
      [[0,1,1],
       [0,1,0],
       [0,1,0]],
      [[0,0,0],
       [1,1,1],
       [0,0,1]],
      [[0,1,0],
       [0,1,0],
       [1,1,0]]
    ],
    color: '#60a5fa' // blue
  },
  L: {
    shape: [
      [[0,0,1],
       [1,1,1],
       [0,0,0]],
      [[0,1,0],
       [0,1,0],
       [0,1,1]],
      [[0,0,0],
       [1,1,1],
       [1,0,0]],
      [[1,1,0],
       [0,1,0],
       [0,1,0]]
    ],
    color: '#f59e0b' // amber
  },
  O: {
    shape: [
      [[1,1],
       [1,1]]
    ],
    color: '#fbbf24' // yellow
  },
  S: {
    shape: [
      [[0,1,1],
       [1,1,0],
       [0,0,0]],
      [[0,1,0],
       [0,1,1],
       [0,0,1]]
    ],
    color: '#34d399' // green
  },
  T: {
    shape: [
      [[0,1,0],
       [1,1,1],
       [0,0,0]],
      [[0,1,0],
       [0,1,1],
       [0,1,0]],
      [[0,0,0],
       [1,1,1],
       [0,1,0]],
      [[0,1,0],
       [1,1,0],
       [0,1,0]]
    ],
    color: '#a78bfa' // purple
  },
  Z: {
    shape: [
      [[1,1,0],
       [0,1,1],
       [0,0,0]],
      [[0,0,1],
       [0,1,1],
       [0,1,0]]
    ],
    color: '#f87171' // red
  }
};

export const TETROMINO_KEYS = Object.keys(TETROMINOES);

// PUBLIC_INTERFACE
export function create7BagGenerator(seed = null) {
  /**
   * Deterministic or pseudo-random 7-bag tetromino generator.
   * If seed is provided, uses a simple LCG for reproducibility.
   */
  let bag = [];
  let rngState = seed ?? Math.floor(Math.random() * 1e9);
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;

  const rand = () => {
    rngState = (a * rngState + c) % m;
    return rngState / m;
  };

  const shuffle = (arr) => {
    // Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor((seed ? rand() : Math.random()) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const refill = () => {
    bag = TETROMINO_KEYS.slice();
    shuffle(bag);
  };

  refill();

  // PUBLIC_INTERFACE
  return function next() {
    if (bag.length === 0) refill();
    return bag.pop();
  };
}

// PUBLIC_INTERFACE
export function rotateMatrixClockwise(matrix) {
  /** Rotate a square/rectangular matrix clockwise */
  const rows = matrix.length;
  const cols = matrix[0].length;
  const res = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return res;
}
