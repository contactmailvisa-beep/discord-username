import { Menu, X, Search, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ducLogo from "@/assets/duc-logo.png";

interface DocsHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const DocsHeader = ({ onMenuClick, isSidebarOpen }: DocsHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1c20] bg-[#13141a]">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-[#1a1c20]"
            onClick={onMenuClick}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={ducLogo} 
              alt="DUC Logo" 
              className="h-10 w-10 transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                DUC Docs
              </span>
              <span className="text-xs text-[#a1a1aa]">
                API Documentation
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a1a1aa]" />
            <Input
              type="search"
              placeholder="Search docs..."
              className="w-64 pl-9 bg-[#1a1c20] border-[#27272a] text-white placeholder:text-[#71717a]"
            />
          </div>

          <Link to="/dashboard">
            <Button className="gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white">
              <span className="hidden sm:inline">Dashboard</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DocsHeader;
