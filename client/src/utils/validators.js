/** Returns an error-map object, or null when the data is valid. */

export function validateNote(data) {
  const errors = {};
  if (data.title && data.title.length > 500)
    errors.title = 'Title must be 500 characters or less';
  return Object.keys(errors).length ? errors : null;
}

export function validateFolder(data) {
  const errors = {};
  if (!data.name || data.name.trim() === '')
    errors.name = 'Folder name is required';
  if (data.name && data.name.length > 100)
    errors.name = 'Folder name must be 100 characters or less';
  return Object.keys(errors).length ? errors : null;
}
