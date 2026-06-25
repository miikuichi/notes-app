const NotesService = require('../services/notesService');
const { validateNote, validateFolder } = require('../middleware/validator');

const NotesController = {
  // ─── Notes ──────────────────────────────────────────────────────────────────
  getAllNotes(req, res, next) {
    try {
      const { folder, search } = req.query;
      let notes;
      if (search) {
        notes = NotesService.searchNotes(search);
      } else if (folder) {
        notes = NotesService.getNotesByFolder(folder);
      } else {
        notes = NotesService.getAllNotes();
      }
      res.json({ success: true, data: notes, count: notes.length });
    } catch (err) {
      next(err);
    }
  },

  getNoteById(req, res, next) {
    try {
      const note = NotesService.getNoteById(req.params.id);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  createNote(req, res, next) {
    try {
      const error = validateNote(req.body);
      if (error) return res.status(400).json({ success: false, message: error });
      const note = NotesService.createNote(req.body);
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  updateNote(req, res, next) {
    try {
      const note = NotesService.updateNote(req.params.id, req.body);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  deleteNote(req, res, next) {
    try {
      const deleted = NotesService.deleteNote(req.params.id);
      if (!deleted)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, message: 'Note deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  togglePin(req, res, next) {
    try {
      const note = NotesService.togglePin(req.params.id);
      if (!note)
        return res.status(404).json({ success: false, message: 'Note not found' });
      res.json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  // ─── Folders ────────────────────────────────────────────────────────────────
  getAllFolders(req, res, next) {
    try {
      const folders = NotesService.getAllFolders();
      res.json({ success: true, data: folders });
    } catch (err) {
      next(err);
    }
  },

  createFolder(req, res, next) {
    try {
      const error = validateFolder(req.body);
      if (error) return res.status(400).json({ success: false, message: error });
      const folder = NotesService.createFolder(req.body);
      res.status(201).json({ success: true, data: folder });
    } catch (err) {
      next(err);
    }
  },

  updateFolder(req, res, next) {
    try {
      const folder = NotesService.updateFolder(req.params.id, req.body);
      if (!folder)
        return res
          .status(404)
          .json({ success: false, message: 'Folder not found or is a default folder' });
      res.json({ success: true, data: folder });
    } catch (err) {
      next(err);
    }
  },

  deleteFolder(req, res, next) {
    try {
      const deleted = NotesService.deleteFolder(req.params.id);
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
