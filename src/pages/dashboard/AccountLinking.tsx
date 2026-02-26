import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLog } from "@/hooks/useAuditLog";
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
  Link2,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  RefreshCw,
  Plus,
  Loader2,
  MoreVertical,
  Trash2,
  Unlink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkedAccount {
  id: string;
  institution_name: string;
  account_type: string;
  account_label: string | null;
  account_mask: string | null;
  status: string;
  last_synced_at: string | null;
  created_at: string;
}

const INSTITUTIONS = [
  "Chase", "Bank of America", "Wells Fargo", "Capital One", "Citi",
  "US Bank", "PNC", "TD Bank", "Ally Bank", "Marcus by Goldman Sachs",
  "Discover", "American Express", "USAA", "Navy Federal", "Other",
];

const ACCOUNT_TYPES = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit_card", label: "Credit Card" },
  { value: "investment", label: "Investment" },
  { value: "loan", label: "Loan" },
  { value: "mortgage", label: "Mortgage" },
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  connected: { color: "default", icon: CheckCircle, label: "Connected" },
  needs_attention: { color: "destructive", icon: XCircle, label: "Needs Attention" },
  pending: { color: "secondary", icon: Clock, label: "Pending" },
  disconnected: { color: "outline", icon: Unlink, label: "Disconnected" },
};

const DashboardAccountLinking = () => {
  const { user } = useAuth();
  const { log } = useAuditLog();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    institution_name: "",
    account_type: "checking",
    account_label: "",
    account_mask: "",
  });

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["linked-accounts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("linked_accounts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LinkedAccount[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const { error } = await (supabase as any).from("linked_accounts").insert({
        user_id: user!.id,
        institution_name: values.institution_name,
        account_type: values.account_type,
        account_label: values.account_label || null,
        account_mask: values.account_mask || null,
        status: "connected",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
      log("settings.updated", "linked_account", undefined, { action: "linked" });
      toast({ title: "Account linked successfully" });
      resetForm();
    },
    onError: () => toast({ title: "Failed to link account", variant: "destructive" }),
  });

  const syncMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("linked_accounts")
        .update({ last_synced_at: new Date().toISOString(), status: "connected" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
      toast({ title: "Account synced" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("linked_accounts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
      toast({ title: "Account unlinked" });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("linked_accounts")
        .update({ status: "disconnected" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
      toast({ title: "Account disconnected" });
    },
  });

  const resetForm = () => {
    setForm({ institution_name: "", account_type: "checking", account_label: "", account_mask: "" });
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!form.institution_name) {
      toast({ title: "Select an institution", variant: "destructive" });
      return;
    }
    createMutation.mutate(form);
  };

  const connectedCount = accounts.filter((a) => a.status === "connected").length;
  const uniqueInstitutions = new Set(accounts.map((a) => a.institution_name)).size;

  const formatTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Account Linking</h1>
          <p className="text-muted-foreground mt-1">Manage connected financial institutions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Link New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Link New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 mt-2">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Institution</label>
                <Select value={form.institution_name} onValueChange={(v) => setForm((f) => ({ ...f, institution_name: v }))}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select institution" /></SelectTrigger>
                  <SelectContent>
                    {INSTITUTIONS.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Account Type</label>
                <Select value={form.account_type} onValueChange={(v) => setForm((f) => ({ ...f, account_type: v }))}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Label (optional)</label>
                <Input
                  placeholder="e.g. Personal Checking"
                  value={form.account_label}
                  onChange={(e) => setForm((f) => ({ ...f, account_label: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1 block">Last 4 digits (optional)</label>
                <Input
                  placeholder="e.g. 4321"
                  maxLength={4}
                  value={form.account_mask}
                  onChange={(e) => setForm((f) => ({ ...f, account_mask: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  className="h-10 text-sm"
                />
              </div>
              <Button className="w-full min-h-10 text-sm touch-manipulation" onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />}
                Link Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{accounts.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Accounts</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-primary">{connectedCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Connected</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{uniqueInstitutions}</p>
          <p className="text-sm text-muted-foreground mt-1">Institutions</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">
            {accounts.filter((a) => a.status === "needs_attention").length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Needs Attention</p>
        </Card>
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Linked Accounts</h2>
      {accounts.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No accounts linked yet. Click "Link New Account" to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((acct) => {
            const st = statusConfig[acct.status] || statusConfig.pending;
            const StatusIcon = st.icon;
            return (
              <Card key={acct.id} className="p-4 bg-card border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{acct.institution_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ACCOUNT_TYPES.find((t) => t.value === acct.account_type)?.label || acct.account_type}
                      {acct.account_label && ` • ${acct.account_label}`}
                      {acct.account_mask && ` •••${acct.account_mask}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Last synced</p>
                    <p className="text-sm text-foreground">{formatTimeAgo(acct.last_synced_at)}</p>
                  </div>
                  <Badge
                    variant={st.color as any}
                    className="flex items-center gap-1"
                  >
                    <StatusIcon className="w-3 h-3" />
                    {st.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => syncMutation.mutate(acct.id)}
                    disabled={syncMutation.isPending}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
                  </Button>
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
                      {acct.status === "connected" && (
                        <DropdownMenuItem onClick={() => disconnectMutation.mutate(acct.id)} className="py-2.5 sm:py-1.5 cursor-pointer">
                          <Unlink className="w-4 h-4 mr-2 shrink-0" /> Disconnect
                        </DropdownMenuItem>
                      )}
                      {acct.status === "disconnected" && (
                        <DropdownMenuItem onClick={() => syncMutation.mutate(acct.id)} className="py-2.5 sm:py-1.5 cursor-pointer">
                          <Link2 className="w-4 h-4 mr-2 shrink-0" /> Reconnect
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive py-2.5 sm:py-1.5 cursor-pointer"
                        onClick={() => deleteMutation.mutate(acct.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2 shrink-0" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardAccountLinking;
