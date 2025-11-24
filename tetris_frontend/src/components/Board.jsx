import React from 'react';
import Cell from './Cell';

/**
 * PUBLIC_INTERFACE
 * Board renders the main 10x20 game grid.
 */
export default function Board({ board }) {
  return (
    <div className="board">
      <div className="grid" role="grid" aria-label="Tetris Board">
        {board.map((row, rIdx) => (
          row.map((val, cIdx) => (
            <Cell key={`${rIdx}-${cIdx}`} value={val} />
          ))
        ))}
      </div>
    </div>
  );
}
