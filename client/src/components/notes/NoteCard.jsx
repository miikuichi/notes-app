import React, { useState, useRef, useEffect } from 'react';
import { Pin, Trash2, FolderInput } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { formatDate, stripHtml, truncate } from '../../utils/helpers';
import ConfirmModal from '../common/ConfirmModal';

function NoteCard({ note, isSelected }) {
  const { selectNote, togglePin, deleteNote, updateNote, folders } = useNotes();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const moveRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!moveOpen) return;
    function handleClickOutside(e) {
      if (moveRef.current && !moveRef.current.contains(e.target)) {
        setMoveOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moveOpen]);

  function handlePin(e) {
    e.stopPropagation();
    togglePin(note.id);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setConfirmOpen(true);
  }

  function handleMoveClick(e) {
    e.stopPropagation();
    setMoveOpen((v) => !v);
  }

  function handleMoveTo(folderId, e) {
    e.stopPropagation();
    updateNote(note.id, { folderId: folderId || null });
    setMoveOpen(false);
  }

  const preview = truncate(stripHtml(note.content), 100);
  // Folders available to move to (exclude "all" virtual folder and current folder)
  const movableFolders = folders.filter((f) => f.id !== 'all');

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

            {/* Move to folder */}
            <div className="move-folder-wrap" ref={moveRef}>
              <button
                className={`icon-btn-sm${moveOpen ? ' active' : ''}`}
                onClick={handleMoveClick}
                title="Move to folder"
                aria-label="Move to folder"
              >
                <FolderInput size={13} strokeWidth={2} />
              </button>

              {moveOpen && (
                <div className="move-folder-popover" onClick={(e) => e.stopPropagation()}>
                  <p className="move-folder-label">Move to</p>
                  <button
                    className={`move-folder-option${!note.folderId ? ' current' : ''}`}
                    onClick={(e) => handleMoveTo(null, e)}
                  >
                    <span className="move-folder-dot" style={{ background: '#9e8e7a' }} />
                    No Folder
                    {!note.folderId && <span className="move-folder-check">✓</span>}
                  </button>
                  {movableFolders.map((f) => (
                    <button
                      key={f.id}
                      className={`move-folder-option${note.folderId === f.id ? ' current' : ''}`}
                      onClick={(e) => handleMoveTo(f.id, e)}
                    >
                      <span className="move-folder-dot" style={{ background: f.color }} />
                      {f.name}
                      {note.folderId === f.id && <span className="move-folder-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
