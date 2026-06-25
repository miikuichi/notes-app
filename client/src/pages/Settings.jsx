import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useNotes } from '../hooks/useNotes';
import Button from '../components/common/Button';
import storageService from '../services/storage';
import { EXPORT_FORMATS } from '../utils/constants';

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { notes } = useNotes();

  function handleExportAll() {
    const payload = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      count: notes.length,
      notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearStorage() {
    if (window.confirm('This will permanently delete ALL notes and folders. Continue?')) {
      storageService.clear();
      window.location.reload();
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
        <h1>Settings</h1>
      </div>

      {/* ── Appearance ── */}
      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-row">
          <div>
            <strong>Theme</strong>
            <p className="settings-desc">Currently using {theme} mode.</p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </section>

      {/* ── Data & Export ── */}
      <section className="settings-section">
        <h2>Data &amp; Export</h2>
        <div className="settings-row">
          <div>
            <strong>Export all notes</strong>
            <p className="settings-desc">
              Downloads a JSON backup of all {notes.length} note{notes.length !== 1 ? 's' : ''}.
              This format is also the migration payload for the future blockchain layer.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExportAll}>
            Export JSON
          </Button>
        </div>
        <div className="settings-row">
          <div>
            <strong>Blockchain / Web5 Sync</strong>
            <p className="settings-desc">
              Integration is prepared and will be enabled in a future update.
            </p>
          </div>
          <span className="status-badge local">Local Only</span>
        </div>
      </section>

      {/* ── Danger zone ── */}
      <section className="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <div className="settings-row">
          <div>
            <strong>Clear all data</strong>
            <p className="settings-desc">Permanently deletes all notes and folders from local storage.</p>
          </div>
          <Button variant="danger" onClick={handleClearStorage}>
            Clear Storage
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
