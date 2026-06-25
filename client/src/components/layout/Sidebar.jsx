import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FOLDER_COLORS } from '../../utils/constants';

function Sidebar() {
  const {
    folders,
    notes,
    activeFolder,
    setActiveFolder,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useNotes();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState(FOLDER_COLORS[0]);

  function noteCount(folderId) {
    if (folderId === 'all') return notes.length;
    return notes.filter((n) => n.folderId === folderId).length;
  }

  function openCreate() {
    setEditingFolder(null);
    setFolderName('');
    setFolderColor(FOLDER_COLORS[0]);
    setModalOpen(true);
  }

  function openEdit(folder, e) {
    e.stopPropagation();
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderColor(folder.color || FOLDER_COLORS[0]);
    setModalOpen(true);
  }

  function handleDelete(id, e) {
    e.stopPropagation();
    if (window.confirm('Delete folder? Notes inside will be kept in All Notes.')) {
      deleteFolder(id);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!folderName.trim()) return;
    if (editingFolder) {
      updateFolder(editingFolder.id, { name: folderName.trim(), color: folderColor });
    } else {
      createFolder(folderName.trim(), folderColor);
    }
    setModalOpen(false);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditingFolder(null);
  }

  const userFolders = folders.filter((f) => f.id !== 'all');

  return (
    <aside className="sidebar">
      {/* All Notes */}
      <button
        className={`folder-item${activeFolder === 'all' ? ' active' : ''}`}
        onClick={() => setActiveFolder('all')}
      >
        <span className="folder-icon" aria-hidden="true">📋</span>
        <span className="folder-name">All Notes</span>
        <span className="folder-count">{noteCount('all')}</span>
      </button>

      {/* User-created folders */}
      {userFolders.length > 0 && (
        <div className="sidebar-section">
          <span className="sidebar-label">Folders</span>
          {userFolders.map((folder) => (
            <div key={folder.id} className="folder-row">
              <button
                className={`folder-item${activeFolder === folder.id ? ' active' : ''}`}
                onClick={() => setActiveFolder(folder.id)}
              >
                <span
                  className="folder-dot"
                  style={{ backgroundColor: folder.color }}
                  aria-hidden="true"
                />
                <span className="folder-name">{folder.name}</span>
                <span className="folder-count">{noteCount(folder.id)}</span>
              </button>
              <div className="folder-actions">
                <button
                  className="icon-btn-sm"
                  onClick={(e) => openEdit(folder, e)}
                  title="Rename folder"
                  aria-label={`Rename ${folder.name}`}
                >
                  ✏️
                </button>
                <button
                  className="icon-btn-sm"
                  onClick={(e) => handleDelete(folder.id, e)}
                  title="Delete folder"
                  aria-label={`Delete ${folder.name}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-footer">
        <Button variant="ghost" onClick={openCreate} className="new-folder-btn">
          + New Folder
        </Button>
      </div>

      {/* Create / Rename folder modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingFolder ? 'Rename Folder' : 'New Folder'}
      >
        <form onSubmit={handleSubmit} className="folder-form">
          <div className="form-group">
            <label htmlFor="folder-name-input">Folder Name</label>
            <input
              id="folder-name-input"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="form-input"
              maxLength={100}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Colour</label>
            <div className="color-picker">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch${folderColor === c ? ' selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setFolderColor(c)}
                  aria-label={`Select colour ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={!folderName.trim()}>
              {editingFolder ? 'Save' : 'Create'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </aside>
  );
}

export default Sidebar;
