import { useState } from "react";
import { Book, Code, Key, Shield, Zap, Database, Bell, GitBranch, Activity, Settings as SettingsIcon, Terminal, FileCode, Webhook, Lock, TrendingUp, Clock, AlertCircle } from "lucide-react";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsHeader from "@/components/docs/DocsHeader";
import Introduction from "@/components/docs/sections/Introduction";
import QuickStart from "@/components/docs/sections/QuickStart";
import Authentication from "@/components/docs/sections/Authentication";
import ApiEndpoints from "@/components/docs/sections/ApiEndpoints";
import CodeExamples from "@/components/docs/sections/CodeExamples";
import RateLimits from "@/components/docs/sections/RateLimits";
import ErrorHandling from "@/components/docs/sections/ErrorHandling";
import BestPractices from "@/components/docs/sections/BestPractices";
import ResponseFormats from "@/components/docs/sections/ResponseFormats";
import WebhooksGuide from "@/components/docs/sections/WebhooksGuide";
import SecurityGuide from "@/components/docs/sections/SecurityGuide";
import UsageAnalytics from "@/components/docs/sections/UsageAnalytics";
import PremiumFeatures from "@/components/docs/sections/PremiumFeatures";
import TroubleShooting from "@/components/docs/sections/TroubleShooting";
import ApiReference from "@/components/docs/sections/ApiReference";
import SdkLibraries from "@/components/docs/sections/SdkLibraries";
import Changelog from "@/components/docs/sections/Changelog";
import Support from "@/components/docs/sections/Support";

export interface NavSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections?: { id: string; title: string }[];
}

const Docs = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{id: string, title: string, preview: string}[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Book className="w-4 h-4" />
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: <Key className="w-4 h-4" />
    },
    {
      id: "api-endpoints",
      title: "API Endpoints",
      icon: <Terminal className="w-4 h-4" />
    },
    {
      id: "error-handling",
      title: "Error Handling",
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: "rate-limits",
      title: "Rate Limits",
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: "support",
      title: "Support",
      icon: <Activity className="w-4 h-4" />
    }
  ];

  const searchableContent = [
    { id: "introduction", title: "Introduction", content: "Discord Username Checker API documentation getting started overview features" },
    { id: "authentication", title: "Authentication", content: "API key authentication token bearer header authorization security" },
    { id: "api-endpoints", title: "API Endpoints", content: "check username endpoint POST request response available taken" },
    { id: "error-handling", title: "Error Handling", content: "errors status codes 400 401 403 429 500 rate limit" },
    { id: "rate-limits", title: "Rate Limits", content: "limits free premium requests per day 50 100 throttling" },
    { id: "support", title: "Support", content: "help contact support discord community assistance" }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchableContent
      .filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.content.toLowerCase().includes(lowerQuery)
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        preview: item.content.substring(0, 80) + "..."
      }))
      .slice(0, 5);

    setSearchResults(results);
    setIsSearchOpen(results.length > 0);
  };

  const handleResultClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "introduction":
        return <Introduction />;
      case "authentication":
        return <Authentication />;
      case "api-endpoints":
        return <ApiEndpoints />;
      case "error-handling":
        return <ErrorHandling />;
      case "rate-limits":
        return <RateLimits />;
      case "support":
        return <Support />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex flex-col">
      <DocsHeader 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchResults={searchResults}
        isSearchOpen={isSearchOpen}
        onResultClick={handleResultClick}
        onSearchClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
      />
      
      <div className="flex flex-1">
        <DocsSidebar
          navSections={navSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-[280px] overflow-y-auto bg-[#0a0b0e]">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
