import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../server/server";
import Note from "../../../../server/note";

connectDB();

export async function POST(request: NextRequest) {
  try {
    // Create a new note with empty fields
    const newNote = new Note({
      title: "",
      content: "",
    });

    // Save the new note to the database
    await newNote.save();

    // Return the ID of the newly created note
    return NextResponse.json({ noteID: newNote._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
