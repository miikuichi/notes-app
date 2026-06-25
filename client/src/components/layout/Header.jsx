import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import SearchBar from '../common/SearchBar';

/**
 * Top application bar.
 * @param {Function} onSearch  forwarded from the parent page when search is active
 */
function Header({ onSearch }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="brand-icon" aria-hidden="true">📝</span>
        <span className="brand-title">Notes</span>
      </div>

      <div className="header-search">
        {onSearch && <SearchBar onSearch={onSearch} />}
      </div>

      <div className="header-actions">
        <ThemeToggle />
        <button
          className="icon-btn"
          onClick={() => navigate('/settings')}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}

export default Header;
