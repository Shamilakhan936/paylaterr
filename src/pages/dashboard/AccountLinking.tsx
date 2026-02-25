import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle, XCircle, Clock, Building2, RefreshCw } from "lucide-react";

const institutions = [
  { name: "Chase", accounts: 3, status: "connected", lastSync: "2 min ago" },
  { name: "Bank of America", accounts: 2, status: "connected", lastSync: "5 min ago" },
  { name: "Wells Fargo", accounts: 1, status: "needs_attention", lastSync: "1 hour ago" },
  { name: "Capital One", accounts: 2, status: "connected", lastSync: "10 min ago" },
  { name: "Citi", accounts: 1, status: "pending", lastSync: "-" },
];

const DashboardAccountLinking = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Account Linking</h1>
          <p className="text-muted-foreground mt-1">Manage connected financial institutions</p>
        </div>
        <Button variant="default" className="mt-4 lg:mt-0">
          <Link2 className="w-4 h-4 mr-2" />
          Link New Account
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">12,847</p>
          <p className="text-sm text-muted-foreground mt-1">Total Connections</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-primary">99.2%</p>
          <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">1.2s</p>
          <p className="text-sm text-muted-foreground mt-1">Avg. Link Time</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">12,000+</p>
          <p className="text-sm text-muted-foreground mt-1">Institutions</p>
        </Card>
      </div>

      {/* Connected Accounts */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Connected Institutions</h2>
      <div className="space-y-3">
        {institutions.map((inst) => (
          <Card key={inst.name} className="p-4 bg-card border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{inst.name}</h3>
                <p className="text-sm text-muted-foreground">{inst.accounts} accounts linked</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted-foreground">Last synced</p>
                <p className="text-sm text-foreground">{inst.lastSync}</p>
              </div>
              <Badge variant={
                inst.status === 'connected' ? 'default' :
                inst.status === 'needs_attention' ? 'destructive' : 'secondary'
              } className="flex items-center gap-1">
                {inst.status === 'connected' && <CheckCircle className="w-3 h-3" />}
                {inst.status === 'needs_attention' && <XCircle className="w-3 h-3" />}
                {inst.status === 'pending' && <Clock className="w-3 h-3" />}
                {inst.status.replace('_', ' ')}
              </Badge>
              <Button variant="ghost" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardAccountLinking;
