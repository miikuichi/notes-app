import React, { useState } from 'react';

/** Controlled search input with an inline clear button. */
function SearchBar({ onSearch, placeholder = 'Search notes…' }) {
  const [value, setValue] = useState('');

  function handleChange(e) {
    setValue(e.target.value);
    onSearch(e.target.value);
  }

  function handleClear() {
    setValue('');
    onSearch('');
  }

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search notes"
      />
      {value && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
