// src/app/api/notes/[id]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Note } from '@/app/lib/types';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data', 'notes.json');

// Helper function to read the notes data
function readNotesFile() {
  try {
    // Check if file exists
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // Create directory if it doesn't exist
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Create empty notes file
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ notes: [] }, null, 2), 'utf8');
      return { notes: [] };
    }
    
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data || '{"notes":[]}');
  } catch (error) {
    console.error('Error reading notes file:', error);
    // If file doesn't exist or is empty, return empty notes array
    return { notes: [] };
  }
}

// Helper function to write notes data
function writeNotesFile(data: { notes: Note[] }) {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to notes file:', error);
    throw new Error('Failed to write to notes file');
  }
}

// GET a single note by ID
export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    const id = params.id;
    const data = readNotesFile();
    const note = data.notes.find((note: Note) => note.id === id);

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error); 
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT: Update a note by ID
export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { title, content, tags } = body;

    // Input validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Process tags
    const processedTags = Array.isArray(tags) 
      ? tags 
      : typeof tags === 'string'
        ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

    // Read existing notes
    const data = readNotesFile();
    
    // Find the note index
    const noteIndex = data.notes.findIndex((note: Note) => note.id === id);

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Update the note
    const updatedNote: Note = {
      ...data.notes[noteIndex],
      title,
      content,
      tags: processedTags,
      updatedAt: new Date().toISOString(),
    };

    data.notes[noteIndex] = updatedNote;

    // Write updated data back to file
    writeNotesFile(data);

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a note by ID
export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  try {
    const id = params.id;
    
    // Read existing notes
    const data = readNotesFile();
    
    // Find the note index
    const noteIndex = data.notes.findIndex((note: Note) => note.id === id);

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Remove the note
    data.notes.splice(noteIndex, 1);

    // Write updated data back to file
    writeNotesFile(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}