const express = require('express');
const router = express.Router();
const NotesController = require('../controllers/notesController');

// ─── Folder routes (must come before /:id to avoid param collision) ───────────
router.get('/folders/all', NotesController.getAllFolders);
router.post('/folders', NotesController.createFolder);
router.put('/folders/:id', NotesController.updateFolder);
router.delete('/folders/:id', NotesController.deleteFolder);

// ─── Note routes ──────────────────────────────────────────────────────────────
router.get('/', NotesController.getAllNotes);          // GET  /api/notes?folder=&search=
router.post('/', NotesController.createNote);          // POST /api/notes
router.get('/:id', NotesController.getNoteById);       // GET  /api/notes/:id
router.put('/:id', NotesController.updateNote);        // PUT  /api/notes/:id
router.delete('/:id', NotesController.deleteNote);     // DELETE /api/notes/:id
router.patch('/:id/pin', NotesController.togglePin);   // PATCH /api/notes/:id/pin

module.exports = router;
