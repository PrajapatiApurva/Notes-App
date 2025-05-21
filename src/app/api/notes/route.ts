// src/app/api/notes/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Note } from '@/app/lib/types';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data', 'notes.json');

// Helper function to read the notes data
function readNotesFile() {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty notes array
    console.error('Error reading notes file:', error);
    return { notes: [] };
  }
}

// Helper function to write notes data
function writeNotesFile(data: { notes: Note[] }) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all notes
export async function GET() {
  try {
    const data = readNotesFile();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch notes, Error: ${error}` },
      { status: 500 }
    );
  }
}

// POST: Create a new note
export async function POST(request: Request) {
  try {
    console.log('Reading request body');
    const body = await request.json();
    const { title, content, tags } = body;

    // Input validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Process tags (convert comma-separated string to array if needed)
    const processedTags = Array.isArray(tags) 
      ? tags 
      : typeof tags === 'string'
        ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

    // Read existing notes
    const data = readNotesFile();

    // Create new note
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tags: processedTags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add new note to array
    data.notes.push(newNote);

    // Write updated data back to file
    writeNotesFile(data);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}