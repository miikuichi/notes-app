import React from 'react';
import { SORT_OPTIONS } from '../../utils/constants';

const FILTERS = [
  { value: SORT_OPTIONS.UPDATED_DESC, label: 'Recent' },
  { value: SORT_OPTIONS.CREATED_DESC, label: 'Created' },
  { value: SORT_OPTIONS.TITLE_ASC,    label: 'A → Z' },
  { value: SORT_OPTIONS.UPDATED_ASC,  label: 'Oldest' },
];

function NoteFilter({ sortOption, onSortChange }) {
  return (
    <div className="note-filter">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn${sortOption === f.value ? ' active' : ''}`}
          onClick={() => onSortChange(f.value)}
          aria-pressed={sortOption === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default NoteFilter;
