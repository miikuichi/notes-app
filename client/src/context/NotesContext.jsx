import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import storageService from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

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
