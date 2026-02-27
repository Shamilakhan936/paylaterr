import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Activity, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Loader2,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { exportToCsv } from "@/lib/exportCsv";

interface LogEntry {
  id: string;
  product: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
}

const methodColors: Record<string, string> = {
  GET: "bg-primary/20 text-primary",
  POST: "bg-accent/20 text-accent",
  PUT: "bg-yellow-500/20 text-yellow-500",
  DELETE: "bg-destructive/20 text-destructive",
};

const ActivityLogs = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_request_logs")
        .select("*")
        .order("request_timestamp", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as LogEntry[];
    },
    enabled: !!user,
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      log.product.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "success" && (log.status_code || 0) < 400) ||
      (statusFilter === "error" && (log.status_code || 0) >= 400);
    const matchesMethod = methodFilter === "all" || log.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const successRate = logs.length > 0
    ? ((logs.filter(l => (l.status_code || 0) < 400).length / logs.length) * 100).toFixed(1)
    : "0";

  const avgLatency = logs.length > 0
    ? Math.round(logs.reduce((sum, l) => sum + (l.response_time_ms || 0), 0) / logs.length)
    : 0;

  const errors24h = logs.filter(l => (l.status_code || 0) >= 400).length;

  const getStatusIcon = (status: number) => {
    if (status < 300) return <CheckCircle className="w-4 h-4 text-primary" />;
    if (status < 400) return <ArrowRight className="w-4 h-4 text-accent" />;
    if (status < 500) return <XCircle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-destructive" />;
  };

  const getStatusColor = (status: number) => {
    if (status < 300) return "text-primary";
    if (status < 400) return "text-accent";
    if (status < 500) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor your API requests in real-time</p>
        </div>
        <div className="flex gap-2 mt-4 lg:mt-0">
          <Button variant="outline" onClick={() => exportToCsv("activity-logs", filteredLogs)}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-xl font-bold text-foreground">{logs.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-xl font-bold text-foreground">{successRate}%</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Latency</p>
            <p className="text-xl font-bold text-foreground">{avgLatency}ms</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-xl font-bold text-foreground">{errors24h}</p>
          </div>
        </Card>
      </div>
      <Card className="p-4 bg-card border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search endpoints or products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-3">
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[130px] bg-secondary border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      <Card className="bg-card border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {logs.length === 0 ? "No API requests yet. Try the API Playground!" : "No matching logs."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Method</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status_code || 0)}
                        <span className={`font-mono text-sm ${getStatusColor(log.status_code || 0)}`}>
                          {log.status_code}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${methodColors[log.method] || "bg-secondary text-foreground"} font-mono text-xs`}>
                        {log.method}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{log.product}</span>
                    </td>
                    <td className="p-4">
                      <code className="text-sm font-mono text-foreground">{log.endpoint}</code>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-sm ${(log.response_time_ms || 0) > 500 ? "text-destructive" : "text-muted-foreground"}`}>
                        {log.response_time_ms}ms
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.request_timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLogs;
