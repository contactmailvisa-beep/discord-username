import { useState } from "react";
import { User, ChevronDown, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const UserEndpoint = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("HTTP");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = [
    { id: "HTTP", label: "HTTP" },
    { id: "cURL", label: "cURL" },
    { id: "JavaScript", label: "JavaScript" },
    { id: "Python", label: "Python" },
  ];

  const codeExamples: Record<string, { code: string; language: string }> = {
    HTTP: {
      language: "http",
      code: `GET /functions/v1/user HTTP/1.1
Host: srqqxvhbzuvfjexvbkbq.supabase.co
Content-Type: application/json
x-api-key: duc_your_api_key_here`
    },
    cURL: {
      language: "bash",
      code: `curl -X GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: duc_your_api_key_here"`
    },
    JavaScript: {
      language: "javascript",
      code: `const getUserInfo = async (apiKey) => {
  const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  });
  
  const data = await response.json();
  console.log('User Info:', data);
  return data;
};

// Usage
getUserInfo('duc_your_api_key_here');`
    },
    Python: {
      language: "python",
      code: `import requests

url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'duc_your_api_key_here'
}

response = requests.get(url, headers=headers)
data = response.json()
print('User Info:', data)`
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <User className="w-8 h-8" />
          Get User Information
        </h1>
        <p className="text-muted-foreground text-lg">
          Retrieve detailed account information including premium status and API usage statistics.
        </p>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              GET
            </Badge>
            <code className="ml-3 text-sm text-muted-foreground">
              /functions/v1/user
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            This endpoint returns comprehensive information about your account, including username, 
            creation date, premium status, and API usage statistics. Perfect for dashboard integrations 
            and account management features.
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Request Format
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="text-sm font-medium">{selectedLanguage}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-lg border border-border z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLanguage(lang.id);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/80 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <CodeBlock
          code={codeExamples[selectedLanguage].code}
          language={codeExamples[selectedLanguage].language}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Authorizations</h2>
        <Card className="p-4 bg-card border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">x-api-key</Badge>
              <span className="text-sm text-red-400">required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key for authentication
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Responses</h2>
        
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              200
            </Badge>
            <span className="text-sm font-medium">Success</span>
          </div>
          <CodeBlock
            language="json"
            code={`{
  "username": "your_username",
  "created_at": "2024-01-01T00:00:00Z",
  "avatar_url": "https://...",
  "is_premium": true,
  "premium_plan": "premium",
  "premium_expires": "2024-12-31T23:59:59Z",
  "api_stats": {
    "total_keys": 3,
    "active_keys": 2,
    "daily_limit": 100,
    "requests_today": 45,
    "requests_remaining": 55
  }
}`}
          />
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
              401
            </Badge>
            <span className="text-sm font-medium">Unauthorized</span>
          </div>
          <CodeBlock
            language="json"
            code={`{
  "error": "Invalid or inactive API key"
}`}
          />
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Response Fields</h2>
        <div className="space-y-3">
          <Card className="p-4 bg-card border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <code className="text-sm text-primary">username</code>
                <Badge variant="outline" className="text-xs">string</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Your account username</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <code className="text-sm text-primary">is_premium</code>
                <Badge variant="outline" className="text-xs">boolean</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Whether your account has premium status</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <code className="text-sm text-primary">api_stats</code>
                <Badge variant="outline" className="text-xs">object</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Detailed statistics about your API usage including total keys, active keys, 
                daily limit, and remaining requests
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserEndpoint;
