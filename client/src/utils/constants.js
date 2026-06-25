// ─── localStorage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  NOTES: 'notes_app_notes',
  FOLDERS: 'notes_app_folders',
  THEME: 'notes_app_theme',
  SETTINGS: 'notes_app_settings',
};

// ─── Folder ───────────────────────────────────────────────────────────────────
export const DEFAULT_FOLDER_ID = 'all';

// ─── Sort options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = {
  UPDATED_DESC: 'updatedDesc',
  UPDATED_ASC: 'updatedAsc',
  CREATED_DESC: 'createdDesc',
  TITLE_ASC: 'titleAsc',
};

// ─── Export formats ───────────────────────────────────────────────────────────
export const EXPORT_FORMATS = {
  JSON: 'json',
  HTML: 'html',
  TXT: 'txt',
};

// ─── Blockchain sync states ───────────────────────────────────────────────────
export const SYNC_STATUS = {
  LOCAL: 'local',
  SYNCED: 'synced',
  PENDING: 'pending',
};

// ─── API base URL (injected by Vite) ──────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Folder colour palette ────────────────────────────────────────────────────
export const FOLDER_COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4',
  '#45B7D1', '#96E6A1', '#DDA0DD', '#F0A500',
];
