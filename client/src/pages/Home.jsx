import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import NoteList from '../components/notes/NoteList';
import NoteEditor from '../components/notes/NoteEditor';
import Footer from '../components/layout/Footer';
import { useNotes } from '../hooks/useNotes';

function Home() {
  const { selectedNote } = useNotes();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header />

      <div className="app-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
        <NoteList />

        <main className="editor-area">
          {selectedNote ? (
            <NoteEditor />
          ) : (
            <div className="editor-placeholder">
              <span className="placeholder-icon" aria-hidden="true">📝</span>
              <p>Select a note or create a new one</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
