import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreVertical, Calendar, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const plans = [
  { id: "PLN-001", customer: "Acme Corp", amount: 2500, installments: 4, status: "active", nextPayment: "Feb 15, 2024", paid: 2 },
  { id: "PLN-002", customer: "TechStart Inc", amount: 8900, installments: 12, status: "active", nextPayment: "Feb 18, 2024", paid: 5 },
  { id: "PLN-003", customer: "Global Retail", amount: 1200, installments: 3, status: "completed", nextPayment: "-", paid: 3 },
  { id: "PLN-004", customer: "FinServ LLC", amount: 4500, installments: 6, status: "paused", nextPayment: "On Hold", paid: 2 },
  { id: "PLN-005", customer: "MediaPro", amount: 3200, installments: 4, status: "active", nextPayment: "Feb 20, 2024", paid: 1 },
];

const DashboardPaymentPlans = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Plans</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all active payment plans</p>
        </div>
        <Button variant="default" className="mt-4 lg:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold text-foreground">$2.4M</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
            <p className="text-xl font-bold text-foreground">1,247</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="text-xl font-bold text-foreground">892</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search plans..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Plans Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Payment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{plan.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{plan.customer}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">${plan.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(plan.paid / plan.installments) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{plan.paid}/{plan.installments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{plan.nextPayment}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      plan.status === 'active' ? 'default' :
                      plan.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {plan.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPaymentPlans;
