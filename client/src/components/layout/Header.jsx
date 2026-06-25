import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Settings } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import SearchBar from '../common/SearchBar';

function Header({ onSearch }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-brand">
        <NotebookPen size={22} className="brand-icon" strokeWidth={1.8} />
        <span className="brand-title">Notepad</span>
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
          <Settings size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}

export default Header;
