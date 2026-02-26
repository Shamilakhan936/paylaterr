import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

const services = [
  { name: "API", status: "operational", uptime: "99.99%", latency: "45ms" },
  { name: "Dashboard", status: "operational", uptime: "99.98%", latency: "120ms" },
  { name: "Webhooks", status: "operational", uptime: "99.97%", latency: "89ms" },
  { name: "Account Linking", status: "operational", uptime: "99.95%", latency: "1.2s" },
  { name: "Risk Engine", status: "operational", uptime: "99.99%", latency: "850ms" },
  { name: "Analytics", status: "degraded", uptime: "99.80%", latency: "340ms" },
];

const incidents = [
  {
    date: "January 28, 2024",
    title: "Elevated API Latency",
    status: "resolved",
    description: "We experienced elevated latency on our API endpoints. Issue has been resolved.",
  },
  {
    date: "January 20, 2024",
    title: "Analytics Dashboard Outage",
    status: "resolved",
    description: "The analytics dashboard was unavailable for approximately 15 minutes.",
  },
];

const Status = () => {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${
              allOperational ? 'bg-primary/10' : 'bg-accent/10'
            }`}>
              {allOperational ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-accent" />
              )}
              <span className={`text-lg font-medium ${allOperational ? 'text-primary' : 'text-accent'}`}>
                {allOperational ? 'All Systems Operational' : 'Partial System Outage'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              System Status
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time status of Paylaterr services
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Services</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <Card key={service.name} className="p-4 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {service.status === 'operational' ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : service.status === 'degraded' ? (
                        <AlertTriangle className="w-5 h-5 text-accent" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-sm text-foreground">{service.uptime}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Latency</p>
                        <p className="text-sm text-foreground">{service.latency}</p>
                      </div>
                      <span className={`text-sm capitalize ${
                        service.status === 'operational' ? 'text-primary' :
                        service.status === 'degraded' ? 'text-accent' : 'text-destructive'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Incidents */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Card key={index} className="p-4 bg-card border-border">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{incident.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{incident.date}</p>
                    </div>
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

export default Status;
