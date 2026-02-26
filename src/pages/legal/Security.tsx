import { PageLayout, PageHero } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, CheckCircle } from "lucide-react";

const measures = [
  { icon: Lock, title: "Encryption", description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256." },
  { icon: Shield, title: "SOC 2 Type II", description: "We are SOC 2 Type II certified, demonstrating our commitment to security." },
  { icon: Eye, title: "Access Controls", description: "Role-based access controls and audit logging for all system access." },
  { icon: Server, title: "Infrastructure", description: "Hosted on SOC 2 compliant cloud infrastructure with 99.99% uptime." },
];

const certifications = [
  "SOC 2 Type II",
  "PCI DSS Level 1",
  "GDPR Compliant",
  "CCPA Compliant",
  "ISO 27001",
  "HIPAA Ready",
];

export default function Security() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero
          title="Security at Rail Layer"
          leading={
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            </div>
          }
        >
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your data security is our top priority. We implement industry-leading
            security measures to protect your information.
          </p>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {measures.map((measure) => (
                <Card key={measure.title} className="p-4 sm:p-6 bg-card border-border">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <measure.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">{measure.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{measure.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">Certifications & Compliance</h2>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Report a Vulnerability</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              We take security seriously and appreciate responsible disclosure. If you discover
              a security issue, please report it to our security team.
            </p>
            <a href="mailto:security@raillayer.com" className="text-sm sm:text-base text-primary hover:underline">
              security@raillayer.com
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
