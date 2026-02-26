import { PageLayout, PageHero } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const changes = [
  {
    version: "2.4.0",
    date: "January 28, 2024",
    type: "feature",
    changes: [
      "Added support for multi-currency payment plans",
      "New webhook events for plan lifecycle",
      "Improved error messages and codes",
      "Added batch API endpoints",
    ],
  },
  {
    version: "2.3.2",
    date: "January 15, 2024",
    type: "fix",
    changes: [
      "Fixed race condition in concurrent plan updates",
      "Improved webhook retry logic",
      "Fixed timezone handling in scheduled payments",
    ],
  },
  {
    version: "2.3.0",
    date: "January 5, 2024",
    type: "feature",
    changes: [
      "Introduced Risk Engine v2 with ML-powered scoring",
      "Added support for 15 new financial institutions",
      "New analytics endpoints for revenue insights",
    ],
  },
  {
    version: "2.2.1",
    date: "December 20, 2023",
    type: "improvement",
    changes: [
      "Reduced API latency by 30%",
      "Improved documentation with more examples",
      "Added TypeScript types to Node.js SDK",
    ],
  },
];

const Changelog = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="Changelog">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest API changes and improvements
          </p>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="space-y-5 sm:space-y-8">
              {changes.map((release, index) => (
                <Card key={index} className="p-4 sm:p-6 bg-card border-border">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">v{release.version}</h2>
                    <Badge variant={
                      release.type === 'feature' ? 'default' :
                      release.type === 'fix' ? 'destructive' : 'secondary'
                    } className="text-xs capitalize">
                      {release.type}
                    </Badge>
                    <span className="text-muted-foreground text-sm sm:text-base ml-auto w-full sm:w-auto order-last sm:order-none">{release.date}</span>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-muted-foreground text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Changelog;
