import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsOpen }: NavbarProps) {
  return (
    <nav className="bg-transparent p-2 ">
      <div className="container max-w-[1000px] mx-auto mb-4 flex items-center gap-6">
        <div className="text-4xl font-bold">NoteApp</div>
        <div className="relative flex-grow mx-4">
          <Input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-transparent py-2  backdrop-blur-sm border-none"
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
