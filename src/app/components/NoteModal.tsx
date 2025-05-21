// src/app/components/NoteModal.tsx
"use client";

import { useState } from "react";
import { Note } from "../lib/types";
import { useRouter } from "next/navigation";

interface NoteModalProps {
  note: Note;
  onClose: () => void;
}

export default function NoteModal({ note, onClose }: NoteModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/edit/${note.id}`);
    onClose();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh(); // Refresh the page data
        onClose();
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date to be more user-friendly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Modal Header */}
        <div className="border-b px-6 py-3 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {note.tags.length > 0 ? (
                note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No tags</span>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="text-xs text-gray-500 mb-6">
            <p>Created: {formatDate(note.createdAt)}</p>
            <p>Updated: {formatDate(note.updatedAt)}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
