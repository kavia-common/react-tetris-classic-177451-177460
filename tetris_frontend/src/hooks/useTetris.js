import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TETROMINOES, create7BagGenerator, rotateMatrixClockwise } from '../utils/tetrominoes';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Scoring per Tetris guideline (simplified)
const SCORE_TABLE = {
  0: 0,
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

// gravity speed per level (ms per drop)
const LEVEL_SPEEDS = [
  1000, 900, 800, 700, 600, 500, 450, 400, 350, 300,
  260, 220, 200, 180, 160, 140, 120, 100, 85, 75
];

// PUBLIC_INTERFACE
export function useTetris() {
  /**
   * Hook encapsulating the full Tetris game logic.
   * Returns render board, stats, controls, and UI helpers.
   */
  const [board, setBoard] = useState(createEmptyBoard());
  const [current, setCurrent] = useState(null); // { key, shape, x, y, rotation }
  const [nextQueue, setNextQueue] = useState([]);
  const [hold, setHold] = useState(null);
  const [canHold, setCanHold] = useState(true);

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generatorRef = useRef(create7BagGenerator());
  const dropTimerRef = useRef(null);
  const lastTickRef = useRef(performance.now());

  const speed = LEVEL_SPEEDS[Math.min(level, LEVEL_SPEEDS.length - 1)];

  // Create an empty board
  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
  }

  const refillQueue = useCallback((queue) => {
    const next = [...queue];
    while (next.length < 5) {
      next.push(generatorRef.current());
    }
    return next;
  }, []);

  const spawnPiece = useCallback((overrideKey = null) => {
    setBoard(prev => prev); // keep reference for consistency
    setCanHold(true);
    setNextQueue(prev => {
      const queue = prev.length ? prev : refillQueue([]);
      const key = overrideKey ?? queue[0];
      const tetro = TETROMINOES[key];
      const shape = tetro.shape[0];
      const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
      const y = -getTopPadding(shape); // allow spawn with hidden rows
      setCurrent({ key, rotation: 0, shape, x, y });
      const sliced = overrideKey ? queue : queue.slice(1);
      return refillQueue(sliced);
    });
  }, [refillQueue]);

  // Calculates empty rows at top of the shape
  function getTopPadding(shape) {
    let topPad = 0;
    for (let r = 0; r < shape.length; r++) {
      if (shape[r].some(v => v === 1)) break;
      topPad++;
    }
    return topPad;
  }

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(0);
    setLines(0);
    setHold(null);
    setNextQueue(refillQueue([]));
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    spawnPiece();
  }, [refillQueue, spawnPiece]);

  // PUBLIC_INTERFACE
  const start = useCallback(() => {
    if (!running) {
      resetGame();
    }
  }, [running, resetGame]);

  // PUBLIC_INTERFACE
  const pause = useCallback(() => {
    if (!running || gameOver) return;
    setPaused(p => !p);
  }, [running, gameOver]);

  // PUBLIC_INTERFACE
  const hardDrop = useCallback(() => {
    if (!running || paused || gameOver || !current) return;
    let dy = 0;
    while (!collides(board, current.shape, current.x, current.y + dy + 1)) {
      dy++;
    }
    const landedY = current.y + dy;
    lockPiece(landedY);
  }, [board, current, running, paused, gameOver]);

  // PUBLIC_INTERFACE
  const move = useCallback((dx) => {
    if (!running || paused || gameOver || !current) return;
    const nx = current.x + dx;
    if (!collides(board, current.shape, nx, current.y)) {
      setCurrent({ ...current, x: nx });
    }
  }, [board, current, running, paused, gameOver]);

  // PUBLIC_INTERFACE
  const softDrop = useCallback(() => {
    if (!running || paused || gameOver || !current) return;
    const ny = current.y + 1;
    if (!collides(board, current.shape, current.x, ny)) {
      setCurrent({ ...current, y: ny });
      setScore(s => s + 1); // soft drop score
    } else {
      // lock piece
      lockPiece(current.y);
    }
  }, [board, current, running, paused, gameOver]);

  // PUBLIC_INTERFACE
  const rotate = useCallback(() => {
    if (!running || paused || gameOver || !current) return;
    const rotated = rotateMatrixClockwise(current.shape);
    // basic wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const k of kicks) {
      if (!collides(board, rotated, current.x + k, current.y)) {
        setCurrent({ ...current, shape: rotated, rotation: (current.rotation + 1) % 4, x: current.x + k });
        return;
      }
    }
  }, [board, current, running, paused, gameOver]);

  // PUBLIC_INTERFACE
  const holdPiece = useCallback(() => {
    if (!running || paused || gameOver || !current || !canHold) return;
    setCanHold(false);
    setHold(prevHold => {
      if (prevHold) {
        // swap current with hold
        const swapKey = prevHold;
        spawnPiece(swapKey);
        return current.key;
      } else {
        // move current to hold and spawn next
        const curKey = current.key;
        spawnPiece();
        return curKey;
      }
    });
  }, [running, paused, gameOver, canHold, current, spawnPiece]);

  function collides(boardState, shape, x, y) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (!shape[r][c]) continue;
        const br = y + r;
        const bc = x + c;
        if (bc < 0 || bc >= BOARD_WIDTH || br >= BOARD_HEIGHT) return true;
        if (br >= 0 && boardState[br][bc]) return true;
      }
    }
    return false;
  }

  function mergePiece(boardState, piece, finalY) {
    const b = boardState.map(row => row.slice());
    const { shape, x } = piece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (!shape[r][c]) continue;
        const br = finalY + r;
        const bc = x + c;
        if (br >= 0 && br < BOARD_HEIGHT && bc >= 0 && bc < BOARD_WIDTH) {
          b[br][bc] = piece.key;
        }
      }
    }
    return b;
  }

  function clearLines(boardState) {
    const newBoard = [];
    let cleared = 0;
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      if (boardState[r].every(cell => cell !== null)) {
        cleared++;
      } else {
        newBoard.push(boardState[r]);
      }
    }
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    return { newBoard, cleared };
  }

  const lockPiece = useCallback((finalY) => {
    // If piece is above visible area and collides => game over
    if (finalY < 0) {
      setRunning(false);
      setGameOver(true);
      return;
    }
    setBoard(prev => {
      const merged = mergePiece(prev, current, finalY);
      const { newBoard, cleared } = clearLines(merged);
      if (cleared > 0) {
        setScore(s => s + SCORE_TABLE[cleared] * (level + 1));
        setLines(l => {
          const total = l + cleared;
          // increment level every 10 lines
          if (Math.floor(total / 10) > Math.floor(l / 10)) {
            setLevel(old => old + 1);
          }
          return total;
        });
      }
      return newBoard;
    });
    // spawn next
    spawnPiece();
  }, [current, level, spawnPiece]);

  // Game loop
  useEffect(() => {
    if (!running || paused || gameOver) return;
    let rafId;
    const tick = (now) => {
      if (now - lastTickRef.current >= speed) {
        lastTickRef.current = now;
        softDrop();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [running, paused, gameOver, speed, softDrop]);

  // Ghost piece calculation
  const ghostY = useMemo(() => {
    if (!current) return null;
    let dy = 0;
    while (!collides(board, current.shape, current.x, current.y + dy + 1)) {
      dy++;
    }
    return current.y + dy;
  }, [board, current]);

  // Render board with current and ghost
  const renderBoard = useMemo(() => {
    const b = board.map(row => row.slice());
    if (current) {
      // draw ghost
      if (ghostY !== null) {
        for (let r = 0; r < current.shape.length; r++) {
          for (let c = 0; c < current.shape[0].length; c++) {
            if (!current.shape[r][c]) continue;
            const br = ghostY + r;
            const bc = current.x + c;
            if (br >= 0 && br < BOARD_HEIGHT && bc >= 0 && bc < BOARD_WIDTH) {
              if (!b[br][bc]) b[br][bc] = `ghost-${current.key}`;
            }
          }
        }
      }
      // draw current
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[0].length; c++) {
          if (!current.shape[r][c]) continue;
          const br = current.y + r;
          const bc = current.x + c;
          if (br >= 0 && br < BOARD_HEIGHT && bc >= 0 && bc < BOARD_WIDTH) {
            b[br][bc] = current.key;
          }
        }
      }
    }
    return b;
  }, [board, current, ghostY]);

  const nextPieces = useMemo(() => nextQueue.slice(0, 5), [nextQueue]);

  return {
    board: renderBoard,
    score, level, lines,
    running, paused, gameOver,
    start, pause, reset: resetGame,
    moveLeft: () => move(-1),
    moveRight: () => move(1),
    rotate,
    softDrop,
    hardDrop,
    hold: holdPiece,
    holdPieceKey: hold,
    nextPieces
  };
}
