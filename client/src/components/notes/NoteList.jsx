import React from 'react';
import { useNotes } from '../../hooks/useNotes';
import { useSearch } from '../../hooks/useSearch';
import NoteCard from './NoteCard';
import NoteFilter from './NoteFilter';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';

/**
 * Middle panel — lists all notes for the active folder,
 * with search, sort, and a "New Note" button.
 */
function NoteList() {
  const { notes, activeFolder, folders, selectedNote, createNote } = useNotes();
  const { setQuery, sortOption, setSortOption, results } = useSearch(notes, activeFolder);

  const folderName =
    activeFolder === 'all'
      ? 'All Notes'
      : folders.find((f) => f.id === activeFolder)?.name ?? 'Notes';

  return (
    <section className="note-list-panel">
      <div className="note-list-header">
        <h2 className="note-list-title">{folderName}</h2>
        <Button
          variant="primary"
          onClick={() => createNote()}
          title="New note"
          className="new-note-btn"
        >
          +
        </Button>
      </div>

      <SearchBar onSearch={setQuery} />
      <NoteFilter sortOption={sortOption} onSortChange={setSortOption} />

      <div className="note-list">
        {results.length === 0 ? (
          <div className="note-list-empty">
            <p>No notes here yet.</p>
            <Button variant="primary" onClick={() => createNote()}>
              Create your first note
            </Button>
          </div>
        ) : (
          results.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={selectedNote?.id === note.id}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default NoteList;
