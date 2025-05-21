// src/app/components/NoteCard.tsx
'use client';

import { Note } from '../lib/types';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  // Truncate content if it's too long
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Format the date to be more user-friendly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(note)}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h3>
      <p className="text-gray-600 mb-4">{truncateText(note.content, 100)}</p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {note.tags.map((tag, index) => (
          <span 
            key={index} 
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Date */}
      <p className="text-xs text-gray-500">
        Updated: {formatDate(note.updatedAt)}
      </p>
    </div>
  );
}