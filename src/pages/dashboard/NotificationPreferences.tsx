import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Smartphone, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prefs {
  email_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  payment_reminders: boolean;
  overdue_alerts: boolean;
  dispute_updates: boolean;
  system_announcements: boolean;
  weekly_digest: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

const DEFAULTS: Prefs = {
  email_enabled: true,
  sms_enabled: false,
  in_app_enabled: true,
  payment_reminders: true,
  overdue_alerts: true,
  dispute_updates: true,
  system_announcements: true,
  weekly_digest: false,
  quiet_hours_start: null,
  quiet_hours_end: null,
};

const DashboardNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Prefs>(DEFAULTS);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("notification_preferences")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        email_enabled: existing.email_enabled,
        sms_enabled: existing.sms_enabled,
        in_app_enabled: existing.in_app_enabled,
        payment_reminders: existing.payment_reminders,
        overdue_alerts: existing.overdue_alerts,
        dispute_updates: existing.dispute_updates,
        system_announcements: existing.system_announcements,
        weekly_digest: existing.weekly_digest,
        quiet_hours_start: existing.quiet_hours_start,
        quiet_hours_end: existing.quiet_hours_end,
      });
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async (values: Prefs) => {
      if (existing) {
        const { error } = await (supabase as any)
          .from("notification_preferences")
          .update(values)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("notification_preferences")
          .insert({ ...values, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast({ title: "Preferences saved" });
    },
    onError: () => toast({ title: "Failed to save preferences", variant: "destructive" }),
  });

  const toggle = (key: keyof Prefs) => setForm(f => ({ ...f, [key]: !f[key] }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Notification Preferences</h1>
        <p className="text-muted-foreground mt-1">Control how and when you receive notifications</p>
      </div>

      {/* Channels */}
      <Card className="p-6 bg-card border-border mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Notification Channels
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch checked={form.email_enabled} onCheckedChange={() => toggle("email_enabled")} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
              </div>
            </div>
            <Switch checked={form.sms_enabled} onCheckedChange={() => toggle("sms_enabled")} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Show alerts in the dashboard</p>
              </div>
            </div>
            <Switch checked={form.in_app_enabled} onCheckedChange={() => toggle("in_app_enabled")} />
          </div>
        </div>
      </Card>

      {/* Event types */}
      <Card className="p-6 bg-card border-border mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Event Categories</h2>
        <div className="space-y-4">
          {[
            { key: "payment_reminders" as const, title: "Payment Reminders", desc: "Upcoming installment due dates" },
            { key: "overdue_alerts" as const, title: "Overdue Alerts", desc: "Late or missed payment notifications" },
            { key: "dispute_updates" as const, title: "Dispute Updates", desc: "Status changes on filed disputes" },
            { key: "system_announcements" as const, title: "System Announcements", desc: "Platform updates and maintenance" },
            { key: "weekly_digest" as const, title: "Weekly Digest", desc: "Summary of activity from the past week" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={form[item.key] as boolean} onCheckedChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Quiet hours */}
      <Card className="p-6 bg-card border-border mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quiet Hours</h2>
        <p className="text-sm text-muted-foreground mb-4">Suppress non-critical notifications during these hours</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={form.quiet_hours_start || ""}
              onChange={e => setForm(f => ({ ...f, quiet_hours_start: e.target.value || null }))}
            />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="time"
              value={form.quiet_hours_end || ""}
              onChange={e => setForm(f => ({ ...f, quiet_hours_end: e.target.value || null }))}
            />
          </div>
        </div>
      </Card>

      <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2">
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Preferences
      </Button>
    </div>
  );
};

export default DashboardNotificationPreferences;
