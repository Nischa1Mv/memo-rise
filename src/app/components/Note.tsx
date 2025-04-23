import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/ui/loader";

interface NoteProps {
  updatedAt: string;
  createdAt: string;
  id: string;
  title: string;
  content: string;
  onUpdate: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  isLoader: boolean;
}

export default function Note({
  updatedAt,
  createdAt,
  id,
  title,
  content,
  onUpdate,
  deleteNote,
  isLoader,
}: NoteProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteContent, setNoteContent] = useState(content);
  const isMounted = useRef(false);

  const prevTitleRef = useRef(noteTitle);
  const prevContentRef = useRef(noteContent);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const updatedTitle = noteTitle.trim() === "" ? "Untitled" : noteTitle;
    const updatedContent =
      noteContent.trim() === "" ? "Empty content" : noteContent;

    // Only trigger update if the title or content has actually changed
    if (
      prevTitleRef.current !== updatedTitle ||
      prevContentRef.current !== updatedContent
    ) {
      const debounceTimeout = setTimeout(() => {
        onUpdate(id, updatedTitle, updatedContent);
      }, 1000);

      prevTitleRef.current = updatedTitle;
      prevContentRef.current = updatedContent;

      return () => clearTimeout(debounceTimeout);
    }
  }, [noteTitle, noteContent, id, onUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
  };

  const handleSave = () => {
    const updatedTitle = noteTitle.trim() === "" ? "Untitled" : noteTitle;
    const updatedContent =
      noteContent.trim() === "" ? "Empty content" : noteContent;

    onUpdate(id, updatedTitle, updatedContent);
  };

  return (
    <Card
      style={{
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
            required
            type="text"
            value={noteTitle}
            onChange={handleTitleChange}
            placeholder="Title"
            className="bg-transparent rounded-none tracking-widest p-2 text-sm font-semibold mb-1 focus:outline-none placeholder-gray-500"
          />
          <div
            className="text-xl font-semibold cursor-pointer hover:text-white text-gray-700 hover:scale-140"
            onClick={() => deleteNote(id)}
            aria-label="Delete note"
          >
            <sup>x</sup>
          </div>
        </div>

        <Textarea
          required
          value={noteContent}
          onChange={handleContentChange}
          placeholder="Note content"
          className="bg-transparent px-2 py-4 tracking-widest text-ellipsis text-xs placeholder-gray-500 grow"
        />
        <div
          onClick={handleSave}
          className="relative flex justify-between items-end"
        >
          <button className="bg-neutral-800 text-white rounded-full px-4 py-2 text-sm mt-2 hover:bg-neutral-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300 dark:focus:ring-neutral-400">
            Save
          </button>
          {isLoader && <Loader />}
        </div>
      </CardContent>
    </Card>
  );
}
