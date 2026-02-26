import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, RefreshCw, Loader2, Key, Webhook, Settings, Paintbrush, Users, LogIn } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const actionIcons: Record<string, any> = {
  api_key: Key,
  webhook: Webhook,
  widget: Paintbrush,
  settings: Settings,
  password: Settings,
  team: Users,
  login: LogIn,
  logout: LogIn,
};

const actionColors: Record<string, string> = {
  created: "bg-primary/10 text-primary",
  updated: "bg-accent/10 text-accent",
  configured: "bg-accent/10 text-accent",
  deleted: "bg-destructive/10 text-destructive",
  revoked: "bg-destructive/10 text-destructive",
  changed: "bg-yellow-500/10 text-yellow-500",
  toggled: "bg-yellow-500/10 text-yellow-500",
  invited: "bg-primary/10 text-primary",
  role_changed: "bg-accent/10 text-accent",
  login: "bg-primary/10 text-primary",
  logout: "bg-muted text-muted-foreground",
};

export default function AuditTrail() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as AuditEntry[];
    },
    enabled: !!user,
  });

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource_type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.resource_type === typeFilter;
    return matchSearch && matchType;
  });

  const resourceTypes = [...new Set(logs.map((l) => l.resource_type))];

  const getActionVerb = (action: string) => action.split(".").pop() || action;
  const getActionCategory = (action: string) => action.split(".")[0] || action;

  const getIcon = (action: string) => {
    const category = getActionCategory(action);
    const Icon = actionIcons[category] || Shield;
    return Icon;
  };

  const getColor = (action: string) => {
    const verb = getActionVerb(action);
    return actionColors[verb] || "bg-secondary text-foreground";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">Immutable log of all account actions for compliance</p>
        </div>
        <Button variant="outline" className="mt-4 lg:mt-0" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-xl font-bold text-foreground">{logs.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resource Types</p>
            <p className="text-xl font-bold text-foreground">{resourceTypes.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Events</p>
            <p className="text-xl font-bold text-foreground">
              {logs.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </Card>
      </div>
      <Card className="p-4 bg-card border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] bg-secondary border-border">
              <SelectValue placeholder="Resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {resourceTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      <Card className="bg-card border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit events recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((entry) => {
              const Icon = getIcon(entry.action);
              const color = getColor(entry.action);
              return (
                <div key={entry.id} className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{entry.action}</span>
                      <Badge variant="outline" className="text-xs">{entry.resource_type}</Badge>
                      {entry.resource_id && (
                        <code className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          {entry.resource_id.slice(0, 8)}…
                        </code>
                      )}
                    </div>
                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {JSON.stringify(entry.details)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
