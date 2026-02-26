import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Webhook, 
  Plus, 
  Copy, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Trash2,
  Pause,
  Play
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";

const AVAILABLE_EVENTS = [
  "payment.completed",
  "payment.failed",
  "plan.created",
  "plan.completed",
  "kyc.verified",
  "kyc.failed",
  "decision.approved",
  "decision.declined",
];

const DashboardWebhooks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { log } = useAuditLog();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhooks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createWebhook = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("webhooks").insert({
        user_id: user!.id,
        url: newUrl,
        events: selectedEvents,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setIsCreateOpen(false);
      log("webhook.created", "webhook", undefined, { url: newUrl, events: selectedEvents });
      setNewUrl("");
      setSelectedEvents([]);
      toast({ title: "Webhook created", description: "Your endpoint has been added." });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("webhooks")
        .update({ status: status === "active" ? "disabled" : "active" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      log("webhook.updated", "webhook", vars.id);
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webhooks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      log("webhook.deleted", "webhook", id);
      toast({ title: "Webhook deleted" });
    },
  });

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const activeCount = webhooks.filter(w => w.status === "active").length;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Webhooks</h1>
          <p className="text-muted-foreground mt-1">Receive real-time notifications for events</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="mt-4 lg:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Add Webhook Endpoint</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Configure a URL to receive event notifications.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Endpoint URL</Label>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://api.yourapp.com/webhooks"
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Events to subscribe</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_EVENTS.map(event => (
                    <div key={event} className="flex items-center gap-2 touch-manipulation">
                      <Checkbox
                        id={event}
                        checked={selectedEvents.includes(event)}
                        onCheckedChange={() => toggleEvent(event)}
                        className="shrink-0"
                      />
                      <Label htmlFor={event} className="text-xs sm:text-sm font-mono cursor-pointer truncate">{event}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="w-full sm:w-auto text-sm min-h-10">Cancel</Button>
              <Button
                onClick={() => createWebhook.mutate()}
                disabled={!newUrl || selectedEvents.length === 0 || createWebhook.isPending}
                className="w-full sm:w-auto text-sm min-h-10 touch-manipulation"
              >
                {createWebhook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />}
                Create Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{webhooks.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Endpoints</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-primary">{activeCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Active</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-3xl font-bold text-foreground">{webhooks.length - activeCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Disabled</p>
        </Card>
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Webhook Endpoints</h2>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : webhooks.length === 0 ? (
        <Card className="p-8 bg-card border-border text-center">
          <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No webhooks configured yet. Add an endpoint to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(webhook.url);
                          toast({ title: "Copied!" });
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(webhook.events as string[]).map((event: string) => (
                        <span key={event} className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                    {webhook.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 touch-manipulation shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="max-w-[min(16rem,calc(100vw-2rem))] min-w-[10rem] py-1"
                      sideOffset={6}
                      collisionPadding={12}
                    >
                      <DropdownMenuItem onClick={() => toggleStatus.mutate({ id: webhook.id, status: webhook.status })} className="py-2.5 sm:py-1.5 cursor-pointer">
                        {webhook.status === "active" ? (
                          <><Pause className="w-4 h-4 mr-2 shrink-0" /> Disable</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2 shrink-0" /> Enable</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive py-2.5 sm:py-1.5 cursor-pointer"
                        onClick={() => deleteWebhook.mutate(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2 shrink-0" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWebhooks;
