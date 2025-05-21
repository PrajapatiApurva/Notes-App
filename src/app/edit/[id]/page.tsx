// src/app/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NoteForm from '../../components/NoteForm';
import { Note } from '../../lib/types';

export default function EditNote() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the note data to edit
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${noteId}`);
        console.log('Response:', response);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Note not found');
          }
          throw new Error('Failed to fetch note');
        }
        
        const noteData = await response.json();
        setNote(noteData);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load the note. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  // If note doesn't exist, go back to dashboard
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Note</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
            <button 
              onClick={handleBackToDashboard}
              className="mt-2 text-sm underline text-red-700 hover:text-red-800"
            >
              Back to Dashboard
            </button>
          </div>
        ) : note ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <NoteForm mode="edit" note={note} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">Note not found.</p>
            <button
              onClick={handleBackToDashboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}