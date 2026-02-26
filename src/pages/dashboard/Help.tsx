import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Book, 
  MessageCircle, 
  FileText, 
  Video,
  ExternalLink,
  ChevronRight,
  Zap,
  Code2,
  Shield,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "Getting Started", description: "Learn the basics of the Rail Layer API", icon: Zap, href: "/developers/quickstart" },
  { title: "API Reference", description: "Explore our complete API documentation", icon: Code2, href: "/developers/api-reference" },
  { title: "SDKs & Libraries", description: "Download SDKs for your language", icon: Book, href: "/developers/sdks" },
  { title: "Security Best Practices", description: "Keep your integration secure", icon: Shield, href: "/legal/security" },
];

const popularArticles = [
  { title: "How to create your first payment plan", category: "Getting Started" },
  { title: "Understanding webhook events", category: "Webhooks" },
  { title: "Testing in the sandbox environment", category: "Testing" },
  { title: "Handling API errors gracefully", category: "Error Handling" },
  { title: "Migrating from v1 to v2 API", category: "Migration" },
  { title: "Setting up team access controls", category: "Account" },
];

const faqItems = [
  {
    question: "How do I get started with the Rail Layer API?",
    answer: "Sign up for a free account, get your sandbox API keys from the dashboard, and follow our quickstart guide to make your first API call."
  },
  {
    question: "What's the difference between sandbox and production?",
    answer: "Sandbox is for testing with simulated data. Production handles real transactions. You'll need to complete integration review before getting production access."
  },
  {
    question: "How do I handle webhook failures?",
    answer: "We automatically retry failed webhooks up to 5 times with exponential backoff. You can also manually retry from the Webhooks dashboard."
  },
  {
    question: "What are the API rate limits?",
    answer: "Rate limits vary by endpoint and plan. Most endpoints allow 1000 requests/minute on the Growth plan. Check the API reference for specific limits."
  },
];

const Help = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">How can we help?</h1>
        <p className="text-muted-foreground">Search our knowledge base or browse topics below</p>
        
        <div className="max-w-lg mx-auto mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search for answers..." 
            className="pl-12 h-12 bg-card border-border"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickLinks.map((link) => (
          <Link key={link.title} to={link.href}>
            <Card className="p-5 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <link.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Popular Articles</h2>
              <Button variant="ghost" size="sm">
                View All <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-3">
              {popularArticles.map((article, i) => (
                <a 
                  key={i} 
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-foreground group-hover:text-primary transition-colors">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact Support</h2>
            <div className="space-y-4">
              <a 
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Live Chat</p>
                  <p className="text-xs text-muted-foreground">Available 24/7</p>
                </div>
              </a>
              <a 
                href="mailto:support@raillayer.com"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@raillayer.com</p>
                </div>
              </a>
              <a 
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Schedule a Call</p>
                  <p className="text-xs text-muted-foreground">Talk to an expert</p>
                </div>
              </a>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border">
            <h3 className="font-semibold text-foreground mb-2">Enterprise Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get dedicated support with guaranteed response times and a dedicated account manager.
            </p>
            <Button variant="hero" className="w-full">Contact Sales</Button>
          </Card>
        </div>
      </div>
      <Card className="mt-8 p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqItems.map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-medium text-foreground">{item.question}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Help;
