import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CodeBlock from "../CodeBlock";

const QuickStart = () => {
  const quickExample = `// Quick Example - Check Username Availability
const checkUsername = async () => {
  const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'duc_your_api_key_here',
      'x-token-name': 'your_token_name'
    },
    body: JSON.stringify({
      usernames: ['cool_user', 'awesome_gamer']
    })
  });
  
  const data = await response.json();
  console.log(data.results);
};`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Quick Start Guide</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with DUC API in minutes. Follow these simple steps to start checking Discord usernames.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            1
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-semibold text-foreground">Create Your Account</h3>
            <p className="text-muted-foreground">
              Sign up for a free account on DUC platform. You can register using email, Google, or Discord.
            </p>
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                Go to Sign Up
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        </div>

        <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            2
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-semibold text-foreground">Add Discord Token</h3>
            <p className="text-muted-foreground">
              Navigate to the Tokens section in your dashboard and add your Discord API token. This token will be used to check username availability.
            </p>
            <Link to="/dashboard/tokens">
              <Button variant="outline" className="gap-2">
                Manage Tokens
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        </div>

        <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            3
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-semibold text-foreground">Generate API Key</h3>
            <p className="text-muted-foreground">
              Go to your Profile page and generate a new API key. Give it a memorable label and keep it secure.
            </p>
            <Link to="/dashboard/profile">
              <Button variant="outline" className="gap-2">
                Generate API Key
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        </div>

        <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            4
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-semibold text-foreground">Make Your First Request</h3>
            <p className="text-muted-foreground">
              Use your API key to make your first request and check username availability!
            </p>
          </div>
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your First API Call</h2>
        <p className="text-muted-foreground">
          Here's a simple example to get you started. Copy this code and replace the API key and token name with your own:
        </p>
        <CodeBlock
          code={quickExample}
          language="javascript"
          title="first-request.js"
        />
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">🎉 Congratulations!</h3>
        <p className="text-muted-foreground">
          You're now ready to integrate DUC API into your application. Check out the Code Examples section for more detailed implementations.
        </p>
      </div>
    </div>
  );
};

export default QuickStart;
