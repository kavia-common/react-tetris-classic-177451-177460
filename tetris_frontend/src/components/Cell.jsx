import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Cell renders a single board cell with styling by tetromino key or ghost.
 */
export default function Cell({ value }) {
  if (value === null) return <div className="cell" />;
  if (typeof value === 'string' && value.startsWith('ghost-')) {
    return <div className="cell ghost" />;
  }
  return <div className={`cell ${value}`} />;
}
