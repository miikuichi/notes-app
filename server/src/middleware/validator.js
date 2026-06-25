/**
 * Request-body validators.
 * Returns a string error message, or null when valid.
 */

function validateNote(data) {
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') return 'Title must be a string';
    if (data.title.length > 500) return 'Title must be 500 characters or less';
  }
  if (data.content !== undefined && typeof data.content !== 'string') {
    return 'Content must be a string';
  }
  return null;
}

function validateFolder(data) {
  if (!data.name || typeof data.name !== 'string') {
    return 'Folder name is required and must be a string';
  }
  if (data.name.trim().length === 0) return 'Folder name cannot be empty';
  if (data.name.length > 100) return 'Folder name must be 100 characters or less';
  return null;
}

module.exports = { validateNote, validateFolder };
