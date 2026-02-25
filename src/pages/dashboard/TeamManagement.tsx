import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Users, 
  UserPlus, 
  Mail, 
  MoreVertical,
  Shield,
  Trash2,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  status: 'active' | 'pending';
  joinedAt: string;
}

const mockTeam: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john@acmeinc.com", role: "owner", status: "active", joinedAt: "2023-06-15" },
  { id: "2", name: "Sarah Chen", email: "sarah@acmeinc.com", role: "admin", status: "active", joinedAt: "2023-08-20" },
  { id: "3", name: "Mike Johnson", email: "mike@acmeinc.com", role: "developer", status: "active", joinedAt: "2023-10-05" },
  { id: "4", name: "Pending User", email: "pending@acmeinc.com", role: "developer", status: "pending", joinedAt: "2024-01-18" },
];

const roleColors: Record<string, string> = {
  owner: "bg-accent/20 text-accent",
  admin: "bg-primary/20 text-primary",
  developer: "bg-secondary text-foreground",
  viewer: "bg-muted text-muted-foreground",
};

const TeamManagement = () => {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("developer");

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: "Pending User",
        email: inviteEmail,
        role: inviteRole as TeamMember['role'],
        status: "pending",
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setTeam([...team, newMember]);
      setInviteEmail("");
      setInviteRole("developer");
      setIsInviteOpen(false);
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
    }
  };

  const handleRemove = (memberId: string) => {
    setTeam(team.filter(m => m.id !== memberId));
    toast({
      title: "Member removed",
      description: "Team member has been removed from the organization.",
    });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their access</p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="mt-4 lg:mt-0">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                    <SelectItem value="developer">Developer - API access</SelectItem>
                    <SelectItem value="viewer">Viewer - Read-only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
              <Button variant="hero" onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-xl font-bold text-foreground">{team.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-xl font-bold text-foreground">{team.filter(m => m.role === 'admin' || m.role === 'owner').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Invites</p>
            <p className="text-xl font-bold text-foreground">{team.filter(m => m.status === 'pending').length}</p>
          </div>
        </Card>
      </div>

      {/* Team List */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Team Members</h2>
        </div>
        <div className="divide-y divide-border">
          {team.map((member) => (
            <div key={member.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{member.name}</p>
                  {member.status === 'pending' && (
                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{member.email}</p>
              </div>

              <Badge className={`${roleColors[member.role]} capitalize hidden sm:inline-flex`}>
                {member.role}
              </Badge>

              <p className="text-sm text-muted-foreground hidden md:block">
                Joined {member.joinedAt}
              </p>

              {member.role !== 'owner' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Invite
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="w-4 h-4 mr-2" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleRemove(member.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Role Permissions */}
      <Card className="mt-6 p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Role Permissions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.owner} mb-2`}>Owner</Badge>
            <p className="text-sm text-muted-foreground">Full access including billing and team management</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.admin} mb-2`}>Admin</Badge>
            <p className="text-sm text-muted-foreground">Manage API keys, webhooks, and team members</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.developer} mb-2`}>Developer</Badge>
            <p className="text-sm text-muted-foreground">Create and manage API keys, view analytics</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <Badge className={`${roleColors.viewer} mb-2`}>Viewer</Badge>
            <p className="text-sm text-muted-foreground">Read-only access to dashboard and analytics</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamManagement;
