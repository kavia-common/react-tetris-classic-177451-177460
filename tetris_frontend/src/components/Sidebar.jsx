import React from 'react';
import { TETROMINOES } from '../utils/tetrominoes';

// Render a tetromino mini preview in a 4x4 grid
function MiniPiece({ pieceKey }) {
  if (!pieceKey) {
    return <div className="mini-grid" style={{ height: 88 }} aria-label="Empty slot" />;
  }
  const shape = TETROMINOES[pieceKey].shape[0];
  const rows = 4;
  const cols = 4;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

  // center shape in 4x4
  const offsetR = Math.floor((rows - shape.length) / 2);
  const offsetC = Math.floor((cols - shape[0].length) / 2);

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) grid[offsetR + r][offsetC + c] = pieceKey;
    }
  }

  return (
    <div className="mini-grid" role="grid" aria-label={`Preview ${pieceKey}`}>
      {grid.map((row, rIdx) =>
        row.map((val, cIdx) => (
          <div key={`${rIdx}-${cIdx}`} className={`cell ${val || ''}`} />
        ))
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Sidebar containing stats, next pieces, and hold piece.
 */
export default function Sidebar({ score, level, lines, nextPieces, holdPieceKey }) {
  return (
    <div className="sidebar">
      <div className="panel">
        <h3>Stats</h3>
        <div className="stats">
          <div className="stat">
            <label>Score</label>
            <div className="val">{score}</div>
          </div>
          <div className="stat">
            <label>Level</label>
            <div className="val">{level}</div>
          </div>
          <div className="stat">
            <label>Lines</label>
            <div className="val">{lines}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Next</h3>
        {nextPieces.map((k, i) => (
          <MiniPiece key={`${k}-${i}`} pieceKey={k} />
        ))}
      </div>

      <div className="panel">
        <h3>Hold</h3>
        <MiniPiece pieceKey={holdPieceKey} />
      </div>
    </div>
  );
}
