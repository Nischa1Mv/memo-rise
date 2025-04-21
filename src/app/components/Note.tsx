import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "react-toastify";

interface NoteProps {
  id: number;
  title: string;
  content: string;
  onUpdate: (id: number, title: string, content: string) => void;
  deleteNote: (id: number) => void;
}

export default function Note({
  id,
  title,
  content,
  onUpdate,
  deleteNote,
}: NoteProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteContent, setNoteContent] = useState(content);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onUpdate(id, noteTitle, noteContent);
      handleSave();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [noteTitle, noteContent]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
  };

  const handleSave = async () => {
    toast.success("Note saved successfully");
    console.log("Saving note:", { id, title: noteTitle, content: noteContent });
  };

  return (
    <Card
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 5px 10px 0 rgba(225, 225, 225, 0.57)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderRadius: "10px",
      }}
      className="border p-2 w-72 h-80 border-gray-300 bg-white/40 dark:bg-black/10 backdrop-blur-sm shadow-lg hover:border-white/100 hover:transition-colors"
    >
      <CardContent className="p-2 flex flex-col w-full h-full">
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            value={noteTitle}
            onChange={handleTitleChange}
            placeholder="Title"
            className="bg-transparent rounded-none tracking-widest p-2 text-sm font-semibold mb-1 focus:outline-none placeholder-gray-500"
          />
          <div
            className="text-xl font-semibold cursor-pointer hover:text-white text-gray-700 hover:scale-140"
            onClick={() => deleteNote(id)} // Fixed here
            aria-label="Delete note"
          >
            <sup>x</sup>
          </div>
        </div>

        <Textarea
          value={noteContent}
          onChange={handleContentChange}
          placeholder="Note content"
          className="bg-transparent px-2 py-4 tracking-widest text-ellipsis text-xs placeholder-gray-500 grow"
        />
        <div onClick={handleSave}>
          <button className="bg-blue-500 text-white rounded px-4 py-2 mt-2 hover:bg-blue-600 transition duration-200 ease-in-out">
            Save
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
