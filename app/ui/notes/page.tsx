"use client"; // This ensures the page is a client component

import { Suspense } from "react";
import NotesApp from "./NotesApp";

export default function NotesPage() {

  return <Suspense fallback={<div>Loading...</div>}>
      <NotesApp />
    </Suspense>
}
