// src/app/create/page.tsx
import NoteForm from '../components/NoteForm';

export default function CreateNote() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Note</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <NoteForm mode="create" />
        </div>
      </main>
    </div>
  );
}