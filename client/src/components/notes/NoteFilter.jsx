import React from 'react';
import { SORT_OPTIONS } from '../../utils/constants';

/** Dropdown for selecting the active sort order. */
function NoteFilter({ sortOption, onSortChange }) {
  return (
    <div className="note-filter">
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
        aria-label="Sort notes by"
      >
        <option value={SORT_OPTIONS.UPDATED_DESC}>Last Modified ↓</option>
        <option value={SORT_OPTIONS.UPDATED_ASC}>Last Modified ↑</option>
        <option value={SORT_OPTIONS.CREATED_DESC}>Date Created ↓</option>
        <option value={SORT_OPTIONS.TITLE_ASC}>Title A → Z</option>
      </select>
    </div>
  );
}

export default NoteFilter;
