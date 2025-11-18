import { Sparkles, Check, Zap, Shield, Code, Layers, Clock, Database, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Introduction = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-Time Checking",
      description: "Direct integration with Discord's API for instant, accurate username availability results. No cached or outdated data.",
      badge: "Live"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Authentication",
      description: "Enterprise-grade security with encrypted API keys, hashed tokens, and automatic rate limiting to protect your resources.",
      badge: "Secure"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Developer-Friendly",
      description: "RESTful API design with clear endpoints, detailed error messages, and examples in multiple programming languages.",
      badge: "Easy"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Bulk Operations",
      description: "Efficiently check up to 10 usernames in a single API request, reducing overhead and improving performance.",
      badge: "Fast"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Flexible Rate Limits",
      description: "Choose between free tier (50 requests/day) or premium (100 requests/day) based on your application's needs.",
      badge: "Scalable"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Usage Analytics",
      description: "Track your API usage, monitor statistics, and optimize your integration with built-in analytics endpoints.",
      badge: "Insights"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-text-link bg-clip-text text-transparent">
            Welcome to DUC API Documentation
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The ultimate Discord Username Checker API. Fast, reliable, and developer-friendly solution
          for checking Discord username availability programmatically.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">What is DUC?</h2>
        <p className="text-muted-foreground leading-relaxed">
          DUC (Discord Username Checker) is a powerful platform that allows developers to check Discord
          username availability through a simple REST API. Our service provides real-time checking using
          actual Discord API calls, ensuring accurate and up-to-date results for your applications.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-text-link/10 rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
        <div className="space-y-3 text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            <p>Create an account at <a href="https://discord-username.lovable.app" className="text-primary hover:underline">discord-username.lovable.app</a></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            <p>Add your Discord API token in the Tokens section</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
            <p>Generate an API key from your Profile dashboard</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
            <p>Start making API requests and check username availability!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
