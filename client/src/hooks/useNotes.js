import { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

/** Convenience hook — throws if used outside <NotesProvider>. */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
}
