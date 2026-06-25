/**
 * Web3 / Web5 Bridge  (Client-Side Stub)
 * ─────────────────────────────────────────────────────────────────────────────
 * All notes carry three blockchain-readiness fields:
 *   • hash        — SHA-256 content fingerprint (set server-side)
 *   • syncStatus  — 'local' | 'synced' | 'pending'
 *   • version     — incremented on every update (conflict resolution)
 *
 * UPGRADE PATH — Web3 → Web5 (DWN):
 *   1. `npm install @web5/api` in /client
 *   2. Call `Web5.connect()` inside `connect()` below
 *   3. Implement `publishNote()` using `web5.dwn.records.create()`
 *   4. Implement `fetchNotes()` using `web5.dwn.records.query()`
 *   5. Set `syncStatus = 'synced'` after each successful write
 * ─────────────────────────────────────────────────────────────────────────────
 */

let _connected = false;

const web3Bridge = {
  /** Initialise the Web3/Web5 connection. */
  async connect() {
    console.log('[Web3Bridge] connect() — not yet implemented.');
    _connected = false;
    return false;
  },

  isConnected() {
    return _connected;
  },

  /**
   * Publish one note to the blockchain / DWN.
   * @param {Object} note
   * @returns {Promise<{hash: string|null, txId: string|null, status: string}>}
   */
  async publishNote(note) {
    console.log('[Web3Bridge] publishNote() stub — note id:', note.id);
    return { hash: null, txId: null, status: 'not_implemented' };
  },

  /**
   * Fetch all notes from the blockchain / DWN.
   * @returns {Promise<Array>}
   */
  async fetchNotes() {
    console.log('[Web3Bridge] fetchNotes() stub — not yet implemented.');
    return [];
  },

  /**
   * Verify a note's local content against its on-chain hash.
   * @param {Object} note
   * @returns {Promise<boolean>}
   */
  async verifyNote(note) {
    console.log('[Web3Bridge] verifyNote() stub — note id:', note.id);
    return false;
  },

  /**
   * Sync all local notes to the chain.
   * @param {Array} notes
   * @returns {Promise<Array>} notes with updated syncStatus
   */
  async syncAll(notes) {
    console.log('[Web3Bridge] syncAll() stub — not yet implemented.');
    return notes.map((n) => ({ ...n, syncStatus: 'local' }));
  },
};

export default web3Bridge;
