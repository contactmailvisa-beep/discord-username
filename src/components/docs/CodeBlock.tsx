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

  const highlightCode = (code: string, lang: string) => {
    const lines = code.split('\n');
    
    return lines.map((line, index) => {
      let highlightedLine = line;
      
      // HTTP highlighting
      if (lang === 'http') {
        highlightedLine = line
          .replace(/^(GET|POST|PUT|DELETE|PATCH)/g, '<span class="text-[#22c55e] font-bold">$1</span>')
          .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-[#3b82f6]">$1</span>')
          .replace(/^([A-Za-z-]+):/g, '<span class="text-[#a855f7]">$1</span>:')
          .replace(/HTTP\/[\d.]+/g, '<span class="text-[#f59e0b]">$&</span>');
      }
      
      // JSON highlighting
      else if (lang === 'json') {
        highlightedLine = line
          .replace(/"([^"]+)":/g, '<span class="text-[#3b82f6]">"$1"</span>:')
          .replace(/:\s*"([^"]*)"/g, ': <span class="text-[#22c55e]">"$1"</span>')
          .replace(/:\s*(true|false|null)/g, ': <span class="text-[#f59e0b]">$1</span>')
          .replace(/:\s*(\d+)/g, ': <span class="text-[#f59e0b]">$1</span>');
      }
      
      // JavaScript highlighting
      else if (lang === 'javascript') {
        highlightedLine = line
          .replace(/\b(const|let|var|function|async|await|return|if|else|for|while|try|catch|import|from|require)\b/g, '<span class="text-[#a855f7]">$1</span>')
          .replace(/\b(fetch|console|JSON)\b/g, '<span class="text-[#3b82f6]">$1</span>')
          .replace(/'([^']*)'/g, '<span class="text-[#22c55e]">\'$1\'</span>')
          .replace(/"([^"]*)"/g, '<span class="text-[#22c55e]">"$1"</span>')
          .replace(/`([^`]*)`/g, '<span class="text-[#22c55e]">`$1`</span>');
      }
      
      // Python highlighting
      else if (lang === 'python') {
        highlightedLine = line
          .replace(/\b(import|from|def|class|if|else|elif|for|while|try|except|return|async|await)\b/g, '<span class="text-[#a855f7]">$1</span>')
          .replace(/\b(requests|json|print|str|int|dict|list)\b/g, '<span class="text-[#3b82f6]">$1</span>')
          .replace(/'([^']*)'/g, '<span class="text-[#22c55e]">\'$1\'</span>')
          .replace(/"([^"]*)"/g, '<span class="text-[#22c55e]">"$1"</span>');
      }
      
      // Bash/cURL highlighting
      else if (lang === 'bash') {
        highlightedLine = line
          .replace(/\b(curl)\b/g, '<span class="text-[#22c55e] font-bold">$1</span>')
          .replace(/(-[A-Za-z])\b/g, '<span class="text-[#a855f7]">$1</span>')
          .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-[#3b82f6]">$1</span>')
          .replace(/"([^"]*)"/g, '<span class="text-[#f59e0b]">"$1"</span>')
          .replace(/'([^']*)'/g, '<span class="text-[#f59e0b]">\'$1\'</span>');
      }
      
      return (
        <div key={index} className="table-row">
          {showLineNumbers && (
            <span className="table-cell pr-4 text-[#52525b] select-none text-right">
              {index + 1}
            </span>
          )}
          <span 
            className="table-cell"
            dangerouslySetInnerHTML={{ __html: highlightedLine || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-[#1a1c20] bg-[#0a0b0e]">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1c20] border-b border-[#27272a]">
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs text-[#a1a1aa] uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-[#1a1c20] text-white"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#22c55e]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        <div className="p-4 overflow-x-auto overflow-y-auto max-h-[500px]">
          <code className={cn(
            "font-mono text-sm table w-full",
            showLineNumbers && "table"
          )}>
            {highlightCode(code, language)}
          </code>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
