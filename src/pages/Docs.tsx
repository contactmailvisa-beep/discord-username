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
