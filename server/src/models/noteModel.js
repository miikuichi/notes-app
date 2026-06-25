const supabase = require('../config/supabase');

// ─── Note Model ───────────────────────────────────────────────────────────────
const NoteModel = {
  async create(data) {
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        title: data.title || 'Untitled Note',
        content: data.content || '',
        folder_id: data.folderId || null,
        is_pinned: false,
        hash: null,
        sync_status: 'local',
        version: 1,
      })
      .select()
      .single();
    if (error) throw error;
    return toCamel(note);
  },

  async findAll() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data.map(toCamel);
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toCamel(data);
  },

  async findByFolder(folderId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('folder_id', folderId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data.map(toCamel);
  },

  async update(id, updates) {
    const { id: _id, createdAt: _c, created_at: _ca, ...safeUpdates } = updates;
    const dbUpdates = toSnake(safeUpdates);
    dbUpdates.updated_at = new Date().toISOString();

    const { data: current, error: fetchErr } = await supabase
      .from('notes')
      .select('version')
      .eq('id', id)
      .single();
    if (fetchErr) return null;

    dbUpdates.version = (current.version || 1) + 1;
    dbUpdates.sync_status = 'local';

    const { data: note, error } = await supabase
      .from('notes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamel(note);
  },

  async delete(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async search(query) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data.map(toCamel);
  },
};

// ─── Folder Model ─────────────────────────────────────────────────────────────
const FolderModel = {
  async create(data) {
    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        name: data.name.trim(),
        color: data.color || '#6B7280',
        is_default: false,
      })
      .select()
      .single();
    if (error) throw error;
    return toCamel(folder);
  },

  async findAll() {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data.map(toCamel);
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toCamel(data);
  },

  async update(id, updates) {
    const folder = await FolderModel.findById(id);
    if (!folder || folder.isDefault) return null;
    const { data: updated, error } = await supabase
      .from('folders')
      .update(toSnake(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamel(updated);
  },

  async delete(id) {
    const folder = await FolderModel.findById(id);
    if (!folder || folder.isDefault) return false;
    // Orphan notes: move to no folder
    await supabase.from('notes').update({ folder_id: null }).eq('folder_id', id);
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toCamel(row) {
  if (!row) return null;
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v,
    ])
  );
}

function toSnake(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/([A-Z])/g, '_$1').toLowerCase(),
      v,
    ])
  );
}

module.exports = { NoteModel, FolderModel };
