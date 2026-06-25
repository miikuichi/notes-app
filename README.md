# Notes App

A full-stack Notes application built with **React + Vite** (client) and **Node.js + Express** (server). The data layer is designed as a **blockchain-ready** local-first architecture, making the transition to Web3 / Web5 (DWN) a single-file swap.

---

## Feature Summary

| Feature | Description |
|---|---|
| **CRUD** | Create, read, update, and delete notes |
| **Rich Text Editor** | TipTap-powered editor with Bold, Italic, Underline, Strike, Headings (H1–H3), Bullet & Ordered Lists, Blockquote, Inline Code, Code Block, Text Align, Highlight |
| **Folders** | iOS-style folder sidebar — create, rename, colour-code, delete; notes move to root on folder delete |
| **Search** | Debounced keyword search across note **title and body content** |
| **Sort & Filter** | Sort by last modified ↑/↓, date created, or title A→Z |
| **Pin Notes** | Pin important notes; pinned notes always float to the top of the list |
| **Timestamps** | Every note tracks `createdAt` and `updatedAt` (displayed relative to now) |
| **Export** | Export individual notes as **TXT**, **HTML**, or **JSON**; export all notes as a single JSON backup from Settings |
| **Dark / Light Mode** | One-click theme toggle; preference persisted in `localStorage` |
| **Blockchain-Ready Storage** | Every note carries `hash`, `syncStatus`, and `version` fields; the storage layer is abstracted behind a single service file |

---

## Project Structure

```
notes-app/
├── .gitignore
├── README.md
│
├── client/                          ← React + Vite frontend
│   ├── .env                         ← VITE_API_URL
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 ← React entry point
│       ├── App.jsx                  ← BrowserRouter + Context providers
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.jsx       ← Reusable button (primary/secondary/ghost/danger)
│       │   │   ├── Modal.jsx        ← Accessible modal dialog
│       │   │   ├── SearchBar.jsx    ← Debounced keyword search input
│       │   │   └── ThemeToggle.jsx  ← Dark/light mode button
│       │   ├── layout/
│       │   │   ├── Header.jsx       ← App top bar (brand, search, theme, settings)
│       │   │   ├── Sidebar.jsx      ← Folder navigation + create/rename/delete
│       │   │   └── Footer.jsx       ← Note count + sync status
│       │   └── notes/
│       │       ├── NoteCard.jsx     ← Single note card (pin, delete, preview)
│       │       ├── NoteEditor.jsx   ← TipTap rich-text editor + toolbar + export
│       │       ├── NoteFilter.jsx   ← Sort-order dropdown
│       │       └── NoteList.jsx     ← Scrollable list of NoteCards with search/sort
│       │
│       ├── context/
│       │   ├── NotesContext.jsx     ← Global notes + folders state (useReducer)
│       │   └── ThemeContext.jsx     ← Theme state (light/dark)
│       │
│       ├── hooks/
│       │   ├── useNotes.js          ← Consume NotesContext
│       │   ├── useSearch.js         ← Filtered + sorted note list
│       │   └── useTheme.js          ← Consume ThemeContext
│       │
│       ├── pages/
│       │   ├── Home.jsx             ← 3-column layout (Sidebar | NoteList | NoteEditor)
│       │   └── Settings.jsx         ← Theme toggle, export-all, clear storage
│       │
│       ├── services/
│       │   ├── api.js               ← fetch() wrapper for the REST API
│       │   ├── storage.js           ← localStorage abstraction (blockchain swap point)
│       │   └── web3Bridge.js        ← Web3/Web5 stub (connect, publish, fetch, verify)
│       │
│       ├── utils/
│       │   ├── constants.js         ← Storage keys, sort options, export formats, colours
│       │   ├── helpers.js           ← stripHtml, truncate, formatDate, filterNotes, sortNotes, exportNote, debounce
│       │   └── validators.js        ← validateNote, validateFolder
│       │
│       └── styles/
│           ├── themes.css           ← CSS custom properties for light + dark themes
│           └── global.css           ← Full application stylesheet
│
└── server/                          ← Node.js + Express backend
    ├── .env                         ← PORT, NODE_ENV, CLIENT_URL
    ├── package.json
    └── src/
        ├── app.js                   ← Express setup, CORS, route mounting
        ├── controllers/
        │   └── notesController.js   ← HTTP request handlers for notes + folders
        ├── middleware/
        │   ├── errorHandler.js      ← Global error handler
        │   └── validator.js         ← validateNote, validateFolder
        ├── models/
        │   └── noteModel.js         ← In-memory store (NoteModel + FolderModel)
        ├── routes/
        │   └── notesRoutes.js       ← Express router (notes + folders endpoints)
        ├── services/
        │   ├── notesService.js      ← Business logic layer
        │   └── web3Service.js       ← Server-side blockchain stub (hash, publish, verify)
        └── utils/
            └── helpers.js           ← stripHtml, truncate, formatDate
```

