import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Webhook, Plus, Copy, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";

const webhooks = [
  { id: "wh_001", url: "https://api.yourapp.com/webhooks/paylaterr", events: ["payment.completed", "plan.created"], status: "active", lastTriggered: "2 min ago" },
  { id: "wh_002", url: "https://hooks.slack.com/services/...", events: ["payment.failed"], status: "active", lastTriggered: "1 hour ago" },
  { id: "wh_003", url: "https://api.analytics.com/track", events: ["plan.completed"], status: "disabled", lastTriggered: "2 days ago" },
];

const recentEvents = [
  { id: 1, event: "payment.completed", status: "delivered", responseTime: "124ms", time: "2 min ago" },
  { id: 2, event: "plan.created", status: "delivered", responseTime: "89ms", time: "5 min ago" },
  { id: 3, event: "payment.failed", status: "failed", responseTime: "-", time: "1 hour ago" },
  { id: 4, event: "payment.completed", status: "delivered", responseTime: "156ms", time: "2 hours ago" },
];

const DashboardWebhooks = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Webhooks</h1>
          <p className="text-muted-foreground mt-1">Receive real-time notifications for events</p>
        </div>
        <Button variant="default" className="mt-4 lg:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">12,847</p>
          <p className="text-sm text-muted-foreground mt-1">Events Sent (24h)</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-primary">99.8%</p>
          <p className="text-sm text-muted-foreground mt-1">Delivery Rate</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">142ms</p>
          <p className="text-sm text-muted-foreground mt-1">Avg Response Time</p>
        </Card>
      </div>

      {/* Endpoints */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Webhook Endpoints</h2>
      <div className="space-y-3 mb-8">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-4 bg-card border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-foreground truncate max-w-xs">{webhook.url}</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {webhook.events.map((event) => (
                      <span key={event} className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground">Last triggered</p>
                  <p className="text-sm text-foreground">{webhook.lastTriggered}</p>
                </div>
                <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                  {webhook.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Events</h2>
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Event</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Response Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-border">
                  <td className="px-6 py-4 font-mono text-sm text-foreground">{event.event}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {event.status === 'delivered' ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                      <span className={event.status === 'delivered' ? 'text-primary' : 'text-destructive'}>
                        {event.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{event.responseTime}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{event.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardWebhooks;
