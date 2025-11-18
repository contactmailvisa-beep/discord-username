import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, HelpCircle, AlertCircle, FileText } from "lucide-react";
import SupportTicketDialog from "@/components/support/SupportTicketDialog";
import UserTicketsList from "@/components/support/UserTicketsList";

const Support = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const faqs = [
    {
      question: "How do I check Discord username availability?",
      answer: "You can check username availability using our Generator feature, Manual Check, or Global Account. All methods use real Discord API calls to verify if a username is available or taken.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "What's the difference between Free and Premium plans?",
      answer: "Free users can check 10 usernames every 15 minutes, while Premium users ($3/month) can check 10 usernames every 5 minutes with priority support.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      question: "How do I add Discord API tokens?",
      answer: "Go to your Profile/Tokens section and click 'Add Token'. Paste your Discord API token and give it a name. Your tokens are encrypted and secure.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "What is the Global Account feature?",
      answer: "Global Account allows you to check usernames using a shared Discord token. Each user can use it once every 12 hours. Perfect for users without their own tokens.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How do API keys work?",
      answer: "API keys allow you to integrate our username checking service into your own applications. Generate keys from your Profile, then use them with our documented endpoints.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      question: "What happens when I hit rate limits?",
      answer: "When Discord's API rate limits are reached, you'll see a countdown timer. The system automatically resumes checking when the limit expires. Premium users have shorter cooldowns.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "Can I save usernames I find?",
      answer: "Yes! Click the save button on any available username to add it to your collection. Access saved usernames from the 'Saved' section in your dashboard.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How do I look up Discord account information?",
      answer: "Use the 'Look Up' feature to search any Discord account by their user ID. You'll see username, avatar, banner, and account creation date.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      question: "Is my Discord token safe?",
      answer: "Absolutely. Your tokens are encrypted in our database and never displayed in the UI, console, or network requests. We take security very seriously.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "How do I integrate the API into my Discord bot?",
      answer: "Check our API documentation for code examples in JavaScript, Python, Discord.js, and Discord.py. Use your API key to authenticate requests.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept PayPal for Premium subscriptions. After payment, your account is automatically upgraded for exactly 1 month.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      question: "Can I cancel my Premium subscription?",
      answer: "Yes, you can cancel anytime through PayPal. Your Premium benefits continue until the end of your current billing period.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "Why am I getting 'rate limited' errors?",
      answer: "Discord enforces API rate limits to prevent abuse. Our system automatically handles these limits and shows countdown timers. Premium users experience fewer restrictions.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How many usernames can I check at once?",
      answer: "You can check up to 10 usernames per batch. The Generator can produce 1-10 usernames, and Manual Check allows one at a time with a 120-second cooldown.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      question: "What do the different ticket statuses mean?",
      answer: "Pending (awaiting response), Urgent (high priority), Emergency (immediate attention needed), Status 7 (under investigation), Scheduled (planned follow-up), and Closed (resolved).",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Support & Help</h1>
        <p className="text-muted-foreground text-lg">
          Get help with your account, features, or technical issues. Our support team is here to assist you.
        </p>
      </div>

      {/* Contact Support Button */}
      <Card className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              Open a support ticket and our team will respond as quickly as possible
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Us
          </Button>
        </div>
      </Card>

      {/* User's Tickets */}
      <UserTicketsList />

      {/* FAQs Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {faq.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <SupportTicketDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default Support;