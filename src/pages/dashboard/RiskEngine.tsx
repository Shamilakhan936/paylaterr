import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Settings,
  Plus,
  MoreVertical,
  Loader2,
  Trash2,
  Pencil,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskRule {
  id: string;
  rule_name: string;
  field: string;
  operator: string;
  threshold: number;
  risk_action: string;
  severity: string;
  enabled: boolean;
  created_at: string;
}

const FIELDS = [
  { value: "credit_score", label: "Credit Score" },
  { value: "income", label: "Income" },
  { value: "dti_ratio", label: "Debt-to-Income Ratio" },
  { value: "requested_amount", label: "Requested Amount" },
  { value: "account_age_months", label: "Account Age (months)" },
  { value: "missed_payments", label: "Missed Payments" },
];

const OPERATORS = [
  { value: "gte", label: "≥ (greater or equal)" },
  { value: "lte", label: "≤ (less or equal)" },
  { value: "gt", label: "> (greater than)" },
  { value: "lt", label: "< (less than)" },
  { value: "eq", label: "= (equals)" },
];

const ACTIONS = [
  { value: "approve", label: "Auto Approve" },
  { value: "flag", label: "Flag for Review" },
  { value: "reject", label: "Auto Reject" },
  { value: "escalate", label: "Escalate" },
];

const SEVERITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const severityColors: Record<string, string> = {
  low: "bg-primary/10 text-primary",
  medium: "bg-accent/10 text-accent",
  high: "bg-yellow-500/10 text-yellow-500",
  critical: "bg-destructive/10 text-destructive",
};

const actionColors: Record<string, string> = {
  approve: "bg-primary/10 text-primary",
  flag: "bg-accent/10 text-accent",
  reject: "bg-destructive/10 text-destructive",
  escalate: "bg-yellow-500/10 text-yellow-500",
};

const DashboardRiskEngine = () => {
  const { user } = useAuth();
  const { log } = useAuditLog();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RiskRule | null>(null);
  const [form, setForm] = useState({
    rule_name: "",
    field: "credit_score",
    operator: "lt",
    threshold: 600,
    risk_action: "flag",
    severity: "medium",
  });

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["risk-rules"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("risk_rules")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as RiskRule[];
    },
    enabled: !!user,
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ["risk-assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_request_logs")
        .select("*")
        .eq("product", "decision-engine")
        .order("request_timestamp", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const { error } = await (supabase as any).from("risk_rules").insert({
        user_id: user!.id,
        ...values,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
      log("widget.configured", "risk_rule", undefined, { action: "created" });
      toast({ title: "Rule created" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & typeof form) => {
      const { error } = await (supabase as any)
        .from("risk_rules")
        .update(values)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
      toast({ title: "Rule updated" });
      resetForm();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await (supabase as any)
        .from("risk_rules")
        .update({ enabled })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["risk-rules"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("risk_rules")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
      toast({ title: "Rule deleted" });
    },
  });

  const resetForm = () => {
    setForm({ rule_name: "", field: "credit_score", operator: "lt", threshold: 600, risk_action: "flag", severity: "medium" });
    setEditingRule(null);
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!form.rule_name.trim()) {
      toast({ title: "Rule name is required", variant: "destructive" });
      return;
    }
    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const openEdit = (rule: RiskRule) => {
    setEditingRule(rule);
    setForm({
      rule_name: rule.rule_name,
      field: rule.field,
      operator: rule.operator,
      threshold: rule.threshold,
      risk_action: rule.risk_action,
      severity: rule.severity,
    });
    setDialogOpen(true);
  };

  const operatorSymbol = (op: string) =>
    OPERATORS.find((o) => o.value === op)?.label.split(" ")[0] || op;

  const activeRules = rules.filter((r) => r.enabled).length;
  const criticalRules = rules.filter((r) => r.severity === "critical" || r.severity === "high").length;

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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Risk Engine</h1>
          <p className="text-muted-foreground mt-1">Configure rules and monitor risk assessments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">{editingRule ? "Edit Rule" : "Create Risk Rule"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 mt-2">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Rule Name</label>
                <Input
                  placeholder="e.g. Low credit score flag"
                  value={form.rule_name}
                  onChange={(e) => setForm((f) => ({ ...f, rule_name: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Field</label>
                  <Select value={form.field} onValueChange={(v) => setForm((f) => ({ ...f, field: v }))}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FIELDS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Operator</label>
                  <Select value={form.operator} onValueChange={(v) => setForm((f) => ({ ...f, operator: v }))}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Threshold</label>
                <Input
                  type="number"
                  value={form.threshold}
                  onChange={(e) => setForm((f) => ({ ...f, threshold: Number(e.target.value) }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Action</label>
                  <Select value={form.risk_action} onValueChange={(v) => setForm((f) => ({ ...f, risk_action: v }))}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Severity</label>
                  <Select value={form.severity} onValueChange={(v) => setForm((f) => ({ ...f, severity: v }))}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEVERITIES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full min-h-10 text-sm touch-manipulation" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />}
                {editingRule ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{rules.length}</p>
              <p className="text-sm text-muted-foreground">Total Rules</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeRules}</p>
              <p className="text-sm text-muted-foreground">Active Rules</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{criticalRules}</p>
              <p className="text-sm text-muted-foreground">High/Critical</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
              <p className="text-sm text-muted-foreground">Recent Assessments</p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Configured Rules</h3>
        {rules.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rules configured yet. Add your first rule to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  rule.enabled ? "bg-secondary/30 border-border" : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: rule.id, enabled: checked })}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{rule.rule_name}</span>
                      <Badge className={severityColors[rule.severity] || ""}>{rule.severity}</Badge>
                      <Badge className={actionColors[rule.risk_action] || ""}>{rule.risk_action}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      If <span className="font-mono text-foreground">{FIELDS.find((f) => f.value === rule.field)?.label || rule.field}</span>{" "}
                      {operatorSymbol(rule.operator)}{" "}
                      <span className="font-mono text-foreground">{rule.threshold}</span>
                      {" → "}{ACTIONS.find((a) => a.value === rule.risk_action)?.label || rule.risk_action}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 touch-manipulation shrink-0"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    className="max-w-[min(16rem,calc(100vw-2rem))] min-w-[10rem] py-1"
                    sideOffset={6}
                    collisionPadding={12}
                  >
                    <DropdownMenuItem onClick={() => openEdit(rule)} className="py-2.5 sm:py-1.5 cursor-pointer">
                      <Pencil className="w-4 h-4 mr-2 shrink-0" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive py-2.5 sm:py-1.5 cursor-pointer"
                      onClick={() => deleteMutation.mutate(rule.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2 shrink-0" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Decision Engine Assessments</h3>
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No assessments yet. Use the API Playground to run evaluations.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assessments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    (a.status_code || 0) < 400 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  }`}>
                    {a.status_code}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.endpoint}</p>
                    <p className="text-xs text-muted-foreground">{a.response_time_ms}ms • {a.method}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.request_timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardRiskEngine;
