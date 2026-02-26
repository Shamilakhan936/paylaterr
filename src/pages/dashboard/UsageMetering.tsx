import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BarChart3, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface UsageLimit {
  id: string;
  monthly_limit: number;
  current_month_usage: number;
  billing_cycle_start: string;
}

const PRODUCT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export default function UsageMetering() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: usageLimits, isLoading: limitsLoading } = useQuery({
    queryKey: ["usage-limits"],
    queryFn: async () => {
      let { data, error } = await (supabase as any)
        .from("usage_limits")
        .select("*")
        .single();
      if (error && error.code === "PGRST116") {
        const { data: inserted, error: insertError } = await (supabase as any)
          .from("usage_limits")
          .insert({ user_id: user!.id })
          .select()
          .single();
        if (insertError) throw insertError;
        return inserted as UsageLimit;
      }
      if (error) throw error;
      return data as UsageLimit;
    },
    enabled: !!user,
  });

  const { data: productUsage = [], isLoading: usageLoading } = useQuery({
    queryKey: ["product-usage-breakdown"],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("api_request_logs")
        .select("product, id")
        .gte("request_timestamp", startOfMonth.toISOString());
      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        counts[row.product] = (counts[row.product] || 0) + 1;
      });

      return Object.entries(counts)
        .map(([product, count]) => ({ product, count }))
        .sort((a, b) => b.count - a.count);
    },
    enabled: !!user,
  });

  const { data: dailyUsage = [] } = useQuery({
    queryKey: ["daily-usage"],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("api_request_logs")
        .select("request_timestamp")
        .gte("request_timestamp", startOfMonth.toISOString());
      if (error) throw error;

      const dailyCounts: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        const day = new Date(row.request_timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      });

      return Object.entries(dailyCounts).map(([day, count]) => ({ day, count }));
    },
    enabled: !!user,
  });

  const totalUsage = usageLimits?.current_month_usage ?? productUsage.reduce((s, p) => s + p.count, 0);
  const limit = usageLimits?.monthly_limit ?? 10000;
  const usagePercent = Math.min((totalUsage / limit) * 100, 100);
  const isNearLimit = usagePercent > 80;

  const isLoading = limitsLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Usage & Metering</h1>
        <p className="text-muted-foreground mt-1">Monitor API consumption and billing limits</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-xl font-bold text-foreground">{totalUsage.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Limit</p>
            <p className="text-xl font-bold text-foreground">{limit.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNearLimit ? "bg-destructive/10" : "bg-primary/10"}`}>
            {isNearLimit ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <TrendingUp className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold text-foreground">{Math.max(limit - totalUsage, 0).toLocaleString()}</p>
          </div>
        </Card>
      </div>
      <Card className="p-6 bg-card border-border mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Monthly Usage</h3>
          <Badge variant={isNearLimit ? "destructive" : "default"}>
            {usagePercent.toFixed(1)}% used
          </Badge>
        </div>
        <Progress value={usagePercent} className="h-3 mb-2" />
        <p className="text-xs text-muted-foreground">
          {totalUsage.toLocaleString()} / {limit.toLocaleString()} API calls used this billing cycle
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Daily Request Volume</h3>
          {dailyUsage.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No usage data this month.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyUsage}>
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Usage by Product</h3>
          {productUsage.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No product usage data yet.</p>
          ) : (
            <div className="space-y-3">
              {productUsage.map((p, i) => {
                const pct = totalUsage > 0 ? (p.count / totalUsage) * 100 : 0;
                return (
                  <div key={p.product}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{p.product}</span>
                      <span className="text-xs text-muted-foreground">{p.count.toLocaleString()} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
