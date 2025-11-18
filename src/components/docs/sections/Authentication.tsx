import { Key, Shield, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import CodeBlock from "../CodeBlock";

const Authentication = () => {
  const headerExample = `// Required Headers for API Requests
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': 'duc_your_api_key_here',  // Your API Key
  'x-token-name': 'your_token_name'       // Your Discord Token Name
};`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Authentication</h1>
        <p className="text-lg text-[#a1a1aa]">
          Learn how to authenticate your API requests using API keys and token names.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-3 border-[#1a1c20] bg-[#13141a]">
          <div className="p-3 rounded-lg bg-[#22c55e]/10 text-[#22c55e] w-fit">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">API Keys</h3>
          <p className="text-sm text-[#a1a1aa]">
            Unique identifiers that authenticate your account and track usage
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-[#1a1c20] bg-[#13141a]">
          <div className="p-3 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] w-fit">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Token Names</h3>
          <p className="text-sm text-[#a1a1aa]">
            Reference to your Discord tokens used for checking usernames
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-[#1a1c20] bg-[#13141a]">
          <div className="p-3 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] w-fit">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Secure Headers</h3>
          <p className="text-sm text-[#a1a1aa]">
            All credentials passed securely via HTTP headers
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Required Headers</h2>
        <p className="text-[#a1a1aa]">
          Every API request must include these authentication headers:
        </p>
        <CodeBlock
          code={headerExample}
          language="javascript"
          title="Authentication Headers"
        />
      </div>

      <div className="bg-[#13141a] border border-[#1a1c20] rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Header Breakdown</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-[#22c55e] pl-4">
            <h4 className="font-semibold text-white mb-1">x-api-key</h4>
            <p className="text-sm text-[#a1a1aa]">
              Your unique API key generated from the Profile dashboard. Format: <code className="text-[#22c55e] bg-[#0a0b0e] px-2 py-1 rounded">duc_xxxxxxxxxxxxx</code>
            </p>
          </div>

          <div className="border-l-4 border-[#3b82f6] pl-4">
            <h4 className="font-semibold text-white mb-1">x-token-name</h4>
            <p className="text-sm text-[#a1a1aa]">
              The name of the Discord token you want to use for checking. This must match a token you've added in your Tokens section.
            </p>
          </div>

          <div className="border-l-4 border-[#f59e0b] pl-4">
            <h4 className="font-semibold text-white mb-1">Content-Type</h4>
            <p className="text-sm text-[#a1a1aa]">
              Must be set to <code className="text-[#22c55e] bg-[#0a0b0e] px-2 py-1 rounded">application/json</code> for all POST requests.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#ef4444]" />
          Security Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-[#a1a1aa]">
          <li>• Never expose your API key in client-side code or public repositories</li>
          <li>• Store API keys in environment variables or secure secrets management</li>
          <li>• Rotate your API keys regularly using the Reset function</li>
          <li>• Use different API keys for different applications or environments</li>
          <li>• Monitor your API usage for suspicious activity</li>
        </ul>
      </div>
    </div>
  );
};

export default Authentication;
