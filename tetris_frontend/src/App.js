import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';

// PUBLIC_INTERFACE
function App() {
  // keep a simple light/dark toggle if desired; default to light
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', background: 'transparent' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <Game />
    </div>
  );
}

export default App;
