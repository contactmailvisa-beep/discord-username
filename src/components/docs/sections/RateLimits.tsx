import { Clock, Zap, Shield, AlertTriangle, CheckCircle, XCircle, Timer, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RateLimits = () => {
  const plans = [
    {
      name: "Free Plan",
      icon: <Shield className="w-5 h-5" />,
      limit: "50 requests/day",
      cooldown: "60 seconds",
      color: "text-blue-500",
      features: [
        "50 API requests per day",
        "60-second cooldown between requests",
        "Up to 10 usernames per request",
        "Basic rate limiting protection"
      ]
    },
    {
      name: "Premium Plan",
      icon: <Zap className="w-5 h-5" />,
      limit: "100 requests/day",
      cooldown: "60 seconds",
      color: "text-primary",
      features: [
        "100 API requests per day",
        "60-second cooldown between requests",
        "Up to 10 usernames per request",
        "Priority support",
        "Advanced analytics"
      ]
    }
  ];

  const rateLimitResponses = [
    {
      status: 200,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: "Success",
      description: "Request completed successfully within rate limits"
    },
    {
      status: 429,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: "Too Many Requests",
      description: "Rate limit exceeded. Wait before making another request"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-text-link bg-clip-text text-transparent">
            Rate Limits
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Understanding API rate limits and how to handle them effectively in your integration.
        </p>
      </div>

      {/* Overview Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Timer className="h-5 w-5 text-primary" />
        <AlertDescription className="text-muted-foreground">
          <strong className="text-foreground">Important:</strong> All API requests are subject to rate limiting to ensure fair usage and service stability. 
          Rate limits reset daily at midnight UTC and apply per API key.
        </AlertDescription>
      </Alert>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          Subscription Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-primary/10 ${plan.color} group-hover:scale-110 transition-transform duration-300`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <Badge variant="secondary" className="mt-1">{plan.limit}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily Limit:</span>
                    <span className="font-semibold text-foreground">{plan.limit.split('/')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cooldown:</span>
                    <span className="font-semibold text-foreground">{plan.cooldown}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Rate Limit Behavior */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          How Rate Limiting Works
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Daily Limits</h3>
            <p className="text-sm leading-relaxed">
              Each API key has a daily request quota that resets at <strong className="text-foreground">00:00 UTC</strong>. 
              Once you reach your daily limit, all subsequent requests will return a <code className="px-2 py-0.5 bg-muted rounded text-xs">429 Too Many Requests</code> error 
              until the reset time.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Request Cooldown</h3>
            <p className="text-sm leading-relaxed">
              A <strong className="text-foreground">60-second cooldown</strong> is enforced between consecutive requests. 
              If you attempt to make a request before the cooldown expires, you'll receive a rate limit error with the remaining wait time.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Batch Requests</h3>
            <p className="text-sm leading-relaxed">
              You can check up to <strong className="text-foreground">10 usernames per request</strong>. 
              This counts as a single request against your daily quota, making batch checking more efficient than individual requests.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Discord API Rate Limits</h3>
            <p className="text-sm leading-relaxed">
              In addition to our API limits, Discord's own rate limits apply. If Discord rate-limits your token, 
              the API will return the <code className="px-2 py-0.5 bg-muted rounded text-xs">retry_after</code> duration in seconds. 
              Your application should respect this timing before retrying.
            </p>
          </div>
        </div>
      </Card>

      {/* Response Codes */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Rate Limit Responses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rateLimitResponses.map((response, index) => (
            <Card
              key={index}
              className="p-5 bg-card border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {response.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{response.title}</h3>
                    <Badge variant="outline" className="text-xs">{response.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{response.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Alert className="border-primary/20 bg-primary/5">
        <CheckCircle className="h-5 w-5 text-primary" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Best Practices:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Implement exponential backoff when receiving 429 errors</li>
              <li>Cache results when possible to reduce API calls</li>
              <li>Use batch requests to check multiple usernames efficiently</li>
              <li>Monitor your daily quota to avoid unexpected limit hits</li>
              <li>Handle rate limit errors gracefully in your application</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default RateLimits;
