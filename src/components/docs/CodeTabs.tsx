import { useState } from "react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
  title?: string;
}

const CodeTabs = ({ examples, title }: CodeTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-3">
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      
      <div className="rounded-lg border border-[#1a1c20] bg-[#13141a] overflow-hidden">
        <div className="flex items-center gap-1 p-1 bg-[#1a1c20] border-b border-[#27272a] overflow-x-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                activeTab === index
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
              )}
            >
              {example.label}
            </button>
          ))}
        </div>
        
        <div className="animate-in fade-in duration-300">
          <CodeBlock
            code={examples[activeTab].code}
            language={examples[activeTab].language}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeTabs;
