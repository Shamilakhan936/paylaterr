import { useState, useEffect, useRef } from "react";
import { Search, X, Layers, AlertTriangle, Activity, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SearchResult {
  type: "schedule" | "dispute" | "log";
  id: string;
  title: string;
  subtitle: string;
  route: string;
}

export function DashboardSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim() || !user) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase();
      const [schedules, disputes, logs] = await Promise.all([
        supabase.from("installment_schedules").select("id, plan_name, customer_name, status").ilike("plan_name", `%${q}%`).limit(5),
        supabase.from("disputes").select("id, reason, status, priority").ilike("reason", `%${q}%`).limit(5),
        supabase.from("api_request_logs").select("id, product, endpoint, status_code").ilike("endpoint", `%${q}%`).limit(5),
      ]);
      const items: SearchResult[] = [
        ...(schedules.data || []).map(s => ({ type: "schedule" as const, id: s.id, title: s.plan_name, subtitle: `${s.customer_name} · ${s.status}`, route: "/dashboard/orchestration" })),
        ...(disputes.data || []).map(d => ({ type: "dispute" as const, id: d.id, title: d.reason, subtitle: `${d.priority} · ${d.status}`, route: "/dashboard/disputes" })),
        ...(logs.data || []).map(l => ({ type: "log" as const, id: l.id, title: l.endpoint, subtitle: `${l.product} · ${l.status_code}`, route: "/dashboard/logs" })),
      ];
      setResults(items);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, user]);

  const icons = { schedule: Layers, dispute: AlertTriangle, log: Activity };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search schedules, disputes, logs..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="pl-10 pr-8 bg-secondary border-border"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      {open && query.trim() && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Searching…</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No results found</p>
          ) : (
            results.map(r => {
              const Icon = icons[r.type];
              return (
                <button
                  key={r.id}
                  onClick={() => { navigate(r.route); setOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{r.type}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
