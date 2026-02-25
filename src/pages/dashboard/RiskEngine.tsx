import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, TrendingUp, Users, Settings } from "lucide-react";

const riskMetrics = [
  { label: "Low Risk", value: 78, color: "bg-primary" },
  { label: "Medium Risk", value: 18, color: "bg-accent" },
  { label: "High Risk", value: 4, color: "bg-destructive" },
];

const recentAssessments = [
  { id: "ASM-001", customer: "John Smith", score: 92, risk: "low", factors: ["High income", "Good history"], date: "2 min ago" },
  { id: "ASM-002", customer: "Sarah Johnson", score: 78, risk: "low", factors: ["Stable employment"], date: "5 min ago" },
  { id: "ASM-003", customer: "Mike Brown", score: 54, risk: "medium", factors: ["New customer", "Variable income"], date: "12 min ago" },
  { id: "ASM-004", customer: "Lisa Chen", score: 88, risk: "low", factors: ["Excellent credit", "Long history"], date: "18 min ago" },
  { id: "ASM-005", customer: "Tom Wilson", score: 32, risk: "high", factors: ["Missed payments", "High DTI"], date: "25 min ago" },
];

const DashboardRiskEngine = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Risk Engine</h1>
          <p className="text-muted-foreground mt-1">AI-powered risk assessment and underwriting</p>
        </div>
        <Button variant="outline" className="mt-4 lg:mt-0">
          <Settings className="w-4 h-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">94.2%</p>
              <p className="text-sm text-muted-foreground">Approval Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0.8%</p>
              <p className="text-sm text-muted-foreground">Default Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">850ms</p>
              <p className="text-sm text-muted-foreground">Avg Decision Time</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">52,847</p>
              <p className="text-sm text-muted-foreground">Assessments Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Distribution */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            {riskMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="text-foreground font-medium">{metric.value}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    assessment.risk === 'low' ? 'bg-primary/20 text-primary' :
                    assessment.risk === 'medium' ? 'bg-accent/20 text-accent' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {assessment.score}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{assessment.customer}</p>
                    <p className="text-xs text-muted-foreground">{assessment.factors.join(" • ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    assessment.risk === 'low' ? 'default' :
                    assessment.risk === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {assessment.risk} risk
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:block">{assessment.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardRiskEngine;
