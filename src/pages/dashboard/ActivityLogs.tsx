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
  RefreshCw
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  duration: number;
  ip: string;
  userAgent: string;
}

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: "2024-01-20 14:32:45", method: "POST", endpoint: "/v1/bnpl/bills/create", status: 200, duration: 145, ip: "192.168.1.1", userAgent: "Node.js/18.0" },
  { id: "2", timestamp: "2024-01-20 14:32:40", method: "GET", endpoint: "/v1/spendnest/categories", status: 200, duration: 89, ip: "192.168.1.1", userAgent: "Node.js/18.0" },
  { id: "3", timestamp: "2024-01-20 14:32:35", method: "POST", endpoint: "/v1/earlypay/advance", status: 201, duration: 234, ip: "192.168.1.2", userAgent: "Python/3.9" },
  { id: "4", timestamp: "2024-01-20 14:32:30", method: "GET", endpoint: "/v1/rewards/balance/usr_123", status: 404, duration: 45, ip: "192.168.1.1", userAgent: "Node.js/18.0" },
  { id: "5", timestamp: "2024-01-20 14:32:25", method: "POST", endpoint: "/v1/travel/book", status: 500, duration: 1234, ip: "192.168.1.3", userAgent: "Go/1.20" },
  { id: "6", timestamp: "2024-01-20 14:32:20", method: "GET", endpoint: "/v1/autofloat/forecast/usr_456", status: 200, duration: 178, ip: "192.168.1.1", userAgent: "Node.js/18.0" },
  { id: "7", timestamp: "2024-01-20 14:32:15", method: "DELETE", endpoint: "/v1/bnpl/bills/bnpl_789", status: 204, duration: 67, ip: "192.168.1.2", userAgent: "Python/3.9" },
  { id: "8", timestamp: "2024-01-20 14:32:10", method: "POST", endpoint: "/v1/latefees/protect", status: 200, duration: 156, ip: "192.168.1.1", userAgent: "Node.js/18.0" },
];

const methodColors: Record<string, string> = {
  GET: "bg-primary/20 text-primary",
  POST: "bg-accent/20 text-accent",
  PUT: "bg-yellow-500/20 text-yellow-500",
  DELETE: "bg-destructive/20 text-destructive",
};

const ActivityLogs = () => {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.endpoint.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "success" && log.status < 400) ||
      (statusFilter === "error" && log.status >= 400);
    const matchesMethod = methodFilter === "all" || log.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor your API requests in real-time</p>
        </div>
        <Button variant="outline" className="mt-4 lg:mt-0">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-xl font-bold text-foreground">12,847</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-xl font-bold text-foreground">99.2%</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Latency</p>
            <p className="text-xl font-bold text-foreground">142ms</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Errors (24h)</p>
            <p className="text-xl font-bold text-foreground">23</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search endpoints..." 
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

      {/* Logs Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">IP Address</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`font-mono text-sm ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${methodColors[log.method]} font-mono text-xs`}>
                      {log.method}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <code className="text-sm font-mono text-foreground">{log.endpoint}</code>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-sm ${log.duration > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {log.duration}ms
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground font-mono">{log.ip}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{log.timestamp.split(' ')[1]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Load More */}
      <div className="flex justify-center mt-6">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
};

export default ActivityLogs;
