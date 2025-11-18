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
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
      
      <div className="rounded-lg border border-border bg-background-secondary overflow-hidden">
        <div className="flex items-center gap-1 p-1 bg-background-accent border-b border-border overflow-x-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                activeTab === index
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
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
