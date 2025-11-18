import { Menu, X, Search, Github, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ducLogo from "@/assets/duc-logo.png";
import { cn } from "@/lib/utils";

interface DocsHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: {id: string, title: string, preview: string}[];
  isSearchOpen: boolean;
  onResultClick: (sectionId: string) => void;
  onSearchClose: () => void;
}

const DocsHeader = ({ 
  onMenuClick, 
  isSidebarOpen, 
  searchQuery, 
  onSearchChange, 
  searchResults, 
  isSearchOpen,
  onResultClick,
  onSearchClose
}: DocsHeaderProps) => {
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a1a1aa] z-10" />
            <Input
              type="search"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery && onSearchChange(searchQuery)}
              className="w-64 pl-9 bg-[#1a1c20] border-[#27272a] text-white placeholder:text-[#71717a] focus:border-[#22c55e] transition-all"
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={onSearchClose}
                />
                
                {/* Results */}
                <div className="absolute top-full mt-2 w-96 bg-[#13141a] border border-[#22c55e]/30 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.4)] z-50 overflow-hidden animate-fade-in">
                  <div className="p-2 space-y-1">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => onResultClick(result.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all duration-200",
                          "hover:bg-[#22c55e]/10 hover:border-[#22c55e]/30 border border-transparent",
                          "group animate-fade-in"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white group-hover:text-[#22c55e] transition-colors">
                              {result.title}
                            </div>
                            <div className="text-sm text-[#a1a1aa] mt-1 line-clamp-2">
                              {result.preview}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 bg-[#1a1c20] border-t border-[#27272a] text-xs text-[#71717a] flex items-center justify-between">
                    <span>Press Enter to navigate</span>
                    <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </>
            )}

            {/* No Results */}
            {isSearchOpen && searchResults.length === 0 && searchQuery.trim().length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={onSearchClose}
                />
                <div className="absolute top-full mt-2 w-96 bg-[#13141a] border border-[#27272a] rounded-xl shadow-xl z-50 p-4 animate-fade-in">
                  <div className="text-center text-[#71717a]">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                  </div>
                </div>
              </>
            )}
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
