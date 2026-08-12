import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 max-w-screen-md mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <Github className="h-6 w-6 text-gray-900" />
          <span className="font-bold text-gray-900 tracking-tight">GitHub Manager</span>
        </div>
        
        <div className="w-8 h-8 flex items-center justify-center">
          
        </div>
      </div>
    </header>
  );
}
