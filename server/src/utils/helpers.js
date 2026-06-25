/**
 * Strips HTML tags and entities from a string.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Truncates a string with an ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(str, maxLen = 120) {
  if (!str) return '';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '…';
}

/**
 * Formats an ISO timestamp to a locale-aware string.
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

module.exports = { stripHtml, truncate, formatDate };
