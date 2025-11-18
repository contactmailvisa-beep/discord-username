import { Terminal, Send, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const ApiEndpoints = () => {
  const requestExample = `POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username

Headers:
  Content-Type: application/json
  x-api-key: duc_your_api_key_here
  x-token-name: your_token_name

Body:
{
  "usernames": ["user1", "user2", "user3"]
}`;

  const responseExample = `{
  "results": [
    {
      "username": "user1",
      "available": true,
      "status": "available"
    },
    {
      "username": "user2",
      "available": false,
      "status": "taken"
    },
    {
      "username": "user3",
      "available": true,
      "status": "available"
    }
  ]
}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">API Endpoints</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for all available API endpoints and their parameters.
        </p>
      </div>

      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="default" className="bg-success">POST</Badge>
              <h2 className="text-xl font-semibold text-foreground">Check Username Availability</h2>
            </div>
            <code className="text-sm text-primary block">
              /functions/v1/check-api-username
            </code>
            <p className="text-muted-foreground">
              Check the availability of one or more Discord usernames in a single request.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Send className="w-6 h-6 text-primary" />
          Request Format
        </h2>
        <CodeBlock
          code={requestExample}
          language="http"
          title="API Request"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Request Parameters</h2>
        <Card className="border-border">
          <div className="divide-y divide-border">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-primary">usernames</code>
                    <Badge variant="destructive" className="text-xs">required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Array of usernames to check (maximum 10 per request)
                  </p>
                </div>
                <Badge variant="outline">array[string]</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Database className="w-6 h-6 text-success" />
          Response Format
        </h2>
        <CodeBlock
          code={responseExample}
          language="json"
          title="API Response (200 OK)"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Response Fields</h2>
        <Card className="border-border">
          <div className="divide-y divide-border">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-primary">results</code>
                  <p className="text-sm text-muted-foreground">
                    Array of result objects, one for each username checked
                  </p>
                </div>
                <Badge variant="outline">array[object]</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-primary">results[].username</code>
                  <p className="text-sm text-muted-foreground">
                    The username that was checked
                  </p>
                </div>
                <Badge variant="outline">string</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-primary">results[].available</code>
                  <p className="text-sm text-muted-foreground">
                    Boolean indicating if the username is available (true) or taken (false)
                  </p>
                </div>
                <Badge variant="outline">boolean</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-primary">results[].status</code>
                  <p className="text-sm text-muted-foreground">
                    Status string: "available", "taken", "rate_limited", "error"
                  </p>
                </div>
                <Badge variant="outline">string</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">⚡ Performance Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Batch multiple usernames in a single request for better efficiency</li>
          <li>• Maximum 10 usernames per request to balance speed and reliability</li>
          <li>• Implement exponential backoff for rate-limited responses</li>
          <li>• Cache results when appropriate to reduce API calls</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiEndpoints;
