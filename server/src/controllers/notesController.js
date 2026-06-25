const NotesService = require('../services/notesService');
const { validateNote, validateFolder } = require('../middleware/validator');

const NotesController = {
  // ─── Notes ──────────────────────────────────────────────────────────────────
  async getAllNotes(req, res, next) {
    try {
      const { folder, search } = req.query;
      let notes;
      if (search) {
        notes = await NotesService.searchNotes(search);
      } else if (folder) {
        notes = await NotesService.getNotesByFolder(folder);
      } else {
        notes = await NotesService.getAllNotes();
      }
      res.json({ success: true, data: notes, count: notes.length });
    } catch (err) {
      next(err);
    }
  },

  async getNoteById(req, res, next) {
    try {
      const note = await NotesService.getNoteById(req.params.id);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  async createNote(req, res, next) {
    try {
      const error = validateNote(req.body);
      if (error) return res.status(400).json({ success: false, message: error });
      const note = await NotesService.createNote(req.body);
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  async updateNote(req, res, next) {
    try {
      const note = await NotesService.updateNote(req.params.id, req.body);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  async deleteNote(req, res, next) {
    try {
      const deleted = await NotesService.deleteNote(req.params.id);
      if (!deleted)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, message: 'Note deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async togglePin(req, res, next) {
    try {
      const note = await NotesService.togglePin(req.params.id);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  // ─── Folders ────────────────────────────────────────────────────────────────
  async getAllFolders(req, res, next) {
    try {
      const folders = await NotesService.getAllFolders();
      res.json({ success: true, data: folders });
    } catch (err) {
      next(err);
    }
  },

  async createFolder(req, res, next) {
    try {
      const error = validateFolder(req.body);
      if (error) return res.status(400).json({ success: false, message: error });
      const folder = await NotesService.createFolder(req.body);
      res.status(201).json({ success: true, data: folder });
    } catch (err) {
      next(err);
    }
  },

  async updateFolder(req, res, next) {
    try {
      const folder = await NotesService.updateFolder(req.params.id, req.body);
      if (!folder)
        return res
          .status(404)
          .json({ success: false, message: 'Folder not found or is a default folder' });
      res.json({ success: true, data: folder });
    } catch (err) {
      next(err);
    }
  },

  async deleteFolder(req, res, next) {
    try {
      const deleted = await NotesService.deleteFolder(req.params.id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: 'Folder not found or is a default folder' });
      res.json({ success: true, message: 'Folder deleted. Orphaned notes moved to root.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = NotesController;

