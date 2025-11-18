import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

const CodeBlock = ({ code, language, title, showLineNumbers = false }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-background-tertiary">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-accent border-b border-border">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        <pre className={cn(
          "p-4 overflow-x-auto text-sm",
          showLineNumbers && "pl-12"
        )}>
          <code className="text-foreground font-mono">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
