"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/ui/loader";
import { set } from "lodash";

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
  const [changesAt, setChangesAt] = useState(0);
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

  useEffect(() => {
    if (isLoader) {
      setChangesAt(0);
    } else {
      // Calculate initial time difference when loading is done
      const calculateTimeDiff = () => {
        const updatedTime = new Date(updatedAt).getTime();
        const currentTime = new Date().getTime();
        const diffInSeconds = Math.floor((currentTime - updatedTime) / 1000);
        return diffInSeconds;
      };

      // Set initial time difference
      setChangesAt(calculateTimeDiff());

      // Update time difference every second
      const interval = setInterval(() => {
        setChangesAt(calculateTimeDiff());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoader, updatedAt]);

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "Just now";

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

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
            <span className="italic">{formatTime(changesAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
