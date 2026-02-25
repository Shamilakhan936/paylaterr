import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Calendar,
  Download
} from "lucide-react";

const metrics = [
  { title: "Total Revenue", value: "$1.28M", change: "+12.5%", trend: "up" },
  { title: "Transactions", value: "45,821", change: "+8.3%", trend: "up" },
  { title: "Avg. Order Value", value: "$284", change: "-2.1%", trend: "down" },
  { title: "Conversion Rate", value: "68.4%", change: "+5.7%", trend: "up" },
];

const DashboardAnalytics = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your payment performance</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              metric.trend === 'up' ? 'text-primary' : 'text-destructive'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{metric.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Over Time</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Revenue chart</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Payment methods breakdown</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Customer Segments</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">New Customers</span>
            </div>
            <p className="text-2xl font-bold text-foreground">2,847</p>
            <p className="text-sm text-primary">+23% this month</p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-medium text-foreground">Returning</span>
            </div>
            <p className="text-2xl font-bold text-foreground">8,421</p>
            <p className="text-sm text-accent">+12% this month</p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">At Risk</span>
            </div>
            <p className="text-2xl font-bold text-foreground">342</p>
            <p className="text-sm text-destructive">-8% this month</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
