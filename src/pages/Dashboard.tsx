import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  Key,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["dashboard-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_request_logs")
        .select("*")
        .order("request_timestamp", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["dashboard-keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("id, revoked_at")
        .is("revoked_at", null);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalRequests = logs.length;
  const successCount = logs.filter(l => (l.status_code || 0) < 400).length;
  const successRate = totalRequests > 0 ? ((successCount / totalRequests) * 100).toFixed(1) : "—";
  const avgLatency = totalRequests > 0
    ? Math.round(logs.reduce((s, l) => s + (l.response_time_ms || 0), 0) / totalRequests)
    : 0;

  const dateCounts: Record<string, number> = {};
  logs.forEach(l => {
    const day = new Date(l.request_timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateCounts[day] = (dateCounts[day] || 0) + 1;
  });
  const chartData = Object.entries(dateCounts).map(([date, count]) => ({ date, count })).reverse();

  const recentLogs = logs.slice(0, 5);

  const stats = [
    { title: "Total Requests", value: totalRequests.toLocaleString(), icon: Activity },
    { title: "Active API Keys", value: apiKeys.length.toString(), icon: Key },
    { title: "Success Rate", value: `${successRate}%`, icon: CheckCircle },
    { title: "Avg Latency", value: `${avgLatency}ms`, icon: Clock },
  ];

  if (logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button variant="outline" asChild>
            <Link to="/dashboard/logs">View Logs</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/dashboard/playground">API Playground</Link>
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Request Volume</h3>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>No API requests yet</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <Link to="/dashboard/logs">View All</Link>
            </Button>
          </div>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    {(log.status_code || 0) < 400 ? (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{log.product}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.request_timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-foreground">{log.status_code}</p>
                    <p className="text-xs text-muted-foreground">{log.response_time_ms}ms</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
