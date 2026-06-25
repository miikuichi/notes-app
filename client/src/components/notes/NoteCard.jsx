import React from 'react';
import { useNotes } from '../../hooks/useNotes';
import { formatDate, stripHtml, truncate } from '../../utils/helpers';

/**
 * Single note card displayed in the NoteList panel.
 * Handles selection, pin toggle, and delete.
 */
function NoteCard({ note, isSelected }) {
  const { selectNote, togglePin, deleteNote } = useNotes();

  function handlePin(e) {
    e.stopPropagation();
    togglePin(note.id);
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm('Delete this note?')) deleteNote(note.id);
  }

  const preview = truncate(stripHtml(note.content), 100);

  return (
    <div
      className={[
        'note-card',
        isSelected ? 'selected' : '',
        note.isPinned ? 'pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => selectNote(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && selectNote(note)}
      aria-selected={isSelected}
      aria-label={note.title}
    >
      <div className="note-card-header">
        <span className="note-card-title">{note.title || 'Untitled Note'}</span>
        <div className="note-card-actions">
          <button
            className={`icon-btn-sm${note.isPinned ? ' active' : ''}`}
            onClick={handlePin}
            title={note.isPinned ? 'Unpin' : 'Pin'}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            📌
          </button>
          <button
            className="icon-btn-sm danger"
            onClick={handleDelete}
            title="Delete note"
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="note-card-preview">{preview || 'No content'}</p>
      <span className="note-card-date">{formatDate(note.updatedAt)}</span>

      {note.syncStatus === 'local' && (
        <span className="sync-dot" title="Stored locally — blockchain sync pending" aria-label="Local" />
      )}
    </div>
  );
}

export default NoteCard;
