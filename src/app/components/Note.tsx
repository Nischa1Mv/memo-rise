"use client";
import { use, useEffect, useRef, useState } from "react";
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

  const [timeAgo, setTimeAgo] = useState<string>("");

  const getTimeAgo = (time: string): string => {
    const now = new Date();
    const past = new Date(time);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  useEffect(() => {
    const update = () => setTimeAgo(getTimeAgo(updatedAt));
    update(); // initial update
    const interval = setInterval(update, 60000); // update every 1 minute
    return () => clearInterval(interval);
  }, [updatedAt]);

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
        <div className="flex justify-between items-center pt-2 ">
          <button
            onClick={handleSave}
            className="text-sm px-4 py-2 rounded-full bg-black text-white font-semibold 
  hover:bg-white hover:text-black border border-white transition-all duration-300 
  ease-in-out shadow-md hover:shadow-lg scale-100 hover:scale-105"
          >
            Save
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            {isLoader && <Loader />}
            <span className="italic">{timeAgo || "Just now"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
