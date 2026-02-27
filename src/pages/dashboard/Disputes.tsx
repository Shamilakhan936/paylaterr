import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle, CheckCircle, Clock, XCircle, Plus, Loader2, MoreVertical, MessageSquare, FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  open: { color: "secondary", icon: Clock, label: "Open" },
  under_review: { color: "default", icon: MessageSquare, label: "Under Review" },
  resolved: { color: "default", icon: CheckCircle, label: "Resolved" },
  rejected: { color: "destructive", icon: XCircle, label: "Rejected" },
  escalated: { color: "destructive", icon: AlertTriangle, label: "Escalated" },
};

const REASONS = [
  "Unauthorized charge",
  "Duplicate payment",
  "Incorrect amount",
  "Service not rendered",
  "Billing error",
  "Fraud",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const DashboardDisputes = () => {
  const { user } = useAuth();
  const { log } = useAuditLog();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [resolveAction, setResolveAction] = useState<"resolved" | "rejected">("resolved");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    reason: "",
    description: "",
    priority: "medium",
    amount: "",
  });

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ["disputes"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const { error } = await (supabase as any).from("disputes").insert({
        user_id: user!.id,
        reason: values.reason,
        description: values.description || null,
        priority: values.priority,
        amount: parseFloat(values.amount) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      log("dispute.created", "dispute");
      toast({ title: "Dispute filed successfully" });
      resetForm();
    },
    onError: () => toast({ title: "Failed to file dispute", variant: "destructive" }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const update: any = { status };
      if (note) update.resolution_note = note;
      if (status === "resolved" || status === "rejected") update.resolved_at = new Date().toISOString();
      const { error } = await (supabase as any).from("disputes").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      toast({ title: "Dispute updated" });
      setResolveDialog(null);
      setResolveNote("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("disputes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      toast({ title: "Dispute deleted" });
    },
  });

  const resetForm = () => {
    setForm({ reason: "", description: "", priority: "medium", amount: "" });
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!form.reason) {
      toast({ title: "Select a reason", variant: "destructive" });
      return;
    }
    createMutation.mutate(form);
  };

  const filtered = statusFilter === "all" ? disputes : disputes.filter((d: any) => d.status === statusFilter);

  const openCount = disputes.filter((d: any) => d.status === "open").length;
  const reviewCount = disputes.filter((d: any) => d.status === "under_review").length;
  const resolvedCount = disputes.filter((d: any) => d.status === "resolved").length;
  const totalAmount = disputes.reduce((s: number, d: any) => s + Number(d.amount || 0), 0);

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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dispute Management</h1>
          <p className="text-muted-foreground mt-1">File and track chargebacks and payment disputes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0"><Plus className="w-4 h-4 mr-2" />File Dispute</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>File New Dispute</DialogTitle>
              <DialogDescription>Submit a dispute for review and resolution.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={form.reason} onValueChange={(v) => setForm(f => ({ ...f, reason: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>
                    {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Disputed Amount ($)</Label>
                <Input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea placeholder="Provide additional details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Dispute
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{disputes.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Disputes</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-primary">{openCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Open</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{reviewCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Under Review</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Disputed</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <Label className="text-sm">Filter:</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No disputes found.</p>
        </Card>
      ) : (
        <Card className="bg-card border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filed</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d: any) => {
                const st = STATUS_CONFIG[d.status] || STATUS_CONFIG.open;
                const Icon = st.icon;
                return (
                  <TableRow key={d.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{d.reason}</p>
                        {d.description && <p className="text-xs text-muted-foreground line-clamp-1">{d.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">${Number(d.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={d.priority === "critical" || d.priority === "high" ? "destructive" : "secondary"}>
                        {d.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={st.color as any} className="flex items-center gap-1 w-fit">
                        <Icon className="w-3 h-3" />{st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(d.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {d.status === "open" && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: d.id, status: "under_review" })}>
                              <MessageSquare className="w-4 h-4 mr-2" />Mark Under Review
                            </DropdownMenuItem>
                          )}
                          {d.status === "open" && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: d.id, status: "escalated" })}>
                              <AlertTriangle className="w-4 h-4 mr-2" />Escalate
                            </DropdownMenuItem>
                          )}
                          {(d.status === "open" || d.status === "under_review" || d.status === "escalated") && (
                            <DropdownMenuItem onClick={() => { setResolveDialog(d.id); setResolveAction("resolved"); }}>
                              <CheckCircle className="w-4 h-4 mr-2" />Resolve
                            </DropdownMenuItem>
                          )}
                          {(d.status === "open" || d.status === "under_review") && (
                            <DropdownMenuItem onClick={() => { setResolveDialog(d.id); setResolveAction("rejected"); }}>
                              <XCircle className="w-4 h-4 mr-2" />Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(d.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Resolve/Reject Dialog */}
      <Dialog open={!!resolveDialog} onOpenChange={(o) => { if (!o) { setResolveDialog(null); setResolveNote(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{resolveAction === "resolved" ? "Resolve" : "Reject"} Dispute</DialogTitle>
            <DialogDescription>Add a resolution note before closing this dispute.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Resolution Note</Label>
              <Textarea placeholder="Explain the resolution..." value={resolveNote} onChange={e => setResolveNote(e.target.value)} />
            </div>
            <Button
              className="w-full"
              variant={resolveAction === "rejected" ? "destructive" : "default"}
              onClick={() => resolveDialog && updateStatusMutation.mutate({ id: resolveDialog, status: resolveAction, note: resolveNote })}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {resolveAction === "resolved" ? "Mark Resolved" : "Mark Rejected"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardDisputes;
