"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Lock, Plus, Search, Trash2, Edit3 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  owner: string | null | undefined;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wow, setWow] = useState(false);

  const searchParams = useSearchParams();
  const paramUserId = searchParams.get("userId");

  const { data: session } = useSession();

  // ---------- FETCH NOTES ----------
  async function fetchNotesFromServer(userId?: string): Promise<Note[]> {
    try {
      const qp = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      const res = await fetch(`/api/notes/${qp}`);
      if (!res.ok) throw new Error(`Failed to fetch notes`);
      const json = await res.json();
      setWow(json?.wow);
      return Array.isArray(json.notes) ? json.notes : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const uid = paramUserId ?? "";
        const data = await fetchNotesFromServer(uid);
        const filtered = data.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setNotes(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paramUserId, searchQuery]);

  // ---------- HANDLERS ----------
  const handleAddNote = async () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "",
      date: new Date().toISOString().split("T")[0],
      owner: session?.user?.email,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (!res.ok) throw new Error("Failed to add note");
      const saved = await res.json();
      setNotes([saved, ...notes]);
      setSelectedNote(saved);
      setIsEditing(true);
      setEditTitle(saved.title);
      setEditContent(saved.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    const updated: Note = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      date: new Date().toISOString().split("T")[0],
      owner: session?.user?.email,
    };
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const saved = await res.json();
      setNotes(notes.map((n) => (n.id === saved.id ? saved : n)));
      setSelectedNote(saved);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      await res.json();
      setNotes(notes.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------- RENDER ----------
  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  if (wow) {
    const hackedHash = `SHA-256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(hackedHash);
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 p-6 relative overflow-hidden font-mono">
        {/* Animated background lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-red-500 animate-pulse"
              style={{
                top: `${i * 5}%`,
                left: 0,
                right: 0,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Warning symbol */}
        <div className="relative z-10 mb-8 animate-pulse">
          <div className="w-32 h-32 border-4 border-red-500 rotate-45 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-red-600 -rotate-45 flex items-center justify-center">
              <span className="text-6xl font-bold rotate-45">⚠</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-6xl font-bold mb-4 tracking-wider animate-pulse">
            ACCESS DENIED
          </h1>
          <div className="text-xl mb-2 text-red-400">
            [UNAUTHORIZED ACCESS DETECTED]
          </div>
          <p className="text-lg mb-8 text-red-300">
            Security breach attempt logged. You cannot access these notes.
          </p>

          {/* Hash display */}
          <div className="bg-black border-2 border-red-500 rounded-lg p-6 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <div className="text-sm text-red-400 mb-2 text-left">
              INCIDENT HASH:
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-xs text-red-300 break-all text-left bg-red-950/30 p-3 rounded border border-red-900">
                {hackedHash}
              </code>
              <button
                onClick={copyToClipboard}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] flex-shrink-0"
                title="Copy hash"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => signOut({ callbackUrl: "/ui/login" })}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border-2 border-red-500"
          >
            &gt;&gt; TERMINATE SESSION
          </button>

          {/* Footer warning */}
          <div className="mt-8 text-xs text-red-400 opacity-70">
            This incident has been reported to system administrators.
          </div>
        </div>

        {/* Corner  */}
        <div className="absolute top-4 left-4 text-red-500 opacity-30 text-xs">
          [SYS_ERR_401]
        </div>
        <div className="absolute top-4 right-4 text-red-500 opacity-30 text-xs">
          [AUTH_FAIL]
        </div>
        <div className="absolute bottom-4 left-4 text-red-500 opacity-30 text-xs">
          {new Date().toISOString()}
        </div>
        <div className="absolute bottom-4 right-4 text-red-500 opacity-30 text-xs">
          [LOG_ID:{Math.floor(Math.random() * 999999)}]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Notes</h1>
          <div className="flex gap-4">
            <button
              onClick={handleAddNote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700/50 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredNotes.map((note) => (
                <div
                  key={note.id+ note.date}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                    selectedNote?.id === note.id
                      ? "bg-blue-600/20 border border-blue-500/50"
                      : "bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {note.title}
                      </h3>
                      <p className="text-slate-400 text-sm truncate mt-1">
                        {note.content}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">{note.date}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Detail */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl">
            {selectedNote ? (
              <div className="h-full flex flex-col">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-3xl font-bold text-white bg-transparent border-b border-slate-600 pb-4 mb-6 focus:outline-none focus:border-blue-500"
                      placeholder="Note title"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 text-slate-300 bg-transparent resize-none focus:outline-none text-lg leading-relaxed"
                      placeholder="Start writing..."
                    />
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSaveNote}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <h2 className="text-3xl font-bold text-white">
                        {selectedNote.title}
                      </h2>
                      <button
                        onClick={() => handleEditNote(selectedNote)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">
                      {selectedNote.date}
                    </p>
                    <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedNote.content}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Select a note to view or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
