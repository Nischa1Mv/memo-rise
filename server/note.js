import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Title Here",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      default: "Enter your Content here",
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Use existing model if it exists, otherwise create a new one
const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
