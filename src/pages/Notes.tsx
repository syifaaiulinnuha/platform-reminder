import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  NotebookPen,
  Plus,
  Search,
  FolderOpen,
  Clock,
  ChevronRight,
  Trash2,
  X,
  Save,
  FileText,
} from "lucide-react";
import { supabase, type Note, type NoteFolder } from "../lib/supabase";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | "all">("all");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    folder_id: "",
    tags: "",
  });
  const [newFolder, setNewFolder] = useState({ name: "", color: "#1e3a5f" });
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [notesRes, foldersRes] = await Promise.all([
      supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase
        .from("note_folders")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);
    if (notesRes.data) setNotes(notesRes.data);
    if (foldersRes.data) setFolders(foldersRes.data);
    setLoading(false);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.title) return;
    await supabase.from("notes").insert({
      title: newNote.title,
      content: newNote.content,
      folder_id: newNote.folder_id || null,
      tags: newNote.tags ? newNote.tags.split(",").map((t) => t.trim()) : [],
    });
    setNewNote({ title: "", content: "", folder_id: "", tags: "" });
    setShowAddModal(false);
    fetchData();
  }

  async function addFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolder.name) return;
    await supabase.from("note_folders").insert({
      name: newFolder.name,
      color: newFolder.color,
    });
    setNewFolder({ name: "", color: "#1e3a5f" });
    setShowFolderModal(false);
    fetchData();
  }

  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    if (selectedNote?.id === id) setSelectedNote(null);
    fetchData();
  }

  async function saveNote() {
    if (!selectedNote) return;
    await supabase
      .from("notes")
      .update({
        title: editTitle,
        content: editContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedNote.id);
    fetchData();
  }

  function selectNote(note: Note) {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  const filteredNotes = notes.filter((n) => {
    if (selectedFolder !== "all" && n.folder_id !== selectedFolder)
      return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <NotebookPen className="w-6 h-6 text-[#d4af37]" />
            Second Brain
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Your personal knowledge management system
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            New Folder
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <div className="card p-4 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
            />
          </div>

          {/* Folders */}
          <div className="mb-4">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Folders
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder("all")}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === "all"
                    ? "bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#60a5fa]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>All Notes</span>
                <span className="ml-auto text-xs text-[var(--text-muted)]">
                  {notes.length}
                </span>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === folder.id
                      ? "bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#60a5fa]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-xs text-[var(--text-muted)]">
                    {notes.filter((n) => n.folder_id === folder.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto mt-4 -mx-4 px-4">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Notes
            </p>
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedNote?.id === note.id
                      ? "bg-[#1e3a5f]/10 border border-[#1e3a5f]/20"
                      : "hover:bg-[var(--bg-tertiary)] border border-transparent"
                  }`}
                >
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {note.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {note.content.replace(/[#*_`]/g, "").slice(0, 60)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {note.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(note.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 card p-5 flex flex-col overflow-hidden">
          {selectedNote ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Link
                    to="/notes"
                    onClick={() => setSelectedNote(null)}
                    className="hover:text-[var(--text-primary)] transition-colors"
                  >
                    Notes
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[var(--text-primary)] truncate max-w-[200px]">
                    {editTitle}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveNote}
                    className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold bg-transparent border-none text-[var(--text-primary)] focus:outline-none mb-4 placeholder:text-[var(--text-muted)]"
                placeholder="Note title..."
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 w-full bg-transparent border-none text-[var(--text-primary)] focus:outline-none resize-none text-sm leading-relaxed font-mono placeholder:text-[var(--text-muted)]"
                placeholder="# Start writing...\n\nUse markdown formatting:\n- **bold**\n- *italic*\n- # Heading\n- - List item"
              />
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{editContent.length} characters</span>
                <span>
                  {editContent.split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="ml-auto">
                  Last edited:{" "}
                  {new Date(selectedNote.updated_at).toLocaleString("id-ID")}
                </span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
              <NotebookPen className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a note to edit</p>
              <p className="text-sm mt-1">or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                New Note
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Folder
                </label>
                <select
                  value={newNote.folder_id}
                  onChange={(e) =>
                    setNewNote({ ...newNote, folder_id: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                >
                  <option value="">No Folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) =>
                    setNewNote({ ...newNote, tags: e.target.value })
                  }
                  placeholder="productivity, research, idea"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                New Folder
              </h2>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolder.name}
                  onChange={(e) =>
                    setNewFolder({ ...newFolder, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {[
                    "#1e3a5f",
                    "#dc2626",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#3b82f6",
                    "#0f766e",
                    "#b45309",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolder({ ...newFolder, color: c })}
                      className={`w-8 h-8 rounded-lg transition-all ${newFolder.color === c ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
