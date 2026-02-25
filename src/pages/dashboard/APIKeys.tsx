import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Plus,
  Trash2
} from "lucide-react";
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: 'sandbox' | 'production';
  status: 'active' | 'pending' | 'revoked';
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
}

const mockKeys: APIKey[] = [
  {
    id: "1",
    name: "Development Key",
    key: "sk_sandbox_4a8b9c0d1e2f3g4h5i6j7k8l9m0n",
    environment: "sandbox",
    status: "active",
    createdAt: "2024-01-15",
    lastUsed: "2024-01-20",
    permissions: ["read", "write"]
  },
  {
    id: "2",
    name: "Test Integration",
    key: "sk_sandbox_9z8y7x6w5v4u3t2s1r0q9p8o7n",
    environment: "sandbox",
    status: "active",
    createdAt: "2024-01-18",
    lastUsed: "2024-01-19",
    permissions: ["read"]
  }
];

const APIKeys = () => {
  const [keys, setKeys] = useState<APIKey[]>(mockKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRequestingProd, setIsRequestingProd] = useState(false);
  const [prodRequestStatus, setProdRequestStatus] = useState<'none' | 'pending' | 'approved'>('none');

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  const handleCreateSandboxKey = (name: string) => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name,
      key: `sk_sandbox_${Math.random().toString(36).substring(2, 30)}`,
      environment: 'sandbox',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: ['read', 'write']
    };
    setKeys([...keys, newKey]);
  };

  const handleRequestProductionKey = () => {
    setProdRequestStatus('pending');
    setIsRequestingProd(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground mt-1">Manage your sandbox and production API credentials</p>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sandbox Environment */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Sandbox Environment</h3>
                <p className="text-sm text-muted-foreground">For development and testing</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Unlimited API calls</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Test data only</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No real transactions</span>
            </div>
          </div>

          <div className="p-3 bg-secondary rounded-lg mb-4">
            <p className="text-xs text-muted-foreground mb-1">Base URL</p>
            <code className="text-sm font-mono text-foreground">https://sandbox.api.paylaterr.com</code>
          </div>

          <CreateKeyDialog onCreateKey={handleCreateSandboxKey} environment="sandbox" />
        </Card>

        {/* Production Environment */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Production Environment</h3>
                <p className="text-sm text-muted-foreground">For live integrations</p>
              </div>
            </div>
            <Badge variant={prodRequestStatus === 'approved' ? 'default' : 'secondary'}>
              {prodRequestStatus === 'approved' ? 'Active' : prodRequestStatus === 'pending' ? 'Pending' : 'Not Requested'}
            </Badge>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span>Requires integration review</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-accent" />
              <span>1-2 business days approval</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Real money transactions</span>
            </div>
          </div>

          <div className="p-3 bg-secondary rounded-lg mb-4">
            <p className="text-xs text-muted-foreground mb-1">Base URL</p>
            <code className="text-sm font-mono text-foreground">https://api.paylaterr.com</code>
          </div>

          {prodRequestStatus === 'none' && (
            <Dialog open={isRequestingProd} onOpenChange={setIsRequestingProd}>
              <DialogTrigger asChild>
                <Button variant="hero" className="w-full">
                  Request Production Access
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Request Production Access</DialogTitle>
                  <DialogDescription>
                    Please provide details about your integration for review.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Acme Inc." className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input placeholder="https://example.com" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Products to integrate</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bnpl">BNPL Bills</SelectItem>
                        <SelectItem value="spendnest">SpendNest</SelectItem>
                        <SelectItem value="earlypay">EarlyPay</SelectItem>
                        <SelectItem value="rewards">Bill Rewards</SelectItem>
                        <SelectItem value="all">All Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Integration Description</Label>
                    <Textarea 
                      placeholder="Describe how you plan to use the Paylaterr API..." 
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Monthly Volume</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1k">Less than 1,000 transactions</SelectItem>
                        <SelectItem value="10k">1,000 - 10,000 transactions</SelectItem>
                        <SelectItem value="100k">10,000 - 100,000 transactions</SelectItem>
                        <SelectItem value="1m">100,000+ transactions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRequestingProd(false)}>Cancel</Button>
                  <Button variant="hero" onClick={handleRequestProductionKey}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {prodRequestStatus === 'pending' && (
            <div className="p-3 bg-accent/10 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Request Under Review</p>
                <p className="text-xs text-muted-foreground">We'll notify you within 1-2 business days</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Active Keys */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Your API Keys</h2>
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <Card key={apiKey.id} className="p-4 bg-card border-border">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    apiKey.environment === 'sandbox' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <Key className={`w-5 h-5 ${
                      apiKey.environment === 'sandbox' ? 'text-primary' : 'text-accent'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{apiKey.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {apiKey.environment}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {apiKey.createdAt} • {apiKey.lastUsed ? `Last used ${apiKey.lastUsed}` : 'Never used'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1 lg:flex-initial">
                  <code className="flex-1 lg:flex-initial px-3 py-2 bg-secondary rounded-lg font-mono text-sm text-foreground truncate max-w-[280px]">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyKey(apiKey.key, apiKey.id)}
                  >
                    {copiedKey === apiKey.id ? (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <Card className="p-4 bg-destructive/5 border-destructive/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Keep your API keys secure</h4>
            <p className="text-sm text-muted-foreground">
              Never share your API keys or commit them to version control. Use environment variables and rotate keys regularly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Create Key Dialog Component
const CreateKeyDialog = ({ onCreateKey, environment }: { onCreateKey: (name: string) => void, environment: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyName, setKeyName] = useState('');

  const handleCreate = () => {
    if (keyName.trim()) {
      onCreateKey(keyName);
      setKeyName('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create {environment} Key
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New {environment === 'sandbox' ? 'Sandbox' : 'Production'} Key</DialogTitle>
          <DialogDescription>
            Give your API key a descriptive name to help identify its purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="keyName">Key Name</Label>
          <Input 
            id="keyName"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="e.g., Development, Testing, Mobile App"
            className="mt-2 bg-secondary border-border"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={handleCreate}>Create Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeys;
