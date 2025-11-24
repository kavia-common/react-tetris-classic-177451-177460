# React Tetris – Ocean Professional

A browser-based Tetris game built with React. Play at http://localhost:3000. Modern UI with the Ocean Professional theme (blue primary, amber accents), subtle gradients and shadows, responsive layout, and keyboard controls.

## Features

- Playable Tetris with:
  - 10x20 board, falling tetrominoes, rotation, ghost piece
  - Line clearing, scoring, level progression (every 10 lines)
  - Next queue (5) with 7-bag generator
  - Hold piece with swap rules
  - Pause and Reset controls
  - Keyboard controls and on-screen buttons
- Responsive layout:
  - Centered board
  - Sidebar with score/level/lines, next, hold
  - Stacks on mobile, side panels on wide screens
- Themed using Ocean Professional palette: primary #2563EB, secondary #F59E0B

## Run the app

From the tetris_frontend directory:

```
npm install
npm start
```

Open http://localhost:3000.

## Controls

- Left/Right arrows or A/D: Move piece
- Down arrow or S: Soft drop
- Up arrow, W, or X: Rotate
- Space: Hard drop
- Shift or C: Hold/swap
- P: Pause/Resume
- Reset button: Restart game

## Environment variables

The app respects (if provided):

- REACT_APP_NODE_ENV
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Add them to your .env to toggle behavior at runtime. Example:

```
REACT_APP_NODE_ENV=development
REACT_APP_FEATURE_FLAGS=next,hold
REACT_APP_EXPERIMENTS_ENABLED=false
```

## Project structure

- src/Game.jsx – Main game container
- src/hooks/useTetris.js – Game logic: loop, movement, scoring, levels
- src/utils/tetrominoes.js – Shapes, rotations, 7-bag generator
- src/components/Board.jsx, Cell.jsx – Board rendering
- src/components/Sidebar.jsx – Stats, Next, Hold
- src/components/Controls.jsx – Action buttons
- src/tetris.css – Theme and layout styles
- src/App.js – Entry component that renders Game

## Notes

- No external UI libraries; pure React and CSS
- Game loop uses requestAnimationFrame and drops based on level speed
- 7-bag generator ensures fair distribution
