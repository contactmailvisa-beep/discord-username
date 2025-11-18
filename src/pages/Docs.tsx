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
      icon: <Book className="w-4 h-4" />,
      subsections: [
        { id: "overview", title: "Overview" },
        { id: "features", title: "Key Features" },
        { id: "getting-started", title: "Getting Started" }
      ]
    },
    {
      id: "quick-start",
      title: "Quick Start",
      icon: <Zap className="w-4 h-4" />,
      subsections: [
        { id: "create-account", title: "Create Account" },
        { id: "generate-key", title: "Generate API Key" },
        { id: "first-request", title: "First Request" }
      ]
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: <Key className="w-4 h-4" />,
      subsections: [
        { id: "api-keys", title: "API Keys" },
        { id: "token-names", title: "Token Names" },
        { id: "security-headers", title: "Security Headers" }
      ]
    },
    {
      id: "api-endpoints",
      title: "API Endpoints",
      icon: <Terminal className="w-4 h-4" />,
      subsections: [
        { id: "check-username", title: "Check Username" },
        { id: "bulk-check", title: "Bulk Check" },
        { id: "endpoint-params", title: "Parameters" }
      ]
    },
    {
      id: "code-examples",
      title: "Code Examples",
      icon: <Code className="w-4 h-4" />,
      subsections: [
        { id: "javascript", title: "JavaScript" },
        { id: "python", title: "Python" },
        { id: "discord-js", title: "Discord.js" },
        { id: "discord-py", title: "Discord.py" },
        { id: "curl", title: "cURL" }
      ]
    },
    {
      id: "rate-limits",
      title: "Rate Limits",
      icon: <Clock className="w-4 h-4" />,
      subsections: [
        { id: "limits-overview", title: "Overview" },
        { id: "free-plan", title: "Free Plan" },
        { id: "premium-plan", title: "Premium Plan" }
      ]
    },
    {
      id: "error-handling",
      title: "Error Handling",
      icon: <AlertCircle className="w-4 h-4" />,
      subsections: [
        { id: "status-codes", title: "Status Codes" },
        { id: "error-responses", title: "Error Responses" },
        { id: "retry-logic", title: "Retry Logic" }
      ]
    },
    {
      id: "response-formats",
      title: "Response Formats",
      icon: <FileCode className="w-4 h-4" />,
      subsections: [
        { id: "success-response", title: "Success Response" },
        { id: "error-format", title: "Error Format" },
        { id: "status-values", title: "Status Values" }
      ]
    },
    {
      id: "best-practices",
      title: "Best Practices",
      icon: <Shield className="w-4 h-4" />,
      subsections: [
        { id: "security", title: "Security" },
        { id: "performance", title: "Performance" },
        { id: "error-handling-bp", title: "Error Handling" }
      ]
    },
    {
      id: "webhooks",
      title: "Webhooks Guide",
      icon: <Webhook className="w-4 h-4" />,
      subsections: [
        { id: "webhook-setup", title: "Setup" },
        { id: "webhook-events", title: "Events" },
        { id: "webhook-security", title: "Security" }
      ]
    },
    {
      id: "security",
      title: "Security Guide",
      icon: <Lock className="w-4 h-4" />,
      subsections: [
        { id: "api-key-security", title: "API Key Security" },
        { id: "token-protection", title: "Token Protection" },
        { id: "best-security", title: "Best Practices" }
      ]
    },
    {
      id: "analytics",
      title: "Usage Analytics",
      icon: <Activity className="w-4 h-4" />,
      subsections: [
        { id: "dashboard", title: "Dashboard" },
        { id: "metrics", title: "Metrics" },
        { id: "reports", title: "Reports" }
      ]
    },
    {
      id: "premium",
      title: "Premium Features",
      icon: <TrendingUp className="w-4 h-4" />,
      subsections: [
        { id: "premium-overview", title: "Overview" },
        { id: "premium-limits", title: "Enhanced Limits" },
        { id: "premium-support", title: "Priority Support" }
      ]
    },
    {
      id: "sdk-libraries",
      title: "SDK & Libraries",
      icon: <Database className="w-4 h-4" />,
      subsections: [
        { id: "official-sdks", title: "Official SDKs" },
        { id: "community-libs", title: "Community Libraries" },
        { id: "wrappers", title: "API Wrappers" }
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <SettingsIcon className="w-4 h-4" />,
      subsections: [
        { id: "common-issues", title: "Common Issues" },
        { id: "debugging", title: "Debugging" },
        { id: "faq", title: "FAQ" }
      ]
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: <GitBranch className="w-4 h-4" />,
      subsections: [
        { id: "endpoints-ref", title: "Endpoints" },
        { id: "types-ref", title: "Types" },
        { id: "models-ref", title: "Models" }
      ]
    },
    {
      id: "changelog",
      title: "Changelog",
      icon: <Bell className="w-4 h-4" />,
      subsections: [
        { id: "latest-updates", title: "Latest Updates" },
        { id: "version-history", title: "Version History" }
      ]
    },
    {
      id: "support",
      title: "Support",
      icon: <Activity className="w-4 h-4" />,
      subsections: [
        { id: "contact", title: "Contact Us" },
        { id: "community", title: "Community" },
        { id: "resources", title: "Resources" }
      ]
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "introduction":
        return <Introduction />;
      case "quick-start":
        return <QuickStart />;
      case "authentication":
        return <Authentication />;
      case "api-endpoints":
        return <ApiEndpoints />;
      case "code-examples":
        return <CodeExamples />;
      case "rate-limits":
        return <RateLimits />;
      case "error-handling":
        return <ErrorHandling />;
      case "response-formats":
        return <ResponseFormats />;
      case "best-practices":
        return <BestPractices />;
      case "webhooks":
        return <WebhooksGuide />;
      case "security":
        return <SecurityGuide />;
      case "analytics":
        return <UsageAnalytics />;
      case "premium":
        return <PremiumFeatures />;
      case "sdk-libraries":
        return <SdkLibraries />;
      case "troubleshooting":
        return <TroubleShooting />;
      case "api-reference":
        return <ApiReference />;
      case "changelog":
        return <Changelog />;
      case "support":
        return <Support />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DocsHeader 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DocsSidebar
          navSections={navSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
