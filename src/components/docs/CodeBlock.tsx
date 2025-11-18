import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  // Map language names to syntax highlighter supported names
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'python': 'python',
    'bash': 'bash',
    'http': 'http',
    'json': 'json',
  };

  const highlighterLanguage = languageMap[language] || 'text';

  const customStyle = {
    margin: 0,
    padding: '1rem',
    background: '#0a0b0e',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace',
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

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <SyntaxHighlighter
            language={highlighterLanguage}
            style={vscDarkPlus}
            customStyle={customStyle}
            showLineNumbers={showLineNumbers}
            wrapLines={false}
            codeTagProps={{
              style: {
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace',
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
