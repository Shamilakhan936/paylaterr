import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuditLog } from "@/hooks/useAuditLog";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { log: auditLog } = useAuditLog();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || "");
      setCompanyAddress(profile.company_address || "");
      setContactPhone(profile.contact_phone || "");
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: companyName,
          company_address: companyAddress,
          contact_phone: contactPhone,
        })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      auditLog("settings.updated", "settings");
      toast({ title: "Settings saved", description: "Your profile has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    webhookFailures: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    const { error } = await auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      auditLog("password.changed", "settings");
      toast({ title: "Password updated", description: "Your password has been changed." });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-secondary w-full md:w-auto inline-flex flex-wrap md:flex-nowrap h-auto md:h-10 items-center justify-center rounded-md p-1.5 md:p-1 gap-1">
          <TabsTrigger value="profile" className="gap-1.5 md:gap-2 flex-1 md:flex-initial text-xs md:text-sm font-medium px-2.5 md:px-3 py-2 md:py-1.5 rounded-sm touch-manipulation data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <User className="w-4 h-4 shrink-0" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-1.5 md:gap-2 flex-1 md:flex-initial text-xs md:text-sm font-medium px-2.5 md:px-3 py-2 md:py-1.5 rounded-sm touch-manipulation data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 shrink-0" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 md:gap-2 flex-1 md:flex-initial text-xs md:text-sm font-medium px-2.5 md:px-3 py-2 md:py-1.5 rounded-sm touch-manipulation data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 shrink-0" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 md:gap-2 flex-1 md:flex-initial text-xs md:text-sm font-medium px-2.5 md:px-3 py-2 md:py-1.5 rounded-sm touch-manipulation data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 shrink-0" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Profile Information</h2>
            <div className="space-y-3 sm:space-y-4 max-w-md">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Email Address</Label>
                <Input value={user?.email || ""} disabled className="bg-secondary border-border h-10 text-sm" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-sm">Contact Phone</Label>
                <Input
                  id="phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
              <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending} className="text-sm min-h-10 touch-manipulation w-full sm:w-auto">
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" /> : <Save className="w-4 h-4 mr-2 flex-shrink-0" />}
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Company Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                <Label htmlFor="companyName" className="text-sm">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                <Label htmlFor="address" className="text-sm">Address</Label>
                <Input
                  id="address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
              <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending} className="text-sm min-h-10 touch-manipulation w-full sm:w-auto">
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" /> : <Save className="w-4 h-4 mr-2 flex-shrink-0" />}
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Notification Preferences</h2>
            <div className="space-y-4 sm:space-y-6">
              {[
                { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive important alerts via email" },
                { key: "webhookFailures" as const, label: "Webhook Failure Notifications", desc: "Get notified when webhook deliveries fail" },
                { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Receive weekly usage and analytics reports" },
                { key: "securityAlerts" as const, label: "Security Alerts", desc: "Critical security notifications (recommended)" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">{n.label}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[n.key]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [n.key]: checked })}
                    className="shrink-0 touch-manipulation"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Change Password</h2>
            <div className="space-y-3 sm:space-y-4 max-w-md">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary border-border h-10 text-sm"
                />
              </div>
              <Button onClick={changePassword} className="text-sm min-h-10 touch-manipulation w-full sm:w-auto">Update Password</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
