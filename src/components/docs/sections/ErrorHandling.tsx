import { AlertTriangle, XCircle, AlertCircle, CheckCircle, Info, Shield, Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CodeBlock from "../CodeBlock";

const ErrorHandling = () => {
  const statusCodes = [
    {
      code: 200,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: "Success",
      description: "Request completed successfully. Username availability data returned.",
      color: "border-green-500/20 bg-green-500/5",
      example: {
        status: 200,
        message: "Success",
        data: {
          results: [
            { username: "example", available: true }
          ]
        }
      }
    },
    {
      code: 400,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Bad Request",
      description: "Invalid request format, missing required fields, or invalid username format.",
      color: "border-red-500/20 bg-red-500/5",
      causes: [
        "Missing API key or token name",
        "Invalid username format (special characters, length)",
        "Empty usernames array",
        "More than 10 usernames in request"
      ],
      example: {
        status: 400,
        error: "Bad Request",
        message: "Invalid username format. Usernames must be 3-32 characters."
      }
    },
    {
      code: 401,
      icon: <Shield className="w-5 h-5 text-orange-500" />,
      title: "Unauthorized",
      description: "Invalid or expired API key. Authentication failed.",
      color: "border-orange-500/20 bg-orange-500/5",
      causes: [
        "Invalid API key",
        "Expired or revoked API key",
        "API key from different account",
        "Missing authentication header"
      ],
      example: {
        status: 401,
        error: "Unauthorized",
        message: "Invalid API key. Please check your credentials."
      }
    },
    {
      code: 403,
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      title: "Forbidden",
      description: "User is banned from API access or token is inactive.",
      color: "border-yellow-500/20 bg-yellow-500/5",
      causes: [
        "User account is banned",
        "Selected Discord token is inactive",
        "Token does not exist",
        "Access rights revoked"
      ],
      example: {
        status: 403,
        error: "Forbidden",
        message: "Your account has been temporarily banned from API access.",
        banned_until: "2024-12-31T23:59:59Z"
      }
    },
    {
      code: 429,
      icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
      title: "Too Many Requests",
      description: "Rate limit exceeded. Too many requests in a given time period.",
      color: "border-blue-500/20 bg-blue-500/5",
      causes: [
        "Daily request quota exceeded",
        "Request cooldown not expired (60 seconds)",
        "Concurrent request limit reached",
        "Discord API rate limit triggered"
      ],
      example: {
        status: 429,
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please wait before making another request.",
        retry_after: 45,
        requests_remaining: 0,
        quota_reset_at: "2024-12-01T00:00:00Z"
      }
    },
    {
      code: 500,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Internal Server Error",
      description: "Unexpected server error. The request could not be processed.",
      color: "border-red-500/20 bg-red-500/5",
      causes: [
        "Discord API is down or unreachable",
        "Database connection error",
        "Unexpected server exception",
        "Service temporarily unavailable"
      ],
      example: {
        status: 500,
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later."
      }
    }
  ];

  const errorHandlingExample = `// Example: Proper error handling in JavaScript
async function checkUsername(apiKey, tokenName, usernames) {
  try {
    const response = await fetch('https://discord-username.lovable.app/functions/v1/check-api-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        token_name: tokenName,
        usernames: usernames
      })
    });

    const data = await response.json();

    // Handle different status codes
    switch (response.status) {
      case 200:
        console.log('Success:', data);
        return data;
        
      case 400:
        console.error('Bad Request:', data.message);
        // Fix your request format
        break;
        
      case 401:
        console.error('Unauthorized:', data.message);
        // Check your API key
        break;
        
      case 403:
        console.error('Forbidden:', data.message);
        // User banned or token inactive
        break;
        
      case 429:
        console.warn('Rate Limited:', data.message);
        // Wait for retry_after seconds
        const waitTime = data.retry_after || 60;
        console.log(\`Waiting \${waitTime} seconds...\`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return checkUsername(apiKey, tokenName, usernames); // Retry
        
      case 500:
        console.error('Server Error:', data.message);
        // Retry with exponential backoff
        break;
        
      default:
        console.error('Unexpected error:', response.status);
    }
  } catch (error) {
    console.error('Network error:', error);
    // Handle network/connection errors
  }
}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-text-link bg-clip-text text-transparent">
            Error Handling
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Comprehensive guide to understanding and handling API errors effectively in your integration.
        </p>
      </div>

      {/* Overview Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-5 w-5 text-primary" />
        <AlertDescription className="text-muted-foreground">
          <strong className="text-foreground">All API responses</strong> include a status code, error type (if applicable), 
          and a descriptive message to help you debug issues quickly. Always check the status code before processing response data.
        </AlertDescription>
      </Alert>

      {/* Status Codes */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Code className="w-6 h-6 text-primary" />
          HTTP Status Codes
        </h2>
        <div className="space-y-6">
          {statusCodes.map((status, index) => (
            <Card
              key={index}
              className={`p-6 border-2 transition-all duration-300 hover:shadow-lg ${status.color}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {status.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-foreground">{status.title}</h3>
                        <Badge variant="outline" className="text-sm font-mono">{status.code}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {status.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Causes (if available) */}
                {status.causes && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-foreground">Common Causes:</h4>
                    <ul className="space-y-1">
                      {status.causes.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example Response */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Example Response:</h4>
                  <CodeBlock
                    code={JSON.stringify(status.example, null, 2)}
                    language="json"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Error Handling Best Practices */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Error Handling Best Practices
        </h2>
        <div className="space-y-4">
          <CodeBlock
            code={errorHandlingExample}
            language="javascript"
          />
        </div>
      </Card>

      {/* Tips Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <CheckCircle className="h-5 w-5 text-primary" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Pro Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Always implement exponential backoff for 429 and 500 errors</li>
              <li>Log all errors with timestamps for debugging</li>
              <li>Show user-friendly error messages instead of raw API responses</li>
              <li>Validate input data before sending requests to avoid 400 errors</li>
              <li>Monitor your API key status regularly to catch 401 errors early</li>
              <li>Respect retry_after values to avoid cascading rate limit issues</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorHandling;
