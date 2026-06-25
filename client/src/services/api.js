import { API_BASE_URL } from '../utils/constants';

/**
 * Thin fetch wrapper — throws on non-2xx responses.
 * @param {string} endpoint  path relative to API_BASE_URL
 * @param {RequestInit} options
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API request failed');
  return data;
}

// ─── Notes API ────────────────────────────────────────────────────────────────
export const notesApi = {
  /** GET /api/notes  (optional ?folder= or ?search= query params) */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/notes${qs ? `?${qs}` : ''}`);
  },

  /** GET /api/notes/:id */
  getById: (id) => request(`/notes/${id}`),

  /** POST /api/notes */
  create: (data) =>
    request('/notes', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /api/notes/:id */
  update: (id, data) =>
    request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** DELETE /api/notes/:id */
  delete: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  /** PATCH /api/notes/:id/pin */
  togglePin: (id) => request(`/notes/${id}/pin`, { method: 'PATCH' }),
};

// ─── Folders API ──────────────────────────────────────────────────────────────
export const foldersApi = {
  /** GET /api/notes/folders/all */
  getAll: () => request('/notes/folders/all'),

  /** POST /api/notes/folders */
  create: (data) =>
    request('/notes/folders', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /api/notes/folders/:id */
  update: (id, data) =>
    request(`/notes/folders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** DELETE /api/notes/folders/:id */
  delete: (id) => request(`/notes/folders/${id}`, { method: 'DELETE' }),
};
