import { SORT_OPTIONS, EXPORT_FORMATS } from './constants';

/** Strips HTML tags so plain text can be searched / previewed. */
export function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/** Truncates a string and appends an ellipsis when needed. */
export function truncate(str, maxLen = 120) {
  if (!str) return '';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '…';
}

/**
 * Formats an ISO timestamp to a human-readable relative string:
 *   - same day  → time ("02:45 PM")
 *   - < 7 days  → weekday ("Monday")
 *   - older     → date ("Jun 25, 2026")
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (diffDays < 7)
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Sorts a notes array by the given SORT_OPTIONS value. */
export function sortNotes(notes, sortOption) {
  const sorted = [...notes];
  switch (sortOption) {
    case SORT_OPTIONS.UPDATED_ASC:
      return sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    case SORT_OPTIONS.CREATED_DESC:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case SORT_OPTIONS.TITLE_ASC:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case SORT_OPTIONS.UPDATED_DESC:
    default:
      return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

/**
 * Filters notes by folder and/or a search keyword (title + content).
 * Pinned notes are always floated to the top.
 */
export function filterNotes(notes, folderId, searchQuery) {
  let result = [...notes];

  if (folderId && folderId !== 'all') {
    result = result.filter((n) => n.folderId === folderId);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((n) => {
      const titleMatch = n.title.toLowerCase().includes(q);
      const contentMatch = stripHtml(n.content).toLowerCase().includes(q);
      return titleMatch || contentMatch;
    });
  }

  const pinned = result.filter((n) => n.isPinned);
  const unpinned = result.filter((n) => !n.isPinned);
  return [...pinned, ...unpinned];
}

/**
 * Triggers a browser file download for a single note in the chosen format.
 * @param {Object} note
 * @param {'json'|'html'|'txt'} format
 */
export function exportNote(note, format) {
  let content, mimeType, ext;

  switch (format) {
    case EXPORT_FORMATS.JSON:
      content = JSON.stringify(note, null, 2);
      mimeType = 'application/json';
      ext = 'json';
      break;
    case EXPORT_FORMATS.HTML:
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${note.title}</title>
</head>
<body>
  <h1>${note.title}</h1>
  <p><em>Created: ${new Date(note.createdAt).toLocaleString()}</em></p>
  <p><em>Updated: ${new Date(note.updatedAt).toLocaleString()}</em></p>
  <hr>
  ${note.content}
</body>
</html>`;
      mimeType = 'text/html';
      ext = 'html';
      break;
    case EXPORT_FORMATS.TXT:
    default:
      content = [
        note.title,
        '='.repeat(note.title.length),
        `Created : ${new Date(note.createdAt).toLocaleString()}`,
        `Updated : ${new Date(note.updatedAt).toLocaleString()}`,
        '',
        stripHtml(note.content),
      ].join('\n');
      mimeType = 'text/plain';
      ext = 'txt';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${note.title.replace(/[^a-z0-9]/gi, '_') || 'note'}.${ext}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Returns a debounced version of `fn` that fires after `delay` ms of silence. */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
