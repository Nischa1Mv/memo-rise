"use client";

import { useState } from "react";
import Layout from "./components/Layout";
import Navbar from "./components/NavBar";
import Note from "./components/Note";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NoteData {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const [notes, setNotes] = useState<NoteData[]>([
    { id: 1, title: "First Note", content: "This is your first note!" },
  ]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: number, title: string, content: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, title, content } : note))
    );
  };
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <Layout>
      <Navbar setIsOpen={setIsOpen} />
      <main className="px-8 py-4 ">
        <div className="grid grid-cols-4 w-fit flex-wrap justify-center gap-6 mx-auto">
          {notes.map((note) => (
            <Note key={note.id} {...note} onUpdate={updateNote} />
          ))}
        </div>
        <Button
          onClick={addNote}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0"
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
              <div className="flex flex-col justify-center gap-4 py-4 w-full">
                <div className="w-[90%] mx-auto">
                  <Label className="font-medium text-lg" htmlFor="email">
                    Your email address
                  </Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="repeat password"
                      className="bg-transparent w-full rounded-none p-2 px-3 text-lg font-semibold mb-1 focus:outline-none placeholder-gray-500"
                    />
                  </div>
                )}

                <Button className="w-[80%] mx-auto">
                  {isLogin ? "Login" : "Signup"}
                </Button>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
