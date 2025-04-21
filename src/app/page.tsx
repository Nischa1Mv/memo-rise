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
import User from "../../server/User";
import { toast } from "react-toastify";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

interface NoteData {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const [notes, setNotes] = useState<NoteData[]>([]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      content: "",
    };
    setNotes([...notes, newNote]);
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
  };

  const saveToLocalStorage = (updatedNotes: NoteData[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const updateNote = (id: number, title: string, content: string) => {
    setIsLoader(true); // Start the loader before storage
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title, content } : note
    );
    setNotes(updatedNotes);
  };

  const router = useRouter();
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

  const handleAuth = async () => {
    if (isLogin) {
      try {
        if (user.email.length === 0 || user.password.length === 0) {
          setError(true);
          toast.error("Email or Password is empty");
          throw new Error("Email or Password is empty");
        }
        setError(false);
        //  setIsDisabled(true);
        setIsLoading(true);
        const response = await axios.post("/api/login", user);
        if (response.data.user.isProfile === true) {
          router.push("/profile");
          toast.success("User Needs to Complete Profile");
          return;
        }
        console.log("LoggedIn", response.data);
        router.push("/");
        toast.success("User Is Logged In");
      } catch (error: any) {
        if (error.response) {
          if (error.response.status == 400) {
            console.log("Please fill all the fields");
            toast.error("Please fill all the fields");
            setIsLoading(false);
          } else if (error.response.status == 404) {
            console.log("User with the email was not found");
            toast.error("User not found");
            setIsLoading(false);
          } else if (error.response.status == 401) {
            console.log("Invalid password");
            toast.error("Invalid password");
            setIsLoading(false);
          }
        } else {
          setError(true);
          console.log("coudnt sign up", error.message);
          toast.error("Something went wrong");
        }
      } finally {
        // setIsDisabled(false);
        setIsLoading(false);
      }
    }
    if (!isLogin) {
      if (user.password !== repeatPassword) {
        setError(true);
        toast.error("Passwords do not match");
        return;
      }
      try {
        if (user.password !== repeatPassword) {
          toast.error("Passwords do not match");
          throw new Error("Passwords do not match");
        }
        setIsLoading(true);
        // setIsDisabled(true);
        const response = await axios.post("/api/signup", user);
        console.log("signed up", response.data);
        router.push("/login");
        toast.success("Account Created Successfully");
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 400) {
            //if user already exists
            toast.error("User already exists");
            console.log("User already exists");
            setIsLoading(false);
          } else {
            console.log("Server Error: ", error.response.data.error);
            setIsLoading(false);
            toast.error("Something went wrong. Please try again later");
          }
        } else if (error.request) {
          console.log("No response received", error.request);
          toast.error("Network error. Please check your connection");
          setIsLoading(false);
        } else {
          console.log("Error setting up the request ", error.message);
          toast.error("Unexpected error occurred. Please try again.");
          setIsLoading(false);
        }
      }
    }
  };

  //fetches the notes from local storage when the component mounts
  useEffect(() => {
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

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <Layout>
      <Navbar setIsOpen={setIsOpen} />
      <main className="px-8 py-4 ">
        {" "}
        <div
          className={` ${
            notes.length === 0 ? "flex" : "grid grid-cols-4"
          } w-fit flex-wrap justify-center gap-6 mx-auto `}
        >
          {notes.length === 0 ? (
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
                key={note.id}
                {...note}
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
                    handleAuth();
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
