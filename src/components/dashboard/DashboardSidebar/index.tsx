import {
  LayoutDashboard,
  CreditCard,
  Link2,
  ShieldCheck,
  BarChart3,
  Webhook,
  Settings,
  HelpCircle,
  ChevronLeft,
  Package,
  Key,
  Users,
  Activity,
  Play,
  LogOut,
  Paintbrush,
  Shield,
  Gauge,
} from "lucide-react";
import { NavLink } from "@/components/landing/NavLink";
import raillayerLogo from "@/assets/raillayer-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "API Keys", url: "/dashboard/api-keys", icon: Key },
  { title: "API Playground", url: "/dashboard/playground", icon: Play },
  { title: "Activity Logs", url: "/dashboard/logs", icon: Activity },
  { title: "Payment Plans", url: "/dashboard/payment-plans", icon: CreditCard },
  { title: "Account Linking", url: "/dashboard/account-linking", icon: Link2 },
  { title: "Risk Engine", url: "/dashboard/risk-engine", icon: ShieldCheck },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Webhooks", url: "/dashboard/webhooks", icon: Webhook },
  { title: "Widgets", url: "/dashboard/widgets", icon: Paintbrush },
  { title: "Usage", url: "/dashboard/usage", icon: Gauge },
  { title: "Audit Trail", url: "/dashboard/audit", icon: Shield },
  { title: "Team", url: "/dashboard/team", icon: Users },
];

const settingsItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help", url: "/dashboard/help", icon: HelpCircle },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <a href="/" className="flex items-center gap-2">
            <img src={raillayerLogo} alt="Rail Layer" className="w-12 h-12 rounded-lg" />
            <span className="text-lg font-semibold text-gradient">Rail Layer</span>
          </a>
        )}
        {collapsed && (
          <img src={raillayerLogo} alt="Rail Layer" className="w-12 h-12 rounded-lg mx-auto" />
        )}
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2 mb-2">
            {!collapsed && "Products"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2 mb-2">
            {!collapsed && "Support"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sign Out">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-2 border-t border-border">
        {user && !collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <SidebarTrigger className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span className="text-sm">Collapse</span>}
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
