const crypto = require('crypto');

/**
 * Web3 / Blockchain Service  (Server-Side Stub)
 * ─────────────────────────────────────────────────────────────────────────────
 * UPGRADE PATH — Web3 → Web5:
 *   1. Install `ethers` (Web3) or `@web5/api` (Web5 / DWN).
 *   2. Replace the stub bodies below with real SDK calls.
 *   3. Store the returned `txHash` / `recordId` in the note's `hash` field.
 *   4. Update `syncStatus` to 'synced' on success.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const Web3Service = {
  /**
   * Generate a deterministic SHA-256 hash from a note's immutable fields.
   * Used as the content-integrity fingerprint when publishing to the chain.
   * @param {Object} note
   * @returns {string}
   */
  generateNoteHash(note) {
    const payload = JSON.stringify({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      version: note.version,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  },

  /**
   * Stub: Publish a note to the blockchain / DWN.
   * @param {Object} note
   * @returns {Promise<{txHash: string|null, status: string}>}
   */
  async publishNote(note) {
    console.log('[Web3Service] publishNote stub — not yet connected.', note.id);
    return { txHash: null, status: 'not_implemented' };
  },

  /**
   * Stub: Fetch a note from the blockchain by its stored hash.
   * @param {string} hash
   * @returns {Promise<Object|null>}
   */
  async fetchNoteByHash(hash) {
    console.log('[Web3Service] fetchNoteByHash stub — not yet connected.', hash);
    return null;
  },

  /**
   * Stub: Verify a note's local content against its on-chain hash.
   * @param {Object} note
   * @returns {Promise<boolean>}
   */
  async verifyNote(note) {
    console.log('[Web3Service] verifyNote stub — not yet connected.', note.id);
    return false;
  },
};

module.exports = Web3Service;
