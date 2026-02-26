import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Activity,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const PRODUCT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(142 76% 36%)",
  "hsl(38 92% 50%)",
  "hsl(var(--destructive))",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
  "hsl(330 81% 60%)",
  "hsl(174 72% 40%)",
  "hsl(24 95% 53%)",
];

const DashboardAnalytics = () => {
  const { user } = useAuth();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["analytics-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_request_logs")
        .select("*")
        .order("request_timestamp", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalRequests = logs.length;
  const successCount = logs.filter(l => (l.status_code || 0) < 400).length;
  const successRate = totalRequests > 0 ? ((successCount / totalRequests) * 100).toFixed(1) : "0";
  const avgLatency = totalRequests > 0
    ? Math.round(logs.reduce((s, l) => s + (l.response_time_ms || 0), 0) / totalRequests)
    : 0;
  const errorCount = totalRequests - successCount;

  const productCounts: Record<string, number> = {};
  logs.forEach(l => { productCounts[l.product] = (productCounts[l.product] || 0) + 1; });
  const productData = Object.entries(productCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dateCounts: Record<string, { total: number; errors: number }> = {};
  logs.forEach(l => {
    const day = new Date(l.request_timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!dateCounts[day]) dateCounts[day] = { total: 0, errors: 0 };
    dateCounts[day].total++;
    if ((l.status_code || 0) >= 400) dateCounts[day].errors++;
  });
  const timeData = Object.entries(dateCounts)
    .map(([date, v]) => ({ date, total: v.total, errors: v.errors }))
    .reverse();

  const latencyByDate: Record<string, { sum: number; count: number }> = {};
  logs.forEach(l => {
    const day = new Date(l.request_timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!latencyByDate[day]) latencyByDate[day] = { sum: 0, count: 0 };
    latencyByDate[day].sum += l.response_time_ms || 0;
    latencyByDate[day].count++;
  });
  const latencyData = Object.entries(latencyByDate)
    .map(([date, v]) => ({ date, avg: Math.round(v.sum / v.count) }))
    .reverse();

  const metrics = [
    { title: "Total Requests", value: totalRequests.toLocaleString(), icon: Activity },
    { title: "Success Rate", value: `${successRate}%`, icon: CheckCircle },
    { title: "Avg Latency", value: `${avgLatency}ms`, icon: Clock },
    { title: "Errors", value: errorCount.toLocaleString(), icon: TrendingDown },
  ];

  if (isLoading) {
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your API performance</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <Card key={m.title} className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{m.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <m.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests Over Time</h3>
          {timeData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={timeData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="errors" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Avg Latency Over Time</h3>
          {latencyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={latencyData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit="ms" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Avg Latency" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Product</h3>
        {productData.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No data yet. Try the API Playground!</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                  {productData.map((_, i) => (
                    <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {productData.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }} />
                    <span className="text-sm text-foreground">{p.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
