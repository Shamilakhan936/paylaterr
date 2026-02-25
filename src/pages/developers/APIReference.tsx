import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const endpoints = [
  {
    method: "POST",
    path: "/v1/payment-plans",
    description: "Create a new payment plan",
  },
  {
    method: "GET",
    path: "/v1/payment-plans/:id",
    description: "Retrieve a payment plan",
  },
  {
    method: "POST",
    path: "/v1/accounts/link",
    description: "Initiate account linking",
  },
  {
    method: "GET",
    path: "/v1/accounts/:id/balance",
    description: "Get account balance",
  },
  {
    method: "POST",
    path: "/v1/risk/assess",
    description: "Run risk assessment",
  },
];

const categories = [
  { name: "Payment Plans", count: 12 },
  { name: "Account Linking", count: 8 },
  { name: "Risk Assessment", count: 6 },
  { name: "Webhooks", count: 4 },
  { name: "Analytics", count: 5 },
  { name: "Authentication", count: 3 },
];

const APIReference = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              API Reference
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Complete documentation for the Paylaterr API
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search endpoints, parameters..." 
                className="pl-12 h-12 bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href="#"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">{category.count}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Base URL */}
                <Card className="p-6 bg-card border-border mb-8">
                  <h3 className="text-sm text-muted-foreground mb-2">Base URL</h3>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-2 bg-secondary rounded-lg font-mono text-foreground">
                      https://api.paylaterr.com
                    </code>
                    <Button variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {/* Endpoints */}
                <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
                <div className="space-y-3">
                  {endpoints.map((endpoint, index) => (
                    <Card 
                      key={index} 
                      className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                          endpoint.method === 'GET' ? 'bg-primary/20 text-primary' :
                          endpoint.method === 'POST' ? 'bg-accent/20 text-accent' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-foreground flex-1">{endpoint.path}</code>
                        <span className="text-muted-foreground hidden sm:block">{endpoint.description}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default APIReference;
