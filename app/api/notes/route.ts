import { NextRequest, NextResponse } from "next/server";

// fakeApi.ts
export interface Note {
    id: number;
    title: string;
    content: string;
    date: string;
    owner: string;
}

let notesData: Note[] = [
    // User 101
    { id: 101, title: 'Meeting Notes', content: 'Discussed project timeline and deliverables', date: '2024-10-20', owner: 'vanshikarajput@gmail.com' },
    { id: 101, title: 'Ideas', content: 'New feature concepts for the app', date: '2024-10-21', owner: 'vanshikarajput@gmail.com' },
    { id: 101, title: 'Shopping List', content: 'Milk, eggs, bread, coffee', date: '2024-10-22', owner: 'vanshikarajput@gmail.com' },

    // User 102
    { id: 102, title: 'Workout Plan', content: 'Monday: Chest, Tuesday: Back, Wednesday: Legs', date: '2024-10-20', owner: 'john.doe@example.com' },
    { id: 102, title: 'Travel Checklist', content: 'Passport, Tickets, Wallet, Sunglasses', date: '2024-10-21', owner: 'john.doe@example.com' },
    { id: 102, title: 'Books to Read', content: 'Atomic Habits, Clean Code, Deep Work', date: '2024-10-22', owner: 'john.doe@example.com' },

    // User 103
    { id: 103, title: 'Project Research', content: 'Read papers on AI algorithms and summarize findings', date: '2024-10-20', owner: 'alice@example.com' },
    { id: 103, title: 'Grocery List', content: 'Tomatoes, Onions, Chicken, Rice', date: '2024-10-21', owner: 'alice@example.com' },
    { id: 103, title: 'Birthday Plans', content: 'Reserve restaurant, invite friends, buy cake', date: '2024-10-22', owner: 'alice@example.com' },

    // User 104
    { id: 104, title: 'Work Tasks', content: 'Finish report, attend client call, update spreadsheet', date: '2024-10-20', owner: 'bob@example.com' },
    { id: 104, title: 'Ideas for Blog', content: 'React tips, TypeScript tricks, Next.js tutorials', date: '2024-10-21', owner: 'bob@example.com' },
    { id: 104, title: 'Movies to Watch', content: 'Inception, Interstellar, The Matrix', date: '2024-10-22', owner: 'bob@example.com' },
];


const FAKE_DELAY = 500; // 0.5s

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
    await delay(FAKE_DELAY);

    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");

    let filteredNotes = notesData;

    if (userIdParam) {
        const userId = Number(userIdParam);
        filteredNotes = notesData.filter(note => note.id === userId);
    }

    const wow = userIdParam !== "101"; // boolean field
    return NextResponse.json({ wow: wow, notes: filteredNotes });
}

const addNote = (note: Note): Promise<Note> =>
    new Promise((resolve) =>
        setTimeout(() => {
            notesData = [note, ...notesData];
            resolve(note);
        }, FAKE_DELAY)
    );

export async function POST(req: NextRequest) {
    const note: Note = await req.json();
    const saved = await addNote(note);
    return NextResponse.json(saved);
}

const updateNote = (updatedNote: Note): Promise<Note> =>
    new Promise((resolve) =>
        setTimeout(() => {
            notesData = notesData.map((n) => (n.id === updatedNote.id ? updatedNote : n));
            resolve(updatedNote);
        }, FAKE_DELAY)
    );

export async function PUT(req: NextRequest) {
    const updatedNote: Note = await req.json();
    const updated = await updateNote(updatedNote);
    return NextResponse.json(updated);
}

const deleteNote = (id: number): Promise<number> =>
    new Promise((resolve) =>
        setTimeout(() => {
            notesData = notesData.filter((n) => n.id !== id);
            resolve(id);
        }, FAKE_DELAY)
    );

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const deletedId = await deleteNote(id);
    return NextResponse.json({ deletedId });
}
