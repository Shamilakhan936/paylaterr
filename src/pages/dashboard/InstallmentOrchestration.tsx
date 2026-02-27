import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CreditCard, BookOpen, AlertTriangle, Banknote, RotateCcw, Plus, Trash2, Download, Bell, BellRing, CheckCircle2, DollarSign, Clock, TrendingUp, X } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency";

type TabKey = "schedules" | "autopay" | "ledger" | "late-fees" | "disbursements" | "servicing" | "reminders" | "alerts";

const productOptions = [
  { value: "bnpl_bills", label: "BNPL for Bills" },
  { value: "late_fees", label: "Late Fees" },
  { value: "auto_float", label: "AutoFloat" },
  { value: "bill_rewards", label: "Bill Rewards" },
];

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  paid: "bg-primary/10 text-primary border-primary/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  disbursed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

/* ─── CSV EXPORT HELPER ─── */
function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── KPI SUMMARY CARDS ─── */
function SummaryCards() {
  const { data: schedules } = useQuery({
    queryKey: ["kpi_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installment_schedules").select("*, installment_items(*)");
      if (error) throw error;
      return data;
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ["orchestration_alerts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("orchestration_alerts").select("*").eq("read", false);
      if (error) throw error;
      return data;
    },
  });

  if (!schedules) return null;

  const totalOutstanding = schedules.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const allItems = schedules.flatMap((s: any) => s.installment_items ?? []);
  const paidItems = allItems.filter((i: any) => i.status === "paid");
  const overdueItems = allItems.filter((i: any) => i.status === "pending" && new Date(i.due_date) < new Date());
  const collectionRate = allItems.length > 0 ? Math.round((paidItems.length / allItems.length) * 100) : 0;
  const paidAmount = paidItems.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const unreadAlerts = alerts?.length ?? 0;

  const cards = [
    { label: "Total Outstanding", value: formatCurrency(totalOutstanding), icon: DollarSign, color: "text-primary" },
    { label: "Collection Rate", value: `${collectionRate}%`, icon: TrendingUp, color: "text-emerald-400" },
    { label: "Collected", value: formatCurrency(paidAmount), icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Overdue Items", value: String(overdueItems.length), icon: Clock, color: overdueItems.length > 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Active Schedules", value: String(schedules.filter(s => s.status === "active").length), icon: Calendar, color: "text-primary" },
    { label: "Unread Alerts", value: String(unreadAlerts), icon: BellRing, color: unreadAlerts > 0 ? "text-amber-400" : "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(c => (
        <Card key={c.label} className="border-border bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`w-4 h-4 ${c.color}`} />
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function InstallmentOrchestration() {
  const [activeTab, setActiveTab] = useState<TabKey>("schedules");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Installment Orchestration Engine</h1>
        <p className="text-muted-foreground mt-1">Manage schedule generation, autopay, ledger, late fees, disbursements & servicing lifecycle.</p>
      </div>

      <SummaryCards />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList className="bg-secondary/50 border border-border flex-wrap h-auto gap-1">
          <TabsTrigger value="schedules" className="gap-2"><Calendar className="w-4 h-4" />Schedules</TabsTrigger>
          <TabsTrigger value="autopay" className="gap-2"><CreditCard className="w-4 h-4" />Autopay</TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2"><BookOpen className="w-4 h-4" />Ledger</TabsTrigger>
          <TabsTrigger value="late-fees" className="gap-2"><AlertTriangle className="w-4 h-4" />Late Fees</TabsTrigger>
          <TabsTrigger value="disbursements" className="gap-2"><Banknote className="w-4 h-4" />Disbursements</TabsTrigger>
          <TabsTrigger value="servicing" className="gap-2"><RotateCcw className="w-4 h-4" />Servicing</TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2"><Bell className="w-4 h-4" />Reminders</TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2"><BellRing className="w-4 h-4" />Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules"><SchedulesTab /></TabsContent>
        <TabsContent value="autopay"><AutopayTab /></TabsContent>
        <TabsContent value="ledger"><LedgerTab /></TabsContent>
        <TabsContent value="late-fees"><LateFeesTab /></TabsContent>
        <TabsContent value="disbursements"><DisbursementsTab /></TabsContent>
        <TabsContent value="servicing"><ServicingTab /></TabsContent>
        <TabsContent value="reminders"><RemindersTab /></TabsContent>
        <TabsContent value="alerts"><AlertsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── SCHEDULES TAB ─── */
function SchedulesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer_name: "", plan_name: "", total_amount: "", installment_count: "4", frequency: "monthly", product: "bnpl_bills", start_date: format(new Date(), "yyyy-MM-dd") });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["installment_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installment_schedules").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const amount = parseFloat(form.total_amount);
      const count = parseInt(form.installment_count);
      const { data: schedule, error } = await supabase.from("installment_schedules").insert({
        user_id: user!.id, customer_name: form.customer_name, plan_name: form.plan_name,
        total_amount: amount, installment_count: count, frequency: form.frequency,
        product: form.product, start_date: form.start_date,
      }).select().single();
      if (error) throw error;

      const perInstallment = Math.round((amount / count) * 100) / 100;
      const items = Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(form.start_date);
        if (form.frequency === "monthly") dueDate.setMonth(dueDate.getMonth() + i);
        else if (form.frequency === "biweekly") dueDate.setDate(dueDate.getDate() + i * 14);
        else dueDate.setDate(dueDate.getDate() + i * 7);
        return {
          schedule_id: schedule.id, user_id: user!.id, installment_number: i + 1,
          due_date: format(dueDate, "yyyy-MM-dd"), amount: i === count - 1 ? Math.round((amount - perInstallment * (count - 1)) * 100) / 100 : perInstallment,
        };
      });
      const { error: itemsError } = await supabase.from("installment_items").insert(items);
      if (itemsError) throw itemsError;

      await supabase.from("ledger_entries").insert({
        user_id: user!.id, schedule_id: schedule.id, entry_type: "schedule_created",
        debit: amount, credit: 0, balance_after: amount, description: `Schedule created: ${form.plan_name}`,
      });

      // Create alert for new schedule
      await (supabase as any).from("orchestration_alerts").insert({
        user_id: user!.id, alert_type: "schedule_created", title: "New Schedule Created",
        message: `"${form.plan_name}" for ${form.customer_name} — $${amount.toLocaleString()} in ${count} installments.`,
        severity: "info", schedule_id: schedule.id,
      });

      return schedule;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["installment_schedules"] });
      qc.invalidateQueries({ queryKey: ["ledger_entries"] });
      qc.invalidateQueries({ queryKey: ["orchestration_alerts"] });
      qc.invalidateQueries({ queryKey: ["kpi_schedules"] });
      toast({ title: "Schedule created", description: "Installment schedule and items generated." });
      setOpen(false);
      setForm({ customer_name: "", plan_name: "", total_amount: "", installment_count: "4", frequency: "monthly", product: "bnpl_bills", start_date: format(new Date(), "yyyy-MM-dd") });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleExport = () => {
    if (!schedules?.length) return;
    exportToCSV("schedules", ["Plan", "Customer", "Product", "Amount", "Installments", "Frequency", "Start", "Status"],
      schedules.map(s => [s.plan_name, s.customer_name, s.product, String(s.total_amount), String(s.installment_count), s.frequency, s.start_date, s.status]));
    toast({ title: "Exported", description: "Schedules exported to CSV." });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Schedules</CardTitle>
          <CardDescription>Generate and manage installment schedules for BNPL, bills, and more.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!schedules?.length}><Download className="w-4 h-4" />Export</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />New Schedule</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Installment Schedule</DialogTitle>
                <DialogDescription>Generate a new payment schedule with automatic installment items.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Customer Name</Label><Input value={form.customer_name} onChange={(e) => setForm(f => ({ ...f, customer_name: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Plan Name</Label><Input value={form.plan_name} onChange={(e) => setForm(f => ({ ...f, plan_name: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Total Amount</Label><Input type="number" value={form.total_amount} onChange={(e) => setForm(f => ({ ...f, total_amount: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Installments</Label><Input type="number" value={form.installment_count} onChange={(e) => setForm(f => ({ ...f, installment_count: e.target.value }))} /></div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={form.frequency} onValueChange={(v) => setForm(f => ({ ...f, frequency: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={form.product} onValueChange={(v) => setForm(f => ({ ...f, product: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{productOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.customer_name || !form.plan_name || !form.total_amount}>
                  {createMutation.isPending ? "Creating..." : "Generate Schedule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead>
                <TableHead>Amount</TableHead><TableHead>Installments</TableHead><TableHead>Frequency</TableHead>
                <TableHead>Start</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules?.length === 0 && <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No schedules yet. Create your first one above.</TableCell></TableRow>}
              {schedules?.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.plan_name}</TableCell>
                  <TableCell>{s.customer_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{productOptions.find(p => p.value === s.product)?.label ?? s.product}</Badge></TableCell>
                  <TableCell>{formatCurrency(Number(s.total_amount), s.currency)}</TableCell>
                  <TableCell>{s.installment_count}</TableCell>
                  <TableCell className="capitalize">{s.frequency}</TableCell>
                  <TableCell>{s.start_date}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[s.status] ?? ""}>{s.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" title="Download Statement" onClick={async () => {
                      const { data: { session } } = await supabase.auth.getSession();
                      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
                      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/generate-statement?schedule_id=${s.id}&type=statement`, {
                        headers: { Authorization: `Bearer ${session?.access_token}` },
                      });
                      const html = await res.text();
                      const blob = new Blob([html], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── AUTOPAY TAB ─── */
function AutopayTab() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: configs, isLoading } = useQuery({
    queryKey: ["autopay_configs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("autopay_configs").select("*, installment_schedules(plan_name, customer_name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase.from("autopay_configs").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autopay_configs"] }),
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Autopay Configurations</CardTitle>
        <CardDescription>Manage automatic payment setups linked to installment schedules.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule</TableHead><TableHead>Customer</TableHead><TableHead>Method</TableHead>
                <TableHead>Account</TableHead><TableHead>Retry</TableHead><TableHead>Max Retries</TableHead><TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs?.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No autopay configurations.</TableCell></TableRow>}
              {configs?.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.installment_schedules?.plan_name ?? "—"}</TableCell>
                  <TableCell>{c.installment_schedules?.customer_name ?? "—"}</TableCell>
                  <TableCell className="uppercase">{c.payment_method}</TableCell>
                  <TableCell>{c.account_last4 ? `••••${c.account_last4}` : "—"}</TableCell>
                  <TableCell>{c.retry_on_failure ? "Yes" : "No"}</TableCell>
                  <TableCell>{c.max_retries}</TableCell>
                  <TableCell><Switch checked={c.enabled} onCheckedChange={(v) => toggleMutation.mutate({ id: c.id, enabled: v })} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── LEDGER TAB ─── */
function LedgerTab() {
  const { toast } = useToast();
  const { data: entries, isLoading } = useQuery({
    queryKey: ["ledger_entries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ledger_entries").select("*, installment_schedules(plan_name)").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });

  const handleExport = () => {
    if (!entries?.length) return;
    exportToCSV("ledger", ["Date", "Type", "Schedule", "Debit", "Credit", "Balance", "Description"],
      entries.map((e: any) => [format(new Date(e.created_at), "yyyy-MM-dd HH:mm"), e.entry_type, e.installment_schedules?.plan_name ?? "", String(e.debit), String(e.credit), String(e.balance_after), e.description ?? ""]));
    toast({ title: "Exported", description: "Ledger exported to CSV." });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>Double-entry style transaction log for all installment operations.</CardDescription>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!entries?.length}><Download className="w-4 h-4" />Export</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Schedule</TableHead>
                <TableHead>Debit</TableHead><TableHead>Credit</TableHead><TableHead>Balance</TableHead><TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No ledger entries yet.</TableCell></TableRow>}
              {entries?.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs">{format(new Date(e.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.entry_type.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell>{e.installment_schedules?.plan_name ?? "—"}</TableCell>
                  <TableCell className="text-destructive">{Number(e.debit) > 0 ? formatCurrency(Number(e.debit)) : "—"}</TableCell>
                  <TableCell className="text-emerald-400">{Number(e.credit) > 0 ? formatCurrency(Number(e.credit)) : "—"}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(Number(e.balance_after))}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{e.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── LATE FEES TAB ─── */
function LateFeesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "bnpl_bills", grace_period_days: "5", fee_type: "flat", fee_amount: "25", fee_percentage: "0", max_fee: "", compound: false });

  const { data: rules, isLoading } = useQuery({
    queryKey: ["late_fee_rules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("late_fee_rules").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("late_fee_rules").insert({
        user_id: user!.id, product: form.product, grace_period_days: parseInt(form.grace_period_days),
        fee_type: form.fee_type, fee_amount: parseFloat(form.fee_amount || "0"),
        fee_percentage: parseFloat(form.fee_percentage || "0"),
        max_fee: form.max_fee ? parseFloat(form.max_fee) : null, compound: form.compound,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["late_fee_rules"] });
      toast({ title: "Late fee rule created" });
      setOpen(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("late_fee_rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["late_fee_rules"] }); toast({ title: "Rule deleted" }); },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase.from("late_fee_rules").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["late_fee_rules"] }),
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Late Fee Rules</CardTitle>
          <CardDescription>Configure grace periods, flat/percentage fees, compounding, and caps per product.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />New Rule</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Late Fee Rule</DialogTitle>
              <DialogDescription>Define how late fees are calculated for a product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={form.product} onValueChange={(v) => setForm(f => ({ ...f, product: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{productOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Grace Period (days)</Label><Input type="number" value={form.grace_period_days} onChange={(e) => setForm(f => ({ ...f, grace_period_days: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fee Type</Label>
                  <Select value={form.fee_type} onValueChange={(v) => setForm(f => ({ ...f, fee_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Flat Amount ($)</Label><Input type="number" value={form.fee_amount} onChange={(e) => setForm(f => ({ ...f, fee_amount: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Percentage (%)</Label><Input type="number" value={form.fee_percentage} onChange={(e) => setForm(f => ({ ...f, fee_percentage: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Max Fee Cap ($)</Label><Input type="number" value={form.max_fee} onChange={(e) => setForm(f => ({ ...f, max_fee: e.target.value }))} placeholder="No cap" /></div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.compound} onCheckedChange={(v) => setForm(f => ({ ...f, compound: v }))} />
                  <Label>Compound late fees</Label>
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>{createMutation.isPending ? "Creating..." : "Create Rule"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead><TableHead>Grace Period</TableHead><TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead><TableHead>Max Cap</TableHead><TableHead>Compound</TableHead><TableHead>Enabled</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules?.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No late fee rules configured.</TableCell></TableRow>}
              {rules?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><Badge variant="outline" className="text-xs">{productOptions.find(p => p.value === r.product)?.label ?? r.product}</Badge></TableCell>
                  <TableCell>{r.grace_period_days} days</TableCell>
                  <TableCell className="capitalize">{r.fee_type}</TableCell>
                  <TableCell>{r.fee_type === "flat" ? `$${Number(r.fee_amount)}` : `${Number(r.fee_percentage)}%`}</TableCell>
                  <TableCell>{r.max_fee ? `$${Number(r.max_fee)}` : "No cap"}</TableCell>
                  <TableCell>{r.compound ? "Yes" : "No"}</TableCell>
                  <TableCell><Switch checked={r.enabled} onCheckedChange={(v) => toggleMutation.mutate({ id: r.id, enabled: v })} /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── DISBURSEMENTS TAB ─── */
function DisbursementsTab() {
  const { toast } = useToast();
  const { data: disbursements, isLoading } = useQuery({
    queryKey: ["biller_disbursements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("biller_disbursements").select("*, installment_schedules(plan_name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleExport = () => {
    if (!disbursements?.length) return;
    exportToCSV("disbursements", ["Biller", "Account", "Schedule", "Amount", "Reference", "Disbursed At", "Status"],
      disbursements.map((d: any) => [d.biller_name, d.biller_account ?? "", d.installment_schedules?.plan_name ?? "", String(d.amount), d.reference_number ?? "", d.disbursed_at ?? "", d.status]));
    toast({ title: "Exported", description: "Disbursements exported to CSV." });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Biller Disbursements</CardTitle>
          <CardDescription>Track fund disbursements to billers and merchants.</CardDescription>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!disbursements?.length}><Download className="w-4 h-4" />Export</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biller</TableHead><TableHead>Account</TableHead><TableHead>Schedule</TableHead>
                <TableHead>Amount</TableHead><TableHead>Reference</TableHead><TableHead>Disbursed At</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursements?.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No disbursements yet.</TableCell></TableRow>}
              {disbursements?.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.biller_name}</TableCell>
                  <TableCell>{d.biller_account ?? "—"}</TableCell>
                  <TableCell>{d.installment_schedules?.plan_name ?? "—"}</TableCell>
                  <TableCell>${Number(d.amount).toLocaleString()}</TableCell>
                  <TableCell className="text-xs font-mono">{d.reference_number ?? "—"}</TableCell>
                  <TableCell>{d.disbursed_at ? format(new Date(d.disbursed_at), "MMM dd, yyyy") : "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[d.status] ?? ""}>{d.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── SERVICING TAB ─── */
function ServicingTab() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["servicing_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installment_schedules").select("*, installment_items(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Servicing Lifecycle</CardTitle>
        <CardDescription>Monitor the full lifecycle of each installment schedule — from creation through completion or delinquency.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="space-y-4">
            {schedules?.length === 0 && <p className="text-center text-muted-foreground py-8">No schedules to service.</p>}
            {schedules?.map((s: any) => {
              const items = s.installment_items ?? [];
              const paid = items.filter((i: any) => i.status === "paid").length;
              const overdue = items.filter((i: any) => i.status === "overdue" || (i.status === "pending" && new Date(i.due_date) < new Date())).length;
              const progress = items.length > 0 ? Math.round((paid / items.length) * 100) : 0;

              return (
                <Card key={s.id} className="border-border bg-secondary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{s.plan_name}</p>
                        <p className="text-sm text-muted-foreground">{s.customer_name} · {productOptions.find(p => p.value === s.product)?.label}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={statusColor[s.status] ?? ""}>{s.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{paid}/{items.length} paid{overdue > 0 && <span className="text-destructive"> · {overdue} overdue</span>}</p>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    {items.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {items.sort((a: any, b: any) => a.installment_number - b.installment_number).map((item: any) => {
                          const isOverdue = item.status === "pending" && new Date(item.due_date) < new Date();
                          return (
                            <div key={item.id} className={`rounded-lg border p-2 text-center text-xs ${isOverdue ? "border-destructive/50 bg-destructive/5" : item.status === "paid" ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card"}`}>
                              <p className="font-medium">#{item.installment_number}</p>
                              <p className="text-muted-foreground">${Number(item.amount)}</p>
                              <p className={isOverdue ? "text-destructive" : item.status === "paid" ? "text-emerald-400" : "text-muted-foreground"}>
                                {isOverdue ? "Overdue" : item.status}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── REMINDERS TAB ─── */
function RemindersTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ schedule_id: "", days_before: "3", reminder_type: "all" });

  const { data: schedules } = useQuery({
    queryKey: ["installment_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installment_schedules").select("id, plan_name, customer_name").eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["payment_reminders"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("payment_reminders").select("*, installment_schedules(plan_name, customer_name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("payment_reminders").insert({
        user_id: user!.id,
        schedule_id: form.schedule_id && form.schedule_id !== "__all__" ? form.schedule_id : null,
        days_before: parseInt(form.days_before),
        reminder_type: form.reminder_type,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment_reminders"] });
      toast({ title: "Reminder configured" });
      setOpen(false);
      setForm({ schedule_id: "", days_before: "3", reminder_type: "all" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("payment_reminders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payment_reminders"] }); toast({ title: "Reminder deleted" }); },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await (supabase as any).from("payment_reminders").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment_reminders"] }),
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Reminders</CardTitle>
          <CardDescription>Configure reminder schedules to notify before installment due dates.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />New Reminder</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Payment Reminder</DialogTitle>
              <DialogDescription>Set up automated reminders before installment due dates.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Schedule (optional — leave blank for all)</Label>
                <Select value={form.schedule_id} onValueChange={(v) => setForm(f => ({ ...f, schedule_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="All active schedules" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All active schedules</SelectItem>
                    {schedules?.map(s => <SelectItem key={s.id} value={s.id}>{s.plan_name} — {s.customer_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Days Before Due</Label>
                  <Input type="number" min="1" value={form.days_before} onChange={(e) => setForm(f => ({ ...f, days_before: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select value={form.reminder_type} onValueChange={(v) => setForm(f => ({ ...f, reminder_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="in_app">In-App Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>{createMutation.isPending ? "Creating..." : "Create Reminder"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule</TableHead><TableHead>Days Before</TableHead><TableHead>Type</TableHead><TableHead>Enabled</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No reminders configured.</TableCell></TableRow>}
              {reminders?.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.installment_schedules?.plan_name ?? "All Schedules"}</TableCell>
                  <TableCell>{r.days_before} days</TableCell>
                  <TableCell className="capitalize">{r.reminder_type.replace(/_/g, " ")}</TableCell>
                  <TableCell><Switch checked={r.enabled} onCheckedChange={(v) => toggleMutation.mutate({ id: r.id, enabled: v })} /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── ALERTS TAB ─── */
function AlertsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["orchestration_alerts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("orchestration_alerts").select("*, installment_schedules(plan_name)").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("orchestration_alerts").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orchestration_alerts"] }); qc.invalidateQueries({ queryKey: ["kpi_schedules"] }); },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("orchestration_alerts").update({ read: true }).eq("user_id", user!.id).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orchestration_alerts"] });
      qc.invalidateQueries({ queryKey: ["kpi_schedules"] });
      toast({ title: "All alerts marked as read" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("orchestration_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orchestration_alerts"] }); qc.invalidateQueries({ queryKey: ["kpi_schedules"] }); },
  });

  const severityColor: Record<string, string> = {
    info: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const unreadCount = alerts?.filter((a: any) => !a.read).length ?? 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{unreadCount} unread</Badge>}
          </CardTitle>
          <CardDescription>In-app alerts for overdue payments, failed autopay, schedule milestones, and more.</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={() => markAllReadMutation.mutate()}>
            <CheckCircle2 className="w-4 h-4" />Mark All Read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="space-y-3">
            {alerts?.length === 0 && <p className="text-center text-muted-foreground py-8">No alerts yet. Alerts are created automatically when schedules change, payments are overdue, or autopay fails.</p>}
            {alerts?.map((a: any) => (
              <div key={a.id} className={`flex items-start gap-3 p-4 rounded-lg border ${a.read ? "border-border bg-card opacity-60" : "border-border bg-secondary/20"}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-xs ${severityColor[a.severity] ?? ""}`}>{a.severity}</Badge>
                    <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM dd, yyyy HH:mm")}</span>
                    {a.installment_schedules?.plan_name && <span className="text-xs text-muted-foreground">· {a.installment_schedules.plan_name}</span>}
                  </div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.message}</p>
                </div>
                <div className="flex gap-1">
                  {!a.read && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markReadMutation.mutate(a.id)}>
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMutation.mutate(a.id)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
