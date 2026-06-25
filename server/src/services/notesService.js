const { NoteModel, FolderModel } = require('../models/noteModel');

const NotesService = {
  // ─── Notes ──────────────────────────────────────────────────────────────────
  getAllNotes() {
    return NoteModel.findAll();
  },

  getNoteById(id) {
    return NoteModel.findById(id);
  },

  getNotesByFolder(folderId) {
    if (folderId === 'all') return NoteModel.findAll();
    return NoteModel.findByFolder(folderId);
  },

  createNote(data) {
    return NoteModel.create(data);
  },

  updateNote(id, data) {
    return NoteModel.update(id, data);
  },

  deleteNote(id) {
    return NoteModel.delete(id);
  },

  togglePin(id) {
    const note = NoteModel.findById(id);
    if (!note) return null;
    return NoteModel.update(id, { isPinned: !note.isPinned });
  },

  searchNotes(query) {
    return NoteModel.search(query);
  },

  // ─── Folders ────────────────────────────────────────────────────────────────
  getAllFolders() {
    return FolderModel.findAll();
  },

  createFolder(data) {
    return FolderModel.create(data);
  },

  updateFolder(id, data) {
    return FolderModel.update(id, data);
  },

  deleteFolder(id) {
    return FolderModel.delete(id);
  },
};

module.exports = NotesService;
