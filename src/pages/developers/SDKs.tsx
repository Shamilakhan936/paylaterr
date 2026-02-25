import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, ExternalLink } from "lucide-react";

const sdks = [
  {
    name: "Node.js",
    package: "@paylaterr/node",
    version: "2.4.1",
    install: "npm install @paylaterr/node",
    docs: "#",
    github: "#",
  },
  {
    name: "Python",
    package: "paylaterr",
    version: "1.8.2",
    install: "pip install paylaterr",
    docs: "#",
    github: "#",
  },
  {
    name: "Ruby",
    package: "paylaterr",
    version: "1.5.0",
    install: "gem install paylaterr",
    docs: "#",
    github: "#",
  },
  {
    name: "Go",
    package: "github.com/paylaterr/paylaterr-go",
    version: "1.2.0",
    install: "go get github.com/paylaterr/paylaterr-go",
    docs: "#",
    github: "#",
  },
  {
    name: "PHP",
    package: "paylaterr/paylaterr-php",
    version: "2.1.0",
    install: "composer require paylaterr/paylaterr-php",
    docs: "#",
    github: "#",
  },
  {
    name: "Java",
    package: "com.paylaterr:paylaterr-java",
    version: "1.3.0",
    install: "implementation 'com.paylaterr:paylaterr-java:1.3.0'",
    docs: "#",
    github: "#",
  },
];

const SDKs = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              SDKs & Libraries
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Official client libraries for your favorite programming language
            </p>
          </div>
        </section>

        {/* SDKs Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sdks.map((sdk) => (
                <Card key={sdk.name} className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{sdk.name}</h3>
                    <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                      v{sdk.version}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Install</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-secondary rounded text-sm font-mono text-foreground truncate">
                        {sdk.install}
                      </code>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Docs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
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
};

export default SDKs;
