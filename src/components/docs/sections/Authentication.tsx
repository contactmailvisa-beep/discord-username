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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Authentication</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to authenticate your API requests using API keys and token names.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-3 border-border">
          <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Unique identifiers that authenticate your account and track usage
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-border">
          <div className="p-3 rounded-lg bg-success/10 text-success w-fit">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Token Names</h3>
          <p className="text-sm text-muted-foreground">
            Reference to your Discord tokens used for checking usernames
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-border">
          <div className="p-3 rounded-lg bg-warning/10 text-warning w-fit">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Secure Headers</h3>
          <p className="text-sm text-muted-foreground">
            All credentials passed securely via HTTP headers
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Required Headers</h2>
        <p className="text-muted-foreground">
          Every API request must include these authentication headers:
        </p>
        <CodeBlock
          code={headerExample}
          language="javascript"
          title="Authentication Headers"
        />
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Header Breakdown</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold text-foreground mb-1">x-api-key</h4>
            <p className="text-sm text-muted-foreground">
              Your unique API key generated from the Profile dashboard. Format: <code className="text-primary">duc_xxxxxxxxxxxxx</code>
            </p>
          </div>

          <div className="border-l-4 border-success pl-4">
            <h4 className="font-semibold text-foreground mb-1">x-token-name</h4>
            <p className="text-sm text-muted-foreground">
              The name of the Discord token you want to use for checking. This must match a token you've added in your Tokens section.
            </p>
          </div>

          <div className="border-l-4 border-text-link pl-4">
            <h4 className="font-semibold text-foreground mb-1">Content-Type</h4>
            <p className="text-sm text-muted-foreground">
              Must be set to <code className="text-primary">application/json</code> for all POST requests.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-destructive" />
          Security Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
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
