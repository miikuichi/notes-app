import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { notesApi, foldersApi } from '../services/api';

// ─── Action Types ─────────────────────────────────────────────────────────────
const A = {
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  PIN_NOTE: 'PIN_NOTE',
  SET_FOLDERS: 'SET_FOLDERS',
  ADD_FOLDER: 'ADD_FOLDER',
  UPDATE_FOLDER: 'UPDATE_FOLDER',
  DELETE_FOLDER: 'DELETE_FOLDER',
  SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
  SELECT_NOTE: 'SELECT_NOTE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

const DEFAULT_FOLDERS = [
  { id: 'all', name: 'All Notes', color: '#6B7280', isDefault: true, createdAt: new Date().toISOString() },
];

const initialState = {
  notes: [],
  folders: DEFAULT_FOLDERS,
  activeFolder: 'all',
  selectedNote: null,
  loading: true,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case A.SET_NOTES:
      return { ...state, notes: action.payload };

    case A.ADD_NOTE:
      return { ...state, notes: [action.payload, ...state.notes] };

    case A.UPDATE_NOTE: {
      const updated = action.payload;
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === updated.id ? updated : n)),
        selectedNote:
          state.selectedNote?.id === updated.id ? updated : state.selectedNote,
      };
    }

    case A.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        selectedNote:
          state.selectedNote?.id === action.payload ? null : state.selectedNote,
      };

    case A.PIN_NOTE:
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload
            ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
            : n
        ),
      };

    case A.SET_FOLDERS:
      return { ...state, folders: action.payload };

    case A.ADD_FOLDER:
      return { ...state, folders: [...state.folders, action.payload] };

    case A.UPDATE_FOLDER:
      return {
        ...state,
        folders: state.folders.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };

    case A.DELETE_FOLDER:
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== action.payload),
        notes: state.notes.map((n) =>
          n.folderId === action.payload ? { ...n, folderId: null } : n
        ),
        activeFolder:
          state.activeFolder === action.payload ? 'all' : state.activeFolder,
        selectedNote:
          state.selectedNote?.folderId === action.payload
            ? { ...state.selectedNote, folderId: null }
            : state.selectedNote,
      };

    case A.SET_ACTIVE_FOLDER:
      return { ...state, activeFolder: action.payload, selectedNote: null };

    case A.SELECT_NOTE:
      return { ...state, selectedNote: action.payload };

    case A.SET_LOADING:
      return { ...state, loading: action.payload };

    case A.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Hydrate from API on mount ────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        dispatch({ type: A.SET_LOADING, payload: true });
        const [notesRes, foldersRes] = await Promise.all([
          notesApi.getAll(),
          foldersApi.getAll(),
        ]);
        dispatch({ type: A.SET_NOTES, payload: notesRes.data || [] });
        // Prepend the virtual "All Notes" folder that lives only on the client
        const serverFolders = foldersRes.data || [];
        dispatch({
          type: A.SET_FOLDERS,
          payload: [DEFAULT_FOLDERS[0], ...serverFolders],
        });
      } catch (err) {
        console.error('[NotesContext] Failed to load data:', err);
        dispatch({ type: A.SET_ERROR, payload: 'Failed to connect to the server.' });
      } finally {
        dispatch({ type: A.SET_LOADING, payload: false });
      }
    }
    load();
  }, []);

  // ─── Notes actions ───────────────────────────────────────────────────────────
  const createNote = useCallback(
    async (overrides = {}) => {
      const payload = {
        title: overrides.title || 'Untitled Note',
        content: overrides.content || '',
        folderId:
          overrides.folderId ??
          (state.activeFolder !== 'all' ? state.activeFolder : null),
      };
      try {
        const res = await notesApi.create(payload);
        const note = res.data;
        dispatch({ type: A.ADD_NOTE, payload: note });
        dispatch({ type: A.SELECT_NOTE, payload: note });
        return note;
      } catch (err) {
        console.error('[NotesContext] createNote failed:', err);
      }
    },
    [state.activeFolder]
  );

  const updateNote = useCallback(
    async (id, updates) => {
      // Optimistic update
      const note = state.notes.find((n) => n.id === id);
      if (!note) return null;
      const optimistic = {
        ...note,
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: A.UPDATE_NOTE, payload: optimistic });

      try {
        const res = await notesApi.update(id, updates);
        dispatch({ type: A.UPDATE_NOTE, payload: res.data });
        return res.data;
      } catch (err) {
        // Roll back on failure
        dispatch({ type: A.UPDATE_NOTE, payload: note });
        console.error('[NotesContext] updateNote failed:', err);
      }
    },
    [state.notes]
  );

  const deleteNote = useCallback(async (id) => {
    dispatch({ type: A.DELETE_NOTE, payload: id }); // optimistic
    try {
      await notesApi.delete(id);
    } catch (err) {
      console.error('[NotesContext] deleteNote failed:', err);
    }
  }, []);

  const togglePin = useCallback(async (id) => {
    dispatch({ type: A.PIN_NOTE, payload: id }); // optimistic
    try {
      const res = await notesApi.togglePin(id);
      dispatch({ type: A.UPDATE_NOTE, payload: res.data });
    } catch (err) {
      dispatch({ type: A.PIN_NOTE, payload: id }); // roll back
      console.error('[NotesContext] togglePin failed:', err);
    }
  }, []);

  // ─── Folder actions ──────────────────────────────────────────────────────────
  const createFolder = useCallback(async (name, color = '#FFD700') => {
    try {
      const res = await foldersApi.create({ name: name.trim(), color });
      dispatch({ type: A.ADD_FOLDER, payload: res.data });
      return res.data;
    } catch (err) {
      console.error('[NotesContext] createFolder failed:', err);
    }
  }, []);

  const updateFolder = useCallback(
    async (id, updates) => {
      const folder = state.folders.find((f) => f.id === id);
      if (!folder || folder.isDefault) return null;
      try {
        const res = await foldersApi.update(id, updates);
        dispatch({ type: A.UPDATE_FOLDER, payload: res.data });
        return res.data;
      } catch (err) {
        console.error('[NotesContext] updateFolder failed:', err);
      }
    },
    [state.folders]
  );

  const deleteFolder = useCallback(async (id) => {
    dispatch({ type: A.DELETE_FOLDER, payload: id }); // optimistic
    try {
      await foldersApi.delete(id);
    } catch (err) {
      console.error('[NotesContext] deleteFolder failed:', err);
    }
  }, []);

  const setActiveFolder = useCallback((folderId) => {
    dispatch({ type: A.SET_ACTIVE_FOLDER, payload: folderId });
  }, []);

  const selectNote = useCallback((note) => {
    dispatch({ type: A.SELECT_NOTE, payload: note });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        ...state,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        createFolder,
        updateFolder,
        deleteFolder,
        setActiveFolder,
        selectNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// ─── Action Types ─────────────────────────────────────────────────────────────
const A = {
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  PIN_NOTE: 'PIN_NOTE',
  SET_FOLDERS: 'SET_FOLDERS',
  ADD_FOLDER: 'ADD_FOLDER',
  UPDATE_FOLDER: 'UPDATE_FOLDER',
  DELETE_FOLDER: 'DELETE_FOLDER',
  SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
  SELECT_NOTE: 'SELECT_NOTE',
};

const DEFAULT_FOLDERS = [
  { id: 'all', name: 'All Notes', color: '#6B7280', isDefault: true, createdAt: new Date().toISOString() },
];

const initialState = {
  notes: [],
  folders: DEFAULT_FOLDERS,
  activeFolder: 'all',
  selectedNote: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case A.SET_NOTES:
      return { ...state, notes: action.payload };

    case A.ADD_NOTE:
      return { ...state, notes: [action.payload, ...state.notes] };

    case A.UPDATE_NOTE: {
      const updated = action.payload;
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === updated.id ? updated : n)),
        selectedNote:
          state.selectedNote?.id === updated.id ? updated : state.selectedNote,
      };
    }

    case A.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        selectedNote:
          state.selectedNote?.id === action.payload ? null : state.selectedNote,
      };

    case A.PIN_NOTE:
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload
            ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
            : n
        ),
      };

    case A.SET_FOLDERS:
      return { ...state, folders: action.payload };

    case A.ADD_FOLDER:
      return { ...state, folders: [...state.folders, action.payload] };

    case A.UPDATE_FOLDER:
      return {
        ...state,
        folders: state.folders.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };

    case A.DELETE_FOLDER:
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== action.payload),
        notes: state.notes.map((n) =>
          n.folderId === action.payload ? { ...n, folderId: null } : n
        ),
        activeFolder:
          state.activeFolder === action.payload ? 'all' : state.activeFolder,
        selectedNote:
          state.selectedNote?.folderId === action.payload
            ? { ...state.selectedNote, folderId: null }
            : state.selectedNote,
      };

    case A.SET_ACTIVE_FOLDER:
      return { ...state, activeFolder: action.payload, selectedNote: null };

    case A.SELECT_NOTE:
      return { ...state, selectedNote: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Hydrate from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    const savedNotes = storageService.get(STORAGE_KEYS.NOTES) || [];
    const savedFolders =
      storageService.get(STORAGE_KEYS.FOLDERS) || DEFAULT_FOLDERS;

    dispatch({ type: A.SET_NOTES, payload: savedNotes });
    dispatch({ type: A.SET_FOLDERS, payload: savedFolders });
  }, []);

  // ── Persist on every change ──────────────────────────────────────────────────
  useEffect(() => {
    storageService.set(STORAGE_KEYS.NOTES, state.notes);
  }, [state.notes]);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.FOLDERS, state.folders);
  }, [state.folders]);

  // ─── Notes actions ───────────────────────────────────────────────────────────
  const createNote = useCallback(
    (overrides = {}) => {
      const note = {
        id: uuidv4(),
        title: overrides.title || 'Untitled Note',
        content: overrides.content || '',
        folderId:
          overrides.folderId ??
          (state.activeFolder !== 'all' ? state.activeFolder : null),
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Blockchain-readiness fields
        hash: null,
        syncStatus: 'local',
        version: 1,
      };
      dispatch({ type: A.ADD_NOTE, payload: note });
      dispatch({ type: A.SELECT_NOTE, payload: note });
      return note;
    },
    [state.activeFolder]
  );

  const updateNote = useCallback(
    (id, updates) => {
      const note = state.notes.find((n) => n.id === id);
      if (!note) return null;
      const updated = {
        ...note,
        ...updates,
        id,                                       // immutable
        createdAt: note.createdAt,                // immutable
        updatedAt: new Date().toISOString(),
        version: note.version + 1,
        syncStatus: 'local',
      };
      dispatch({ type: A.UPDATE_NOTE, payload: updated });
      return updated;
    },
    [state.notes]
  );

  const deleteNote = useCallback((id) => {
    dispatch({ type: A.DELETE_NOTE, payload: id });
  }, []);

  const togglePin = useCallback((id) => {
    dispatch({ type: A.PIN_NOTE, payload: id });
  }, []);

  // ─── Folder actions ──────────────────────────────────────────────────────────
  const createFolder = useCallback((name, color = '#FFD700') => {
    const folder = {
      id: uuidv4(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
      isDefault: false,
    };
    dispatch({ type: A.ADD_FOLDER, payload: folder });
    return folder;
  }, []);

  const updateFolder = useCallback(
    (id, updates) => {
      const folder = state.folders.find((f) => f.id === id);
      if (!folder || folder.isDefault) return null;
      const updated = { ...folder, ...updates, id };
      dispatch({ type: A.UPDATE_FOLDER, payload: updated });
      return updated;
    },
    [state.folders]
  );

  const deleteFolder = useCallback((id) => {
    dispatch({ type: A.DELETE_FOLDER, payload: id });
  }, []);

  const setActiveFolder = useCallback((folderId) => {
    dispatch({ type: A.SET_ACTIVE_FOLDER, payload: folderId });
  }, []);

  const selectNote = useCallback((note) => {
    dispatch({ type: A.SELECT_NOTE, payload: note });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        ...state,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        createFolder,
        updateFolder,
        deleteFolder,
        setActiveFolder,
        selectNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
