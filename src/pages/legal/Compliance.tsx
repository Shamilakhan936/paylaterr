import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";

const frameworks = [
  {
    name: "SOC 2 Type II",
    description: "Annual audit of security, availability, and confidentiality controls.",
    status: "Certified",
  },
  {
    name: "PCI DSS Level 1",
    description: "Highest level of payment card security compliance.",
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "Full compliance with EU data protection regulations.",
    status: "Compliant",
  },
  {
    name: "CCPA",
    description: "California Consumer Privacy Act compliance.",
    status: "Compliant",
  },
  {
    name: "ISO 27001",
    description: "International information security management standard.",
    status: "Certified",
  },
];

const Compliance = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Compliance
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards of regulatory compliance to protect 
              you and your customers.
            </p>
          </div>
        </section>

        {/* Frameworks */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Compliance Frameworks
            </h2>
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <Card key={framework.name} className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{framework.name}</h3>
                        <p className="text-sm text-muted-foreground">{framework.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded">
                      {framework.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Compliance Documents</h2>
            <p className="text-muted-foreground mb-8">
              Request access to our compliance documentation and audit reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                SOC 2 Report
              </Button>
              <Button variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Security Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Compliance;
