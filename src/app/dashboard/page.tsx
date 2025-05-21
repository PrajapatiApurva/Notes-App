// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import FloatingActionButton from '../components/FloatingActionButton';
import { Note } from '../lib/types';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from API
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      // Sort notes by updatedAt (newest first)
      const sortedNotes = data.notes.sort(
        (a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      setNotes(sortedNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle note card click to show modal
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedNote(null);
    // Refresh notes after modal is closed (in case of edits/deletes)
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Notes</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
            <button 
              onClick={fetchNotes}
              className="mt-2 text-sm underline text-red-700 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">You don&apos;t have any notes yet.</p>
            <a
              href="/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create your first note
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={handleNoteClick} 
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Note modal */}
      {selectedNote && (
        <NoteModal 
          note={selectedNote} 
          onClose={handleCloseModal} 
        />
      )}
      
      <FloatingActionButton />
    </div>
  );
}