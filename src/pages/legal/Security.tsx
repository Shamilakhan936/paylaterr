import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, CheckCircle } from "lucide-react";

const measures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256.",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II",
    description: "We are SOC 2 Type II certified, demonstrating our commitment to security.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Role-based access controls and audit logging for all system access.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description: "Hosted on SOC 2 compliant cloud infrastructure with 99.99% uptime.",
  },
];

const certifications = [
  "SOC 2 Type II",
  "PCI DSS Level 1",
  "GDPR Compliant",
  "CCPA Compliant",
  "ISO 27001",
  "HIPAA Ready",
];

const Security = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Security at Paylaterr
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data security is our top priority. We implement industry-leading 
              security measures to protect your information.
            </p>
          </div>
        </section>

        {/* Security Measures */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {measures.map((measure) => (
                <Card key={measure.title} className="p-6 bg-card border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <measure.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{measure.title}</h3>
                  <p className="text-muted-foreground">{measure.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Certifications & Compliance</h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {certifications.map((cert) => (
                <div 
                  key={cert}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Report Vulnerability */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Report a Vulnerability</h2>
            <p className="text-muted-foreground mb-6">
              We take security seriously and appreciate responsible disclosure. If you discover 
              a security issue, please report it to our security team.
            </p>
            <a href="mailto:security@paylaterr.com" className="text-primary hover:underline">
              security@paylaterr.com
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Security;
