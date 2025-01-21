import { useState } from "react";
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
}

export default function Note({ id, title, content, onUpdate }: NoteProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteContent, setNoteContent] = useState(content);


  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setNoteTitle(newTitle);
    onUpdate(id, newTitle, noteContent);
  
    debounceSave();
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    onUpdate(id, noteTitle, newContent);
  
    debounceSave();
  };
  
  const debounceSave = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear any existing timeout
    }
    debounceTimeout = setTimeout(() => {
      handleSave(); // Call the save function after a delay
      debounceTimeout = null; // Reset the timeout
    }, 500); // Adjust the delay (in milliseconds) as needed
  };
  
  const handleSave = async() => {
    try{
    const response = await axios.post("/api/notes", {title , content});
    if(response.status===200) toast.success("Note saved successfully");
    
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }


  };

  return (
    <Card
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 5px 10px 0 rgba(225, 225, 225, 0.57)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)", // 'webkit' should be capitalized here
        borderRadius: "10px",
      }}
      className="border  p-2 w-72 h-80 border-gray-300 bg-white/40 dark:bg-black/10 backdrop-blur-sm shadow-lg hover:border-white/100 hover:transition-colors "
    >
      <CardContent className="p-2 flex flex-col h-full ">
        <Input
          type="text"
          value={noteTitle}
          onChange={handleTitleChange}
          placeholder="Title"
          className="bg-transparent rounded-none p-2 text-sm font-semibold mb-1 focus:outline-none  placeholder-gray-500"
        />
        <Textarea
          value={noteContent}
          onChange={handleContentChange}
          placeholder="Note content"
          className="bg-transparent  px-2 py-4 h-full border-0 text-ellipsis text-xs min-h-full  placeholder-gray-500"
        />
      </CardContent>
    </Card>
  );
}
