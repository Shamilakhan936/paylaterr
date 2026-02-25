import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `// Initialize the Paylaterr client
import { Paylaterr } from '@paylaterr/api';

const client = new Paylaterr({
  apiKey: process.env.PAYLATERR_SECRET_KEY
});

// Create a payment plan
const plan = await client.paymentPlans.create({
  customer_id: 'cus_1234567890',
  amount: 29900,
  currency: 'usd',
  installments: 4,
  interval: 'biweekly'
});

// Response
{
  id: 'plan_abc123',
  status: 'active',
  next_payment: '2024-02-15',
  installment_amount: 7475
}`;

const CodePreview = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/2">
        <div className="w-full h-full bg-accent/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <span className="text-sm text-primary font-medium">Developer First</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Build with confidence using our{" "}
              <span className="text-gradient">powerful APIs</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Clean, RESTful APIs with comprehensive SDKs for every major language. 
              Get from zero to production in hours, not weeks.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Comprehensive documentation with examples",
                "SDKs for Node.js, Python, Ruby, Go, and more",
                "Webhook support for real-time events",
                "Sandbox environment for safe testing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg">
              Read the Docs
            </Button>
          </div>

          {/* Code Block */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-card border border-border bg-[hsl(220_25%_8%)]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[hsl(220_25%_6%)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-accent opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-primary opacity-80" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">payment-plan.ts</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
              
              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code>
                    {codeExample.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-muted-foreground/50 w-8 text-right mr-4 select-none">
                          {i + 1}
                        </span>
                        <span className={
                          line.startsWith('//') 
                            ? 'text-muted-foreground' 
                            : line.includes('await') || line.includes('const') || line.includes('import')
                            ? 'text-primary'
                            : line.includes(':')
                            ? 'text-foreground'
                            : 'text-foreground opacity-80'
                        }>
                          {line}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodePreview;
