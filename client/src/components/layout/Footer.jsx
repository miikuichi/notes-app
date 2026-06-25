import React from 'react';
import { useNotes } from '../../hooks/useNotes';

function Footer() {
  const { notes } = useNotes();
  const localCount = notes.filter((n) => n.syncStatus === 'local').length;

  return (
    <footer className="app-footer">
      <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      <span className="footer-sync">
        {localCount > 0
          ? `${localCount} unsync'd — blockchain ready`
          : 'All notes stored locally'}
      </span>
    </footer>
  );
}

export default Footer;
