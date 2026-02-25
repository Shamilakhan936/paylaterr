import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Users, 
  DollarSign, 
  Activity,
  TrendingUp,
  Clock
} from "lucide-react";

const stats = [
  { 
    title: "Total Revenue", 
    value: "$1,284,392", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign 
  },
  { 
    title: "Active Plans", 
    value: "24,521", 
    change: "+8.2%", 
    trend: "up",
    icon: CreditCard 
  },
  { 
    title: "New Customers", 
    value: "1,429", 
    change: "+23.1%", 
    trend: "up",
    icon: Users 
  },
  { 
    title: "Default Rate", 
    value: "0.8%", 
    change: "-0.3%", 
    trend: "down",
    icon: Activity 
  },
];

const recentActivity = [
  { id: 1, type: "Payment", customer: "John Doe", amount: "$249.00", status: "completed", time: "2 min ago" },
  { id: 2, type: "New Plan", customer: "Jane Smith", amount: "$1,200.00", status: "active", time: "5 min ago" },
  { id: 3, type: "Payment", customer: "Bob Wilson", amount: "$89.00", status: "completed", time: "12 min ago" },
  { id: 4, type: "Verification", customer: "Alice Brown", amount: "-", status: "pending", time: "18 min ago" },
  { id: 5, type: "Payment", customer: "Charlie Davis", amount: "$450.00", status: "completed", time: "25 min ago" },
];

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button variant="outline">Download Report</Button>
          <Button variant="default">Create Plan</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-primary' : 'text-destructive'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
            <select className="bg-secondary border-border rounded-lg px-3 py-1.5 text-sm text-foreground">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Revenue chart visualization</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-primary">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.type} - {activity.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{activity.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activity.status === 'completed' ? 'bg-primary/10 text-primary' :
                    activity.status === 'active' ? 'bg-accent/10 text-accent' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
