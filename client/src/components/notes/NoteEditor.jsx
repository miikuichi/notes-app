import React, { useEffect, useCallback, useRef } from 'react';
import { Pin } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useNotes } from '../../hooks/useNotes';
import { exportNote, formatDate, debounce } from '../../utils/helpers';
import { EXPORT_FORMATS } from '../../utils/constants';

// ─── Toolbar button ────────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`toolbar-btn${active ? ' active' : ''}`}
    >
      {children}
    </button>
  );
}

// ─── Main editor component ────────────────────────────────────────────────────
function NoteEditor() {
  const { selectedNote, updateNote, togglePin, folders } = useNotes();

  // Debounced save — fires 500 ms after the user stops typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((id, updates) => updateNote(id, updates), 500),
    [updateNote]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    content: selectedNote?.content || '',
    onUpdate({ editor: ed }) {
      if (selectedNote) {
        debouncedSave(selectedNote.id, { content: ed.getHTML() });
      }
    },
  });

  // Swap editor content when the selected note changes
  useEffect(() => {
    if (!editor || !selectedNote) return;
    // Only replace if the HTML actually differs to avoid cursor jumps
    if (editor.getHTML() !== (selectedNote.content || '')) {
      editor.commands.setContent(selectedNote.content || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote?.id]);

  function handleTitleChange(e) {
    if (selectedNote) debouncedSave(selectedNote.id, { title: e.target.value });
  }

  function handleFolderChange(e) {
    if (selectedNote) updateNote(selectedNote.id, { folderId: e.target.value || null });
  }

  function handleExport(format) {
    if (selectedNote) exportNote(selectedNote, format);
  }

  if (!selectedNote) return null;

  const userFolders = folders.filter((f) => f.id !== 'all');

  return (
    <div className="note-editor">
      {/* ── Top bar: title + folder + pin ── */}
      <div className="editor-topbar">
        <input
          key={selectedNote.id}
          type="text"
          className="editor-title"
          defaultValue={selectedNote.title}
          onChange={handleTitleChange}
          placeholder="Note title"
          aria-label="Note title"
          maxLength={500}
        />
        <div className="editor-meta">
          <select
            value={selectedNote.folderId || ''}
            onChange={handleFolderChange}
            className="folder-select"
            aria-label="Move note to folder"
          >
            <option value="">No Folder</option>
            {userFolders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button
            className={`icon-btn${selectedNote.isPinned ? ' active' : ''}`}
            onClick={() => togglePin(selectedNote.id)}
            title={selectedNote.isPinned ? 'Unpin' : 'Pin note'}
            aria-label={selectedNote.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Timestamps ── */}
      <div className="editor-timestamps">
        <span>Created: {formatDate(selectedNote.createdAt)}</span>
        <span>Modified: {formatDate(selectedNote.updatedAt)}</span>
      </div>

      {/* ── Formatting toolbar ── */}
      <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold (Ctrl+B)"><b>B</b></ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic (Ctrl+I)"><i>I</i></ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline (Ctrl+U)"><u>U</u></ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet list">•–</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered list">1.</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Blockquote">"</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive('code')} title="Inline code">{`<>`}</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive('codeBlock')} title="Code block">{`{}`}</ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Align left">⬅</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Align center">☰</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Align right">➡</ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive('highlight')} title="Highlight">🖊</ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo (Ctrl+Z)">↩</ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo (Ctrl+Shift+Z)">↪</ToolbarBtn>

        <span className="toolbar-divider" aria-hidden="true" />

        {/* Export controls */}
        <div className="toolbar-export">
          <span className="toolbar-label">Export:</span>
          <ToolbarBtn onClick={() => handleExport(EXPORT_FORMATS.TXT)} title="Export as plain text">TXT</ToolbarBtn>
          <ToolbarBtn onClick={() => handleExport(EXPORT_FORMATS.HTML)} title="Export as HTML">HTML</ToolbarBtn>
          <ToolbarBtn onClick={() => handleExport(EXPORT_FORMATS.JSON)} title="Export as JSON">JSON</ToolbarBtn>
        </div>
      </div>

      {/* ── TipTap editable area ── */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}

export default NoteEditor;
