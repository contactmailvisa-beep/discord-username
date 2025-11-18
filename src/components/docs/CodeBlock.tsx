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
          .replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g, '<span class="text-[#22c55e] font-bold">$1</span>')
          .replace(/HTTP\/[\d.]+/g, '<span class="text-[#f59e0b]">$&</span>')
          .replace(/^([A-Za-z-]+):/g, '<span class="text-[#a855f7]">$1</span>:')
          .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-[#60a5fa]">$1</span>');
      }
      
      // JSON highlighting
      else if (lang === 'json') {
        // Escape HTML in the line first to prevent injection
        let escapedLine = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        
        highlightedLine = escapedLine
          // Property keys
          .replace(/"([^"]+)"(\s*):/g, '<span class="text-[#60a5fa]">"$1"</span>$2:')
          // String values
          .replace(/:\s*"([^"]*)"/g, ': <span class="text-[#22c55e]">"$1"</span>')
          // Boolean and null
          .replace(/:\s*(true|false|null)\b/g, ': <span class="text-[#f59e0b]">$1</span>')
          // Numbers
          .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-[#f59e0b]">$1</span>')
          // Brackets and braces
          .replace(/([{}\[\]])/g, '<span class="text-[#e5e7eb]">$1</span>')
          // Commas
          .replace(/,/g, '<span class="text-[#6b7280]">,</span>');
      }
      
      // JavaScript highlighting
      else if (lang === 'javascript') {
        highlightedLine = line
          // Keywords
          .replace(/\b(const|let|var|function|async|await|return|if|else|for|while|try|catch|import|from|require|new|class|extends|export|default)\b/g, '<span class="text-[#a855f7]">$1</span>')
          // Built-in objects/functions
          .replace(/\b(fetch|console|JSON|axios|require)\b/g, '<span class="text-[#60a5fa]">$1</span>')
          // Methods
          .replace(/\.(\w+)(?=\()/g, '.<span class="text-[#fbbf24]">$1</span>')
          // String literals (single quotes)
          .replace(/'([^']*)'/g, '<span class="text-[#22c55e]">\'$1\'</span>')
          // String literals (double quotes)  
          .replace(/"([^"]*)"/g, '<span class="text-[#22c55e]">"$1"</span>')
          // Template literals
          .replace(/`([^`]*)`/g, '<span class="text-[#22c55e]">`$1`</span>')
          // Comments
          .replace(/\/\/(.*)/g, '<span class="text-[#6b7280]">//$1</span>');
      }
      
      // Python highlighting
      else if (lang === 'python') {
        highlightedLine = line
          // Keywords
          .replace(/\b(import|from|def|class|if|else|elif|for|while|try|except|return|async|await|with|as|pass|break|continue|raise|finally)\b/g, '<span class="text-[#a855f7]">$1</span>')
          // Built-in functions
          .replace(/\b(requests|json|print|str|int|dict|list|len|range|open)\b/g, '<span class="text-[#60a5fa]">$1</span>')
          // Methods
          .replace(/\.(\w+)(?=\()/g, '.<span class="text-[#fbbf24]">$1</span>')
          // String literals (single quotes)
          .replace(/'([^']*)'/g, '<span class="text-[#22c55e]">\'$1\'</span>')
          // String literals (double quotes)
          .replace(/"([^"]*)"/g, '<span class="text-[#22c55e]">"$1"</span>')
          // Decorators
          .replace(/@(\w+)/g, '<span class="text-[#f59e0b]">@$1</span>')
          // Comments
          .replace(/#(.*)/g, '<span class="text-[#6b7280]">#$1</span>');
      }
      
      // Bash/cURL highlighting
      else if (lang === 'bash') {
        highlightedLine = line
          // Commands
          .replace(/\b(curl|wget|git|cd|ls|mkdir|rm|cp|mv|echo)\b/g, '<span class="text-[#22c55e] font-bold">$1</span>')
          // Flags
          .replace(/\s(-[A-Za-z]|--[\w-]+)\b/g, ' <span class="text-[#a855f7]">$1</span>')
          // URLs
          .replace(/(https?:\/\/[^\s\\]+)/g, '<span class="text-[#60a5fa]">$1</span>')
          // String literals (double quotes)
          .replace(/"([^"]*)"/g, '<span class="text-[#22c55e]">"$1"</span>')
          // String literals (single quotes)
          .replace(/'([^']*)'/g, '<span class="text-[#22c55e]">\'$1\'</span>')
          // Backslashes
          .replace(/\\\s*$/g, '<span class="text-[#6b7280]">\\</span>');
      }
      
      return (
        <div key={index} className="table-row">
          {showLineNumbers && (
            <span className="table-cell pr-4 text-[#52525b] select-none text-right">
              {index + 1}
            </span>
          )}
          <span 
            className="table-cell whitespace-pre"
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
            "font-mono text-[13px] leading-relaxed table w-full",
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
