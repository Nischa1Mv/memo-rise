import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsOpen }: NavbarProps) {
  return (
    <nav className="bg-transparent p-2 border-b-2 border-white">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          NoteApp
        </div>
        <div className="relative flex-grow mx-4">
          <Input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-white/20 dark:bg-black/20 backdrop-blur-sm text-gray-900 dark:text-gray-100"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <Avatar className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
