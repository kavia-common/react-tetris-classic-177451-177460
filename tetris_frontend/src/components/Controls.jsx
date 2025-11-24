import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls displays action buttons for Start/Pause/Reset and movement,
 * also serves as accessible controls for mobile users.
 */
export default function Controls({
  running, paused, gameOver,
  onStart, onPause, onReset,
  onLeft, onRight, onRotate, onSoftDrop, onHardDrop, onHold
}) {
  return (
    <div className="controls">
      <div className="control-row">
        {!running && !gameOver && (
          <button className="btn primary" onClick={onStart} aria-label="Start">
            Start
          </button>
        )}
        {running && !gameOver && (
          <button className="btn primary" onClick={onPause} aria-label="Pause">
            {paused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button className="btn warn" onClick={onReset} aria-label="Reset">
          Reset
        </button>
      </div>
      <div className="control-row">
        <button className="btn" onClick={onLeft} aria-label="Left">← Left</button>
        <button className="btn" onClick={onRight} aria-label="Right">Right →</button>
        <button className="btn" onClick={onRotate} aria-label="Rotate">⟳ Rotate</button>
        <button className="btn" onClick={onSoftDrop} aria-label="Soft Drop">Soft ↓</button>
        <button className="btn" onClick={onHardDrop} aria-label="Hard Drop">Hard ⤓</button>
        <button className="btn" onClick={onHold} aria-label="Hold">Hold ⧉</button>
      </div>
      <div className="footer-note">
        Keyboard: Left/Right, Down (soft), Up or X (rotate), Space (hard drop), Shift/C (hold), P (pause)
      </div>
    </div>
  );
}
