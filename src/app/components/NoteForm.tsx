// src/app/components/NoteForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Note } from "../lib/types";

interface NoteFormProps {
  note?: Note; // Optional for editing mode
  mode: "create" | "edit";
}

export default function NoteForm({ note, mode }: NoteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If in edit mode and note is provided, populate the form
  useEffect(() => {
    if (mode === "edit" && note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags.join(", "),
      });
    }
  }, [mode, note]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { title, content, tags } = formData;
      console.log("Form data:", formData);
      // Basic validation
      if (!title.trim() || !content.trim()) {
        setError("Title and content are required");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim(),
      };

      let response;

      if (mode === "create") {
        // Create new note
        console.log('noteData:', noteData);
        response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
      } else if (mode === "edit" && note) {
        // Update existing note
        response = await fetch(`/api/notes/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
      }

      if (response && response.ok) {
        // Redirect to dashboard on success
        console.log("Note saved successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        console.log("Failed to save note:", response);
        let data = null;
        try {
          const text = await response?.text();
          data = text ? JSON.parse(text) : null;
        } catch (err) {
          console.error("Failed to parse JSON response:", err);
        }
        console.error("API Error:", data);
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        "An error occurred while saving the note. Please check the console for details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter note title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Content Field */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your note here..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          required
        />
      </div>

      {/* Tags Field */}
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate tags with commas (e.g., personal, work, ideas)
        </p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Note"
            : "Update Note"}
        </button>
      </div>
    </form>
  );
}
