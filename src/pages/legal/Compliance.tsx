import { PageLayout, PageHero } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";

const frameworks = [
  { name: "SOC 2 Type II", description: "Annual audit of security, availability, and confidentiality controls.", status: "Certified" },
  { name: "PCI DSS Level 1", description: "Highest level of payment card security compliance.", status: "Certified" },
  { name: "GDPR", description: "Full compliance with EU data protection regulations.", status: "Compliant" },
  { name: "CCPA", description: "California Consumer Privacy Act compliance.", status: "Compliant" },
  { name: "ISO 27001", description: "International information security management standard.", status: "Certified" },
];

export default function Compliance() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="Compliance">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            We maintain the highest standards of regulatory compliance to protect
            you and your customers.
          </p>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Compliance Frameworks
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {frameworks.map((framework) => (
                <Card key={framework.name} className="p-4 sm:p-6 bg-card border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{framework.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{framework.description}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded flex-shrink-0 w-fit">
                      {framework.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Compliance Documents</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Request access to our compliance documentation and audit reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button variant="outline" size="lg" className="text-sm sm:text-base">
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                SOC 2 Report
              </Button>
              <Button variant="outline" size="lg" className="text-sm sm:text-base">
                <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                Security Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
