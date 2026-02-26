import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  latency: string;
  requests_24h: number;
  errors_24h: number;
}

interface StatusData {
  status: string;
  updated_at: string;
  services: ServiceStatus[];
  summary: {
    total_requests_24h: number;
    total_errors_24h: number;
    avg_response_time_ms: number;
  };
}

const Status = () => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/platform-status`
      );
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      /* keep existing data */
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const overallOperational = data?.status === "operational";

  const statusIcon = (status: string) => {
    if (status === "operational") return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />;
    if (status === "degraded") return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />;
    return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />;
  };

  const statusColor = (status: string) => {
    if (status === "operational") return "text-primary";
    if (status === "degraded") return "text-accent";
    return "text-destructive";
  };

  return (
    <PageLayout>
      <div className="min-h-screen">
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-mesh">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full mb-4 sm:mb-6 ${
              overallOperational ? 'bg-primary/10' : 'bg-accent/10'
            }`}>
              {overallOperational ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
              )}
              <span className={`text-sm sm:text-lg font-medium ${overallOperational ? 'text-primary' : 'text-accent'}`}>
                {loading && !data ? "Loading..." : overallOperational ? "All Systems Operational" : "Partial System Degradation"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              System Status
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground">
              Real-time status of Rail Layer services — auto-refreshes every 30s
            </p>
          </div>
        </section>

        {data && (
          <section className="py-6 sm:py-8 border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <Card className="p-3 sm:p-4 bg-card border-border text-center min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Requests (24h)</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground truncate" title={data.summary.total_requests_24h.toLocaleString()}>{data.summary.total_requests_24h.toLocaleString()}</p>
                </Card>
                <Card className="p-3 sm:p-4 bg-card border-border text-center min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Errors (24h)</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{data.summary.total_errors_24h}</p>
                </Card>
                <Card className="p-3 sm:p-4 bg-card border-border text-center min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {data.summary.avg_response_time_ms > 0 ? `${data.summary.avg_response_time_ms}ms` : "N/A"}
                  </p>
                </Card>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Services</h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-muted-foreground">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
                <Button variant="ghost" size="sm" onClick={fetchStatus} disabled={loading} className="touch-manipulation h-9 w-9 sm:h-9 sm:w-9 p-0">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {!data && loading ? (
              <div className="flex items-center justify-center py-10 sm:py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {(data?.services || []).map((service) => (
                  <Card key={service.id} className="p-3 sm:p-4 bg-card border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {statusIcon(service.status)}
                        <span className="font-medium text-foreground text-sm sm:text-base truncate">{service.name}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-muted-foreground">Uptime</p>
                          <p className="text-xs sm:text-sm text-foreground">{service.uptime}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-muted-foreground">Latency</p>
                          <p className="text-xs sm:text-sm text-foreground">{service.latency}</p>
                        </div>
                        <div className="text-left sm:text-right hidden md:block">
                          <p className="text-sm text-muted-foreground">24h Reqs</p>
                          <p className="text-sm text-foreground">{service.requests_24h}</p>
                        </div>
                        <span className={`text-xs sm:text-sm capitalize flex-shrink-0 ${statusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-center">Data sourced from live API request logs</span>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Status;