---

## API Reference

### Notes  `/api/notes`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notes` | Get all notes (optional `?folder=` or `?search=`) |
| `GET` | `/api/notes/:id` | Get a single note by ID |
| `POST` | `/api/notes` | Create a note (`{ title?, content?, folderId? }`) |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `PATCH` | `/api/notes/:id/pin` | Toggle pin on a note |

### Folders  `/api/notes/folders`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/notes/folders/all` | Get all folders |
| `POST` | `/api/notes/folders` | Create a folder (`{ name, color? }`) |
| `PUT` | `/api/notes/folders/:id` | Rename / recolour a folder |
| `DELETE` | `/api/notes/folders/:id` | Delete a folder (orphaned notes move to root) |

---

## Note Data Model

```json
{
  "id":         "uuid-v4",
  "title":      "My Note",
  "content":    "<p>HTML from TipTap</p>",
  "folderId":   "uuid-v4 | null",
  "isPinned":   false,
  "createdAt":  "2026-06-25T12:00:00.000Z",
  "updatedAt":  "2026-06-25T12:05:00.000Z",
  "hash":       null,
  "syncStatus": "local",
  "version":    1
}
```

> **Blockchain fields:** `hash` will hold the SHA-256 content fingerprint once published to the chain. `syncStatus` transitions from `'local'` → `'pending'` → `'synced'`. `version` increments on every save for conflict resolution.

---

## Blockchain / Web5 Upgrade Path

The app is structured so that upgrading to Web3 or Web5 (TBD DWN) only requires modifying **two files**:

| File | What to implement |
|---|---|
| `client/src/services/storage.js` | Replace `localStorage` calls with DWN / smart-contract reads and writes |
| `client/src/services/web3Bridge.js` | Implement `connect()`, `publishNote()`, `fetchNotes()`, `verifyNote()` using `@web5/api` or `ethers.js` |
| `server/src/models/noteModel.js` | Replace `Map` store with a blockchain adapter |
| `server/src/services/web3Service.js` | Implement `publishNote()`, `fetchNoteByHash()`, `verifyNote()` server-side |

All notes already carry the required metadata fields (`hash`, `syncStatus`, `version`).

---

## Getting Started

### Prerequisites
- Node.js ≥ 18

### 1 — Install dependencies

```bash
# Server
cd notes-app/server
npm install

# Client
cd ../client
npm install
```

### 2 — Start the server

```bash
cd notes-app/server
npm run dev        # nodemon — auto-restarts on file changes
# Server runs at http://localhost:5000
```

### 3 — Start the client

```bash
cd notes-app/client
npm run dev        # Vite dev server
# App runs at http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no extra CORS configuration is needed during development.

### 4 — Build for production

```bash
cd notes-app/client
npm run build      # Output in /client/dist
```

---

## Key Functions Reference

| Function | File | Purpose |
|---|---|---|
| `createNote()` | `NotesContext.jsx` | Creates a new note with blockchain fields, adds to state and localStorage |
| `updateNote()` | `NotesContext.jsx` | Merges updates, bumps version, marks syncStatus = 'local' |
| `deleteNote()` | `NotesContext.jsx` | Removes note from state |
| `togglePin()` | `NotesContext.jsx` | Flips `isPinned` on a note |
| `createFolder()` | `NotesContext.jsx` | Adds a colour-coded folder |
| `deleteFolder()` | `NotesContext.jsx` | Removes folder, orphans its notes to root |
| `filterNotes()` | `utils/helpers.js` | Filters by folder + keyword (title + stripped content), floats pinned notes |
| `sortNotes()` | `utils/helpers.js` | Sorts by last modified / date created / title |
| `exportNote()` | `utils/helpers.js` | Triggers browser download in TXT / HTML / JSON |
| `debounce()` | `utils/helpers.js` | Used by search (300 ms) and auto-save (500 ms) |
| `useSearch()` | `hooks/useSearch.js` | Returns filtered+sorted results for the active folder and query |
| `generateNoteHash()` | `server/src/services/web3Service.js` | SHA-256 hash of note content for chain integrity |
| `storageService.exportAll()` | `services/storage.js` | Returns full localStorage snapshot (migration payload) |
