"use client";

import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Navbar from "./components/NavBar";
import Note from "./components/Note";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NoteData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const addNote = () => {
    const newNote = {
      id: crypto.randomUUID(), // Using crypto.randomUUID() for secure unique IDs
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
  };

  const saveToLocalStorage = (updatedNotes: NoteData[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const updateNote = (id: string, title: string, content: string) => {
    setIsLoader(true); // Start the loader before storage
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title, content } : note
    );
    setNotes(updatedNotes);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  // const [isDisabled, setIsDisabled] = useState(false);

  const handleSignup = async () => {
    setIsLoader(true);
    try {
      const response = await axios.post("/api/signup", {
        email: user.email,
        password: user.password,
      });
      if (response.status === 200) {
        toast.success("user created successfully");
        setIsOpen(false);
        setUser({ email: "", password: "" });
        setRepeatPassword("");
      } else {
        toast.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Authentication failed");
    } finally {
      setIsLoader(false);
    }
  };

  const handleLogin = async () => {
    setIsLoader(true);
    try {
      const response = await axios.post("/api/login", {
        email: user.email,
        password: user.password,
      });
      if (response.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        setIsOpen(false);
        setUser({ email: "", password: "" });
        setRepeatPassword("");
      } else {
        toast.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Authentication failed");
    } finally {
      setIsLoader(false);
    }
  };

  //fetches the notes from local storage when the component mounts
  useEffect(() => {
    getNotes();
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(notes);
  }, [notes]);

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/getNotes", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.data.Notes) {
        const formattedNotes = response.data.Notes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        }));
        console.log("Fetched notes:", formattedNotes);
        setNotes(formattedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const deleteNote = async (id: string) => {
    await axios.delete("/api/deleteNote", {
      data: { id: id },
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    const updatedNotes = notes.filter((note: NoteData) => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <Layout>
      <Navbar setIsOpen={setIsOpen} />
      <main className="px-8 py-4 ">
        {" "}
        <div
          className={` ${
            notes?.length === 0 ? "flex" : "grid grid-cols-4"
          } w-fit flex-wrap justify-center gap-6 mx-auto `}
        >
          {notes?.length === 0 ? (
            <div className="w-full flex justify-center items-center text-[rgba(255,255,255,0.2)] font-semibold text-xl tracking-wide">
              Click on the add{" "}
              <span
                className="font-bold text-white px-2 cursor-pointer "
                onClick={addNote}
              >
                +{" "}
              </span>
              icon to add new notes
            </div>
          ) : (
            notes.map((note) => (
              <Note
                updatedAt={note.updatedAt}
                createdAt={note.createdAt}
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                onUpdate={updateNote}
                deleteNote={deleteNote}
              />
            ))
          )}
        </div>
        <Button
          onClick={addNote}
          className="fixed bottom-8  flex flex-col right-8 rounded-full w-12 h-12 p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </main>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger></SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="text-2xl px-10">
              <div className="flex w-full justify-between">
                <div
                  onClick={() => {
                    setIsLogin(true);
                  }}
                  className={`${
                    isLogin ? "text-white" : "text-gray-400"
                  } cursor-pointer`}
                >
                  Login
                </div>
                <div
                  onClick={() => {
                    setIsLogin(false);
                  }}
                  className={`${
                    !isLogin ? "text-white" : "text-gray-400"
                  } cursor-pointer`}
                >
                  Signup
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>
              <form className="flex flex-col justify-center gap-4 py-4 w-full">
                <div className="w-[90%] mx-auto">
                  <Label className="font-medium text-lg" htmlFor="email">
                    Your email address
                  </Label>
                  <Input
                    type="text"
                    value={user.email}
                    required
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    placeholder="email"
                    className="bg-transparent text-lg w-full rounded-none p-2 px-3 font-semibold mb-1 focus:outline-none placeholder-gray-500"
                  />
                </div>
                <div className="w-[90%] mx-auto">
                  <Label className="font-medium text-lg" htmlFor="password">
                    Your password
                  </Label>
                  <Input
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    required
                    placeholder="password"
                    className="bg-transparent w-full rounded-none p-2 px-3 text-lg font-semibold mb-1 focus:outline-none placeholder-gray-500"
                  />
                </div>

                {!isLogin && (
                  <div className="w-[90%] mx-auto">
                    <Label
                      className="font-medium text-lg"
                      htmlFor="repeatPassword"
                    >
                      Repeat password
                    </Label>
                    <Input
                      type="password"
                      value={repeatPassword}
                      required
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="repeat password"
                      className="bg-transparent w-full rounded-none p-2 px-3 text-lg font-semibold mb-1 focus:outline-none placeholder-gray-500"
                    />
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (isLogin) {
                      handleLogin();
                    } else {
                      handleSignup();
                    }
                  }}
                  className="w-[80%] mx-auto"
                >
                  {isLogin ? "Login" : "Signup"}
                </Button>
              </form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
