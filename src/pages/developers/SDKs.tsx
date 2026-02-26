import { PageLayout, PageHero } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, ExternalLink } from "lucide-react";

const sdks = [
  { name: "Node.js", package: "@raillayer/node", version: "2.4.1", install: "npm install @raillayer/node", docs: "#", github: "#" },
  { name: "Python", package: "raillayer", version: "1.8.2", install: "pip install raillayer", docs: "#", github: "#" },
  { name: "Ruby", package: "raillayer", version: "1.5.0", install: "gem install raillayer", docs: "#", github: "#" },
  { name: "Go", package: "github.com/raillayer/raillayer-go", version: "1.2.0", install: "go get github.com/raillayer/raillayer-go", docs: "#", github: "#" },
  { name: "PHP", package: "raillayer/raillayer-php", version: "2.1.0", install: "composer require raillayer/raillayer-php", docs: "#", github: "#" },
  { name: "Java", package: "com.raillayer:raillayer-java", version: "1.3.0", install: "implementation 'com.raillayer:raillayer-java:1.3.0'", docs: "#", github: "#" },
];

export default function SDKs() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="SDKs & Libraries">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Official client libraries for your favorite programming language
          </p>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sdks.map((sdk) => (
                <Card key={sdk.name} className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate min-w-0">{sdk.name}</h3>
                    <span className="text-xs sm:text-sm px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded flex-shrink-0">
                      v{sdk.version}
                    </span>
                  </div>
                  <div className="mb-3 sm:mb-4 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Install</p>
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <code className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 bg-secondary rounded text-xs sm:text-sm font-mono text-foreground truncate overflow-hidden">
                        {sdk.install}
                      </code>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 w-9 h-9 touch-manipulation" aria-label="Copy install command">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation">
                      <ExternalLink className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      Docs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm min-h-10 sm:min-h-9 touch-manipulation">
                      <Download className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      GitHub
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
