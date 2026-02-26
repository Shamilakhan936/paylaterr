import { PageLayout, PageHero } from "@/components/layout";
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
        <PageHero title="API Reference">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            Complete documentation for the Rail Layer API
          </p>
          <div className="max-w-md mx-auto relative px-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search endpoints, parameters..."
              className="pl-9 sm:pl-12 h-10 sm:h-12 bg-card border-border text-sm sm:text-base"
            />
          </div>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="lg:col-span-1">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Categories</h3>
                <nav className="space-y-0.5 sm:space-y-1">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href="#"
                      className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm sm:text-base"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-secondary px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0">{category.count}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="lg:col-span-3">
                <Card className="p-4 sm:p-6 bg-card border-border mb-6 sm:mb-8">
                  <h3 className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Base URL</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <code className="px-3 sm:px-4 py-2 bg-secondary rounded-lg font-mono text-foreground text-xs sm:text-sm break-all min-w-0">
                      https://api.raillayer.com
                    </code>
                    <Button variant="outline" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 self-start sm:self-auto">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Endpoints</h2>
                <div className="space-y-2 sm:space-y-3">
                  {endpoints.map((endpoint, index) => (
                    <Card 
                      key={index} 
                      className="p-3 sm:p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className={`px-2 py-0.5 sm:py-1 rounded text-xs font-mono font-bold flex-shrink-0 ${
                          endpoint.method === 'GET' ? 'bg-primary/20 text-primary' :
                          endpoint.method === 'POST' ? 'bg-accent/20 text-accent' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-foreground text-xs sm:text-sm break-all min-w-0 flex-1">{endpoint.path}</code>
                        <span className="text-muted-foreground text-xs sm:text-sm hidden sm:block flex-shrink-0">{endpoint.description}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      {endpoint.description && (
                        <p className="text-muted-foreground text-xs sm:hidden mt-1.5 pl-0">{endpoint.description}</p>
                      )}
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
