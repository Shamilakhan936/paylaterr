import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, Filter, Calendar, DollarSign, Users, Loader2, MoreVertical, Trash2
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentPlan {
  id: string;
  plan_name: string;
  customer_name: string;
  total_amount: number;
  installments: number;
  installments_paid: number;
  status: string;
  next_payment_date: string | null;
  created_at: string;
}

const DashboardPaymentPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["payment-plans"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("payment_plans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentPlan[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (plan: Partial<PaymentPlan>) => {
      const { error } = await (supabase as any).from("payment_plans").insert({
        ...plan,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
      toast({ title: "Plan created", description: "Payment plan has been created successfully." });
      setCreateOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === "completed") {
        const plan = plans.find((p) => p.id === id);
        if (plan) updates.installments_paid = plan.installments;
      }
      const { error } = await (supabase as any).from("payment_plans").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
      toast({ title: "Plan updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("payment_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans"] });
      toast({ title: "Plan deleted" });
    },
  });

  const filtered = plans.filter((p) => {
    const matchSearch = p.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      p.plan_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activePlans = plans.filter((p) => p.status === "active").length;
  const totalValue = plans.reduce((s, p) => s + Number(p.total_amount), 0);
  const uniqueCustomers = new Set(plans.map((p) => p.customer_name)).size;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Plans</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all payment plans</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <CreatePlanDialog
            onSubmit={(plan) => createMutation.mutate(plan)}
            loading={createMutation.isPending}
            onClose={() => setCreateOpen(false)}
          />
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
            <p className="text-xl font-bold text-foreground">{activePlans}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="text-xl font-bold text-foreground">{uniqueCustomers}</p>
          </div>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search plans..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-secondary border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="bg-card border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{plans.length === 0 ? "No payment plans yet. Create one to get started." : "No matching plans."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Payment</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan) => (
                  <tr key={plan.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{plan.plan_name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{plan.customer_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">${Number(plan.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(plan.installments_paid / plan.installments) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{plan.installments_paid}/{plan.installments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {plan.next_payment_date ? new Date(plan.next_payment_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={plan.status === "active" ? "default" : plan.status === "completed" ? "secondary" : "outline"}>
                        {plan.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {plan.status === "active" && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: plan.id, status: "paused" })}>
                              Pause Plan
                            </DropdownMenuItem>
                          )}
                          {plan.status === "paused" && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: plan.id, status: "active" })}>
                              Resume Plan
                            </DropdownMenuItem>
                          )}
                          {plan.status !== "completed" && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: plan.id, status: "completed" })}>
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(plan.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

function CreatePlanDialog({ onSubmit, loading, onClose }: {
  onSubmit: (plan: Partial<PaymentPlan>) => void;
  loading: boolean;
  onClose: () => void;
}) {
  const [planName, setPlanName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState("4");
  const [nextPayment, setNextPayment] = useState("");

  const handleSubmit = () => {
    if (!planName.trim() || !customerName.trim() || !amount) return;
    onSubmit({
      plan_name: planName,
      customer_name: customerName,
      total_amount: parseFloat(amount),
      installments: parseInt(installments),
      installments_paid: 0,
      status: "active",
      next_payment_date: nextPayment || null,
    });
    setPlanName("");
    setCustomerName("");
    setAmount("");
    setInstallments("4");
    setNextPayment("");
  };

  return (
    <DialogContent className="bg-card border-border">
      <DialogHeader>
        <DialogTitle>Create Payment Plan</DialogTitle>
        <DialogDescription>Set up a new installment plan for a customer.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Plan Name</Label>
          <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g., Q1 Subscription" className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Acme Corp" className="bg-secondary border-border" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Amount ($)</Label>
            <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2500.00" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Installments</Label>
            <Select value={installments} onValueChange={setInstallments}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 6, 8, 10, 12, 18, 24].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} installments</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Next Payment Date</Label>
          <Input type="date" value={nextPayment} onChange={(e) => setNextPayment(e.target.value)} className="bg-secondary border-border" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading || !planName.trim() || !customerName.trim() || !amount}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Plan
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default DashboardPaymentPlans;
