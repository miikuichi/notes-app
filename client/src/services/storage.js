/**
 * Storage Service  —  localStorage abstraction layer
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCKCHAIN UPGRADE PATH:
 *   Replace the `get` / `set` / `remove` implementations with calls to your
 *   Decentralized Web Node (DWN) SDK or smart-contract storage adapter.
 *   The rest of the app only calls this module, so the upgrade is isolated here.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const storageService = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`[Storage] get("${key}") failed:`, err);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[Storage] set("${key}") failed:`, err);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[Storage] remove("${key}") failed:`, err);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('[Storage] clear() failed:', err);
    }
  },

  /**
   * Returns a full snapshot of every stored key–value pair.
   * Use this as the migration payload when moving data to the blockchain layer.
   * @returns {Object}
   */
  exportAll() {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      snapshot[key] = this.get(key);
    }
    return snapshot;
  },
};

export default storageService;
