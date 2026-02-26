import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Shield,
  Clock,
  Loader2,
  Plus,
  MoreVertical,
  Mail,
  UserMinus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "sonner";

const roleColors: Record<string, string> = {
  admin: "bg-primary/20 text-primary",
  developer: "bg-secondary text-foreground",
  viewer: "bg-muted text-muted-foreground",
};

const TeamManagement = () => {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const { log } = useAuditLog();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("viewer");

  const callTeamFn = async (body: Record<string, unknown>) => {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-team`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Request failed");
    return data;
  };

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_owner_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: invitations = [], isLoading: invitesLoading } = useQuery({
    queryKey: ["team-invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("team_owner_id", user!.id)
        .eq("status", "pending");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const inviteMutation = useMutation({
    mutationFn: (params: { email: string; role: string }) =>
      callTeamFn({ action: "invite", ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      log("team.invited", "team", undefined, { email: inviteEmail, role: inviteRole });
      toast.success("Invitation sent successfully");
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("viewer");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (params: { member_id: string; role: string }) =>
      callTeamFn({ action: "update_role", ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      log("team.role_changed", "team");
      toast.success("Role updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (member_id: string) =>
      callTeamFn({ action: "remove_member", member_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Member removed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (invitation_id: string) =>
      callTeamFn({ action: "cancel_invite", invitation_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      toast.success("Invitation cancelled");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const currentRole = roles.length > 0 ? roles[0].role : "admin";
  const isLoading = rolesLoading || membersLoading || invitesLoading;
  const totalMembers = 1 + members.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their access
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="mt-4 lg:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-xl font-bold text-foreground">{totalMembers}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Invites</p>
            <p className="text-xl font-bold text-foreground">{invitations.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Role</p>
            <p className="text-xl font-bold text-foreground capitalize">{currentRole}</p>
          </div>
        </Card>
      </div>
      <Card className="bg-card border-border overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Team Members</h2>
        </div>
        <div className="p-4 flex items-center gap-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {(user?.email?.[0] || "U").toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-sm text-muted-foreground">Account owner</p>
          </div>
          <Badge className={`${roleColors.admin} capitalize`}>Owner</Badge>
        </div>
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 flex items-center gap-4 border-b border-border last:border-b-0"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-muted-foreground">
                {member.member_user_id.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {member.member_user_id}
              </p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(member.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge className={`${roleColors[member.role] || roleColors.viewer} capitalize`}>
              {member.role}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    updateRoleMutation.mutate({ member_id: member.id, role: "admin" })
                  }
                >
                  Set as Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateRoleMutation.mutate({ member_id: member.id, role: "developer" })
                  }
                >
                  Set as Developer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateRoleMutation.mutate({ member_id: member.id, role: "viewer" })
                  }
                >
                  Set as Viewer
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => removeMemberMutation.mutate(member.id)}
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {members.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No team members yet. Invite someone to get started.</p>
          </div>
        )}
      </Card>
      {invitations.length > 0 && (
        <Card className="bg-card border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Pending Invitations</h2>
          </div>
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="p-4 flex items-center gap-4 border-b border-border last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{inv.email}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires {new Date(inv.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`${roleColors[inv.role] || roleColors.viewer} capitalize`}>
                {inv.role}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => cancelInviteMutation.mutate(inv.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Card>
      )}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Role Permissions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.admin} mb-2`}>Admin</Badge>
            <p className="text-sm text-muted-foreground">
              Full access including API keys, webhooks, and settings
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.developer} mb-2`}>Developer</Badge>
            <p className="text-sm text-muted-foreground">
              Create and manage API keys, view analytics
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.viewer} mb-2`}>Viewer</Badge>
            <p className="text-sm text-muted-foreground">
              Read-only access to dashboard and analytics
            </p>
          </div>
        </div>
      </Card>
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They'll receive access based on the
              role you assign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                  <SelectItem value="developer">Developer — API & analytics</SelectItem>
                  <SelectItem value="viewer">Viewer — Read-only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => inviteMutation.mutate({ email: inviteEmail, role: inviteRole })}
              disabled={!inviteEmail || inviteMutation.isPending}
            >
              {inviteMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
