import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Key, Copy, AlertTriangle, CheckCircle, Shield, Plus, Trash2, Loader2
} from "lucide-react";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";

interface APIKeyRow {
  id: string;
  key_name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

const APIKeys = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { log } = useAuditLog();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ key: string; env: string } | null>(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .is("revoked_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as APIKeyRow[];
    },
    enabled: !!user,
  });

  const createKeyMutation = useMutation({
    mutationFn: async ({ keyName, environment }: { keyName: string; environment: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-api-key`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ key_name: `[${environment}] ${keyName}` }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create key");
      }
      const data = await res.json();
      return { ...data, environment };
    },
    onSuccess: (data) => {
      setNewlyCreatedKey({ key: data.key, env: data.environment });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      log("api_key.created", "api_key", undefined, { environment: data.environment });
      toast({ title: "API Key Created", description: "Copy your key now — it won't be shown again." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", keyId);
      if (error) throw error;
    },
    onSuccess: (_data, keyId) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      log("api_key.revoked", "api_key", keyId);
      toast({ title: "Key revoked" });
    },
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getKeyEnv = (name: string): string => {
    if (name.startsWith("[production]")) return "production";
    if (name.startsWith("[sandbox]")) return "sandbox";
    return "sandbox";
  };

  const getDisplayName = (name: string): string => {
    return name.replace(/^\[(production|sandbox)\]\s*/, "");
  };

  const sandboxKeys = keys.filter((k) => getKeyEnv(k.key_name) === "sandbox");
  const productionKeys = keys.filter((k) => getKeyEnv(k.key_name) === "production");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">API Keys</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">Manage your API credentials for sandbox and production</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <EnvironmentCard
          title="Sandbox Environment"
          description="For development and testing"
          icon={<Key className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>}
          features={["Unlimited API calls", "Test data only"]}
          baseUrl="https://sandbox.api.raillayer.com"
          environment="sandbox"
          onCreateKey={(name) => createKeyMutation.mutate({ keyName: name, environment: "sandbox" })}
          loading={createKeyMutation.isPending}
        />
        <EnvironmentCard
          title="Production Environment"
          description="For live integrations"
          icon={<Shield className="w-5 h-5 text-accent" />}
          iconBg="bg-accent/10"
          badge={<Badge variant="secondary" className="bg-accent/10 text-accent">Active</Badge>}
          features={["Rate-limited API calls", "Live data & transactions"]}
          baseUrl="https://api.raillayer.com"
          environment="production"
          onCreateKey={(name) => createKeyMutation.mutate({ keyName: name, environment: "production" })}
          loading={createKeyMutation.isPending}
        />
      </div>
      {newlyCreatedKey && (
        <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">
                  New {newlyCreatedKey.env === "production" ? "Production" : "Sandbox"} API Key Created
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Copy this key now — it will not be shown again.</p>
                <div className="flex items-center gap-2 min-w-0">
                  <code className="flex-1 min-w-0 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-secondary rounded-lg font-mono text-xs sm:text-sm text-foreground break-all">
                    {newlyCreatedKey.key}
                  </code>
                  <Button variant="outline" size="icon" className="flex-shrink-0 w-9 h-9" onClick={() => copyToClipboard(newlyCreatedKey.key, "new")}>
                    {copiedKey === "new" ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-sm flex-shrink-0 self-start sm:self-auto" onClick={() => setNewlyCreatedKey(null)}>Dismiss</Button>
          </div>
        </Card>
      )}
      <KeyList
        title="Sandbox Keys"
        keys={sandboxKeys}
        envLabel="sandbox"
        isLoading={isLoading}
        onRevoke={(id) => revokeKeyMutation.mutate(id)}
        getDisplayName={getDisplayName}
        copyToClipboard={copyToClipboard}
        copiedKey={copiedKey}
      />
      <KeyList
        title="Production Keys"
        keys={productionKeys}
        envLabel="production"
        isLoading={isLoading}
        onRevoke={(id) => revokeKeyMutation.mutate(id)}
        getDisplayName={getDisplayName}
        copyToClipboard={copyToClipboard}
        copiedKey={copiedKey}
      />
      <Card className="p-3 sm:p-4 bg-destructive/5 border-destructive/20 mt-4 sm:mt-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h4 className="font-medium text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">Keep your API keys secure</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Never share your API keys or commit them to version control. Use environment variables and rotate keys regularly.
              Production keys have access to live data — handle with extra care.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface EnvironmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: React.ReactNode;
  features: string[];
  baseUrl: string;
  environment: string;
  onCreateKey: (name: string) => void;
  loading: boolean;
}

const EnvironmentCard = ({ title, description, icon, iconBg, badge, features, baseUrl, environment, onCreateKey, loading }: EnvironmentCardProps) => (
  <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{badge}</div>
    </div>
    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{f}</span>
        </div>
      ))}
    </div>
    <div className="p-2.5 sm:p-3 bg-secondary rounded-lg mb-3 sm:mb-4 min-w-0 overflow-hidden">
      <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">Base URL</p>
      <code className="text-xs sm:text-sm font-mono text-foreground break-all">{baseUrl}</code>
    </div>
    <CreateKeyDialog environment={environment} onCreateKey={onCreateKey} loading={loading} />
  </Card>
);

interface KeyListProps {
  title: string;
  keys: APIKeyRow[];
  envLabel: string;
  isLoading: boolean;
  onRevoke: (id: string) => void;
  getDisplayName: (name: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedKey: string | null;
}

const KeyList = ({ title, keys, envLabel, isLoading, onRevoke, getDisplayName, copyToClipboard, copiedKey }: KeyListProps) => (
  <div className="mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{title}</h2>
    {isLoading ? (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    ) : keys.length === 0 ? (
      <Card className="p-4 sm:p-6 bg-card border-border text-center">
        <Key className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-xs sm:text-sm">No {envLabel} keys yet. Create one above.</p>
      </Card>
    ) : (
      <div className="space-y-2 sm:space-y-3">
        {keys.map((apiKey) => (
          <Card key={apiKey.id} className="p-3 sm:p-4 bg-card border-border min-w-0 overflow-hidden">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 ${envLabel === "production" ? "bg-accent/10" : "bg-primary/10"} flex items-center justify-center`}>
                  {envLabel === "production" ? <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> : <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-medium text-foreground text-sm sm:text-base truncate">{getDisplayName(apiKey.key_name)}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{envLabel}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Created {new Date(apiKey.created_at).toLocaleDateString()} •
                    {apiKey.last_used_at ? ` Last used ${new Date(apiKey.last_used_at).toLocaleDateString()}` : " Never used"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <code className="flex-1 min-w-0 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-secondary rounded-lg font-mono text-xs sm:text-sm text-foreground truncate">
                  {apiKey.key_prefix}••••••••
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive flex-shrink-0 w-9 h-9 touch-manipulation"
                  onClick={() => onRevoke(apiKey.id)}
                  aria-label="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const CreateKeyDialog = ({ environment, onCreateKey, loading }: { environment: string; onCreateKey: (name: string) => void; loading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyName, setKeyName] = useState("");

  const handleCreate = () => {
    if (keyName.trim()) {
      onCreateKey(keyName);
      setKeyName("");
      setIsOpen(false);
    }
  };

  const label = environment === "production" ? "Production" : "Sandbox";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-sm sm:text-base min-h-10 touch-manipulation">
          <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
          Create {label} Key
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Create New {label} API Key</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {environment === "production"
              ? "This key will have access to live data and transactions."
              : "Give your API key a descriptive name."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-3 sm:py-4">
          <Label htmlFor="keyName" className="text-sm">Key Name</Label>
          <Input
            id="keyName"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder={environment === "production" ? "e.g., Production Server, Live App" : "e.g., Development, Testing, Mobile App"}
            className="mt-1.5 sm:mt-2 bg-secondary border-border text-sm sm:text-base"
          />
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto text-sm">Cancel</Button>
          <Button variant="hero" onClick={handleCreate} disabled={loading} className="w-full sm:w-auto text-sm min-h-10">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />}
            Create Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeys;
