import React, { useState } from 'react';
import { Pin, Trash2 } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { formatDate, stripHtml, truncate } from '../../utils/helpers';
import ConfirmModal from '../common/ConfirmModal';

/**
 * Single note card displayed in the NoteList panel.
 * Handles selection, pin toggle, and delete (with confirm modal).
 */
function NoteCard({ note, isSelected }) {
  const { selectNote, togglePin, deleteNote } = useNotes();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handlePin(e) {
    e.stopPropagation();
    togglePin(note.id);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setConfirmOpen(true);
  }

  const preview = truncate(stripHtml(note.content), 100);

  return (
    <>
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
              <Pin size={13} strokeWidth={2} />
            </button>
            <button
              className="icon-btn-sm danger"
              onClick={handleDeleteClick}
              title="Delete note"
              aria-label="Delete note"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p className="note-card-preview">{preview || 'No content'}</p>
        <span className="note-card-date">{formatDate(note.updatedAt)}</span>

        {note.syncStatus === 'local' && (
          <span className="sync-dot" title="Stored locally — blockchain sync pending" aria-label="Local" />
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => deleteNote(note.id)}
        title="Delete Note?"
        message={`"${note.title || 'Untitled Note'}" will be permanently deleted.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}

export default NoteCard;
