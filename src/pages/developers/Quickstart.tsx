import { PageLayout, PageHero } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Check, 
  Copy,
  Terminal,
  Zap,
  Key,
  Code2,
  Webhook,
  Clock
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  {
    number: 1,
    title: "Create your account",
    description: "Sign up for a free Rail Layer account to access the developer dashboard.",
    action: { label: "Sign Up Free", href: "/partner-signup" }
  },
  {
    number: 2,
    title: "Get your API keys",
    description: "Generate sandbox API keys from your dashboard. These keys are for testing only.",
    code: `# Your sandbox API key
sk_sandbox_4a8b9c0d1e2f3g4h5i6j7k8l9m0n

# Base URL for sandbox
https://sandbox.api.raillayer.com`
  },
  {
    number: 3,
    title: "Install the SDK",
    description: "Install the Rail Layer SDK for your preferred programming language.",
    code: `# Node.js
npm install @raillayer/node

# Python
pip install raillayer

# Ruby
gem install raillayer`
  },
  {
    number: 4,
    title: "Make your first API call",
    description: "Create a simple payment plan to verify your integration is working.",
    code: `import RailLayer from '@raillayer/node';

const raillayer = new RailLayer({
  apiKey: 'sk_sandbox_...',
});

// Create a BNPL bill payment plan
const plan = await raillayer.bnpl.bills.create({
  user_id: 'usr_123abc',
  bill_type: 'utility',
  bill_amount: 450.00,
  installments: 4,
  start_date: '2024-02-01',
});

console.log('Plan created:', plan.id);`
  },
  {
    number: 5,
    title: "Handle webhooks",
    description: "Set up webhook endpoints to receive real-time notifications about payment events.",
    code: `// Express.js webhook handler
app.post('/webhooks/raillayer', (req, res) => {
  const event = req.body;
  
  switch (event.type) {
    case 'bnpl.payment.success':
      // Handle successful payment
      break;
    case 'bnpl.payment.failed':
      // Handle failed payment
      break;
  }
  
  res.json({ received: true });
});`
  }
];

const features = [
  { icon: Zap, title: "5 minute setup", description: "Get your first API call working in minutes" },
  { icon: Key, title: "Free sandbox", description: "Test without limits in our sandbox environment" },
  { icon: Code2, title: "SDKs for all languages", description: "Node.js, Python, Ruby, Go, and more" },
  { icon: Webhook, title: "Real-time webhooks", description: "Get notified instantly when events occur" },
];

const Quickstart = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="Quickstart Guide" leading={<Badge className="mb-4">Developer Guide</Badge>}>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get up and running with the Rail Layer API in 5 minutes
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="hero" asChild>
              <Link to="/partner-signup">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/developers/api-reference">API Reference</Link>
            </Button>
          </div>
        </PageHero>

        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-full bg-border -z-10" />
                  )}
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold">{step.number}</span>
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      {step.code && (
                        <Card className="bg-card border-border overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
                            <div className="flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Code</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyCode(step.code!, index)}
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm font-mono text-foreground">{step.code}</code>
                          </pre>
                        </Card>
                      )}
                      
                      {step.action && (
                        <Button variant="hero" asChild>
                          <Link to={step.action.href}>
                            {step.action.label}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-card">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">You're all set!</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Now that you've made your first API call, explore our documentation to learn about all the features available.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/developers/api-reference">Full API Reference</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={isAuthenticated ? "/dashboard/products" : "/partner-signup"}>
                  Browse Products
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to={isAuthenticated ? "/dashboard" : "/partner-signup"}>
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Quickstart;
