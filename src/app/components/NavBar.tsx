import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsOpen }: NavbarProps) {
  return (
    <nav className="bg-background/20 backdrop-blur-sm p-2 border-b border-border">
      <div className="container max-w-[1000px] mx-auto py-2 flex items-center xl:gap-6 gap-1 ">
        <div className="md:text-4xl text-2xl font-bold text-primary">
          MemoRise
        </div>
        <div className="relative md:flex flex-grow mx-4 ">
          <Input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-background/50 py-3 backdrop-blur-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Avatar
          className="cursor-pointer ring-offset-background transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-2"
          onClick={() => setIsOpen(true)}
        >
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-muted text-muted-foreground">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
