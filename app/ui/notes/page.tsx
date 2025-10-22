"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Lock, Plus, Search, Trash2, Edit3 } from "lucide-react";
import { addNote, updateNote, deleteNote, Note } from "../../api/notes/route";
import {  useSearchParams } from "next/navigation";

interface NotesAppProps {
    userEmail: string; // logged-in user's email
}

export default function NotesApp({ userEmail }: NotesAppProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>("");
    const [editContent, setEditContent] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [wow, setWow] = useState(false);


    const searchParams = useSearchParams();

    const paramUserId = searchParams.get("userId"); // will be null or string

    async function fetchNotesFromServer(userId?: string): Promise<Note[]> {
        const qp = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        const res = await fetch(`/api/notes/${qp}`);
        if (!res.ok) {
            const text = await res.text();
            // console.log(text);
            throw new Error(`Failed to fetch notes: ${res.status} ${text}`);
        }
        const json = await res.json();
        console.log(json);
        setWow(json?.wow);
        return Array.isArray(json.notes) ? json.notes : [];
    }


    // Fetch notes for this user
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const uid = paramUserId ?? "";
                const data = await fetchNotesFromServer(uid); // fetch notes
                // Filter notes based on searchQuery
                const filtered = data.filter(note =>
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setNotes(filtered); // update state with filtered notes
            } catch (e) {
                console.error(e);
                setNotes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [paramUserId, searchQuery]); // re-run if paramUserId or searchQuery changes


    // ---------- HANDLERS ----------
    const handleAddNote = async () => {
        const newNote: Note = {
            id: Date.now(),
            title: "New Note",
            content: "",
            date: new Date().toISOString().split("T")[0],
            owner: userEmail,
        };
        setLoading(true);
        const saved = await addNote(newNote);
        setNotes([saved, ...notes]);
        setSelectedNote(saved);
        setIsEditing(true);
        setEditTitle(saved.title);
        setEditContent(saved.content);
        setLoading(false);
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
            owner: userEmail,
        };
        setLoading(true);
        await updateNote(updated);
        setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
        setSelectedNote(updated);
        setIsEditing(false);
        setLoading(false);
    };

    const handleDeleteNote = async (id: number) => {
        setLoading(true);
        await deleteNote(id);
        setNotes(notes.filter((n) => n.id !== id));
        if (selectedNote?.id === id) setSelectedNote(null);
        setLoading(false);
    };

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ---------- RENDER ----------
    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    if (wow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Warning Icon */}
          <div className="mb-8 relative inline-block">
            <div className="bg-red-800/30 backdrop-blur-xl rounded-full p-8 border-4 border-red-500/50 shadow-2xl animate-bounce">
              <svg className="w-24 h-24 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 text-6xl animate-pulse">💥</div>
            <div className="absolute -bottom-2 -left-2 text-4xl animate-pulse delay-300">⚠️</div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-red-400 via-rose-300 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
            BOOM! 💥
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-100 drop-shadow-lg">
            Unauthorized Access Detected
          </h2>
          
          <div className="bg-red-900/40 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <p className="text-xl md:text-2xl mb-4 text-red-100 font-semibold">
              🚨 Access Violation 🚨
            </p>
            <p className="text-lg text-red-200 leading-relaxed">
              You attempted to access notes that don't belong to you! This incident has been logged and security protocols have been activated.
            </p>
          </div>

          {/* Security Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 text-sm font-semibold mb-1">Severity Level</p>
              <p className="text-2xl font-bold text-red-100">HIGH ⚡</p>
            </div>
            <div className="bg-red-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 text-sm font-semibold mb-1">Status</p>
              <p className="text-2xl font-bold text-red-100">BLOCKED 🛡️</p>
            </div>
            <div className="bg-red-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 text-sm font-semibold mb-1">Action Required</p>
              <p className="text-2xl font-bold text-red-100">LOGOUT 🚪</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {signOut({ callbackUrl: "/ui/login" })}}
            className="group relative bg-white hover:bg-red-50 text-red-900 px-10 py-4 rounded-xl font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout Immediately
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
          </button>

          <p className="mt-6 text-red-300 text-sm">
            For your security, please logout and verify your credentials
          </p>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            New Note
                        </button>

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                                    key={note.date}
                                    onClick={() => setSelectedNote(note)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${selectedNote?.id === note.id
                                        ? "bg-blue-600/20 border border-blue-500/50"
                                        : "bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold truncate">{note.title}</h3>
                                            <p className="text-slate-400 text-sm truncate mt-1">{note.content}</p>
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
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between mb-6">
                                            <h2 className="text-3xl font-bold text-white">{selectedNote.title}</h2>
                                            <button
                                                onClick={() => handleEditNote(selectedNote)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-6">{selectedNote.date}</p>
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
