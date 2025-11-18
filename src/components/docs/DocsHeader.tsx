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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
              <span className="text-xl font-bold bg-gradient-to-r from-blurple to-text-link bg-clip-text text-transparent">
                DUC Docs
              </span>
              <span className="text-xs text-muted-foreground">
                API Documentation
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search docs..."
              className="w-64 pl-9 bg-background-secondary border-border"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          <Link to="/dashboard">
            <Button variant="default" size="sm" className="gap-2">
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
