import React, { useEffect } from 'react';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import { useTetris } from './hooks/useTetris';
import './tetris.css';

/**
 * PUBLIC_INTERFACE
 * Game is the main app component rendering the Tetris experience with
 * Ocean Professional theme, responsive layout, and keyboard controls.
 */
export default function Game() {
  const {
    board, score, level, lines,
    running, paused, gameOver,
    start, pause, reset,
    moveLeft, moveRight, rotate, softDrop, hardDrop, hold,
    holdPieceKey, nextPieces
  } = useTetris();

  // Respect environment flags (no-op hooks for this frontend, but can later gate features)
  const featureFlags = process.env.REACT_APP_FEATURE_FLAGS;
  const experimentsEnabled = process.env.REACT_APP_EXPERIMENTS_ENABLED;
  const nodeEnv = process.env.REACT_APP_NODE_ENV;

  useEffect(() => {
    // Keyboard controls
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'p') {
        pause();
        return;
      }
      if (paused || !running) return;
      if (['arrowleft', 'a'].includes(key)) {
        e.preventDefault(); moveLeft();
      } else if (['arrowright', 'd'].includes(key)) {
        e.preventDefault(); moveRight();
      } else if (['arrowdown', 's'].includes(key)) {
        e.preventDefault(); softDrop();
      } else if (['arrowup', 'w', 'x'].includes(key)) {
        e.preventDefault(); rotate();
      } else if (key === ' ') {
        e.preventDefault(); hardDrop();
      } else if (key === 'shift' || key === 'c') {
        e.preventDefault(); hold();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [moveLeft, moveRight, rotate, softDrop, hardDrop, hold, running, paused, pause]);

  return (
    <div className="tetris-app" data-env={nodeEnv} data-flags={featureFlags} data-exp={experimentsEnabled}>
      <div className="tetris-card">
        <div className="header">
          <div className="title">Tetris</div>
          <div className="badge">Ocean Professional</div>
        </div>

        <div className="panel">
          <Sidebar
            score={score}
            level={level}
            lines={lines}
            nextPieces={nextPieces}
            holdPieceKey={holdPieceKey}
          />
        </div>

        <div className="board-wrap">
          <Board board={board} />
        </div>

        <div className="panel">
          <Controls
            running={running}
            paused={paused}
            gameOver={gameOver}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onLeft={moveLeft}
            onRight={moveRight}
            onRotate={rotate}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            onHold={hold}
          />
        </div>
      </div>
    </div>
  );
}
