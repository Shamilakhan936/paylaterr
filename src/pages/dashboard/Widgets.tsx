import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";
import {
  Receipt, PiggyBank, Wallet, Gift, AlertCircle, RefreshCw, Plane,
  Brain, UserCheck, Smartphone, Palette, Code, Eye, Copy, Check, Paintbrush
} from "lucide-react";

const PRODUCTS = [
  { id: "bnpl-bills", name: "BNPL Bills", icon: Receipt },
  { id: "spendnest", name: "SpendNest", icon: PiggyBank },
  { id: "earlypay", name: "EarlyPay", icon: Wallet },
  { id: "rewards", name: "Bill Rewards", icon: Gift },
  { id: "latefees", name: "LateFees Protection", icon: AlertCircle },
  { id: "autofloat", name: "AutoFloat", icon: RefreshCw },
  { id: "travel", name: "Paylaterr Travel", icon: Plane },
  { id: "decision-engine", name: "Decision Engine", icon: Brain },
  { id: "kyc", name: "KYC", icon: UserCheck },
  { id: "device-intelligence", name: "Device Intelligence", icon: Smartphone },
];

const FONT_OPTIONS = ["Inter", "Roboto", "Open Sans", "Lato", "Poppins", "DM Sans", "Nunito"];

interface WidgetConfig {
  id: string;
  user_id: string;
  product_id: string;
  label: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_background: string;
  color_text: string;
  color_border: string;
  border_radius: number;
  font_family: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

const defaultColors = {
  color_primary: "#6366f1",
  color_secondary: "#8b5cf6",
  color_accent: "#06b6d4",
  color_background: "#ffffff",
  color_text: "#1e293b",
  color_border: "#e2e8f0",
  border_radius: 8,
  font_family: "Inter",
};

export default function DashboardWidgets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { log } = useAuditLog();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<Partial<WidgetConfig> | null>(null);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedProductId, setEmbedProductId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["widget_configs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("widget_configs").select("*").order("product_id");
      if (error) throw error;
      return data as WidgetConfig[];
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async (config: Partial<WidgetConfig>) => {
      const payload = { ...config, user_id: user!.id };
      const { error } = await (supabase as any).from("widget_configs").upsert(payload, { onConflict: "user_id,product_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widget_configs"] });
      log("widget.configured", "widget", editConfig?.product_id);
      toast({ title: "Widget saved", description: "Your widget configuration has been saved." });
      setSelectedProduct(null);
      setEditConfig(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const getConfigForProduct = (productId: string) => configs.find((c) => c.product_id === productId);

  const openEditor = (productId: string) => {
    const existing = getConfigForProduct(productId);
    setSelectedProduct(productId);
    setEditConfig(existing ? { ...existing } : { product_id: productId, label: PRODUCTS.find(p => p.id === productId)!.name + " Widget", ...defaultColors, enabled: true });
  };

  const handleSave = () => {
    if (!editConfig) return;
    upsertMutation.mutate(editConfig);
  };

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const getEmbedCode = (productId: string) => {
    const config = getConfigForProduct(productId);
    const configId = config?.id || "YOUR_WIDGET_CONFIG_ID";
    return `<script src="https://${projectId}.supabase.co/functions/v1/widget-sdk?configId=${configId}" async><\/script>
<div id="paylaterr-widget-${productId}"></div>`;
  };

  const copyEmbed = (productId: string) => {
    navigator.clipboard.writeText(getEmbedCode(productId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Embed code copied to clipboard." });
  };

  const product = selectedProduct ? PRODUCTS.find(p => p.id === selectedProduct) : null;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Widgets</h1>
          <p className="text-muted-foreground mt-1">Configure and embed product widgets with your brand colors</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PRODUCTS.map((p) => {
          const config = getConfigForProduct(p.id);
          return (
            <Card key={p.id} className="p-5 bg-card border-border hover:border-primary/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{config ? "Configured" : "Not configured"}</p>
                  </div>
                </div>
                {config && (
                  <Badge variant={config.enabled ? "default" : "secondary"}>
                    {config.enabled ? "Active" : "Disabled"}
                  </Badge>
                )}
              </div>

              {config && (
                <div className="flex gap-1 mb-3">
                  {[config.color_primary, config.color_secondary, config.color_accent, config.color_background, config.color_text].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditor(p.id)}>
                  <Paintbrush className="w-3.5 h-3.5 mr-1.5" />
                  {config ? "Edit" : "Configure"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setEmbedProductId(p.id); setEmbedDialogOpen(true); }}
                  disabled={!config}>
                  <Code className="w-3.5 h-3.5 mr-1.5" />
                  Embed
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <Dialog open={!!selectedProduct} onOpenChange={(open) => { if (!open) { setSelectedProduct(null); setEditConfig(null); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {product && <product.icon className="w-5 h-5 text-primary" />}
              Configure {product?.name} Widget
            </DialogTitle>
          </DialogHeader>

          {editConfig && (
            <Tabs defaultValue="colors" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-1.5" />Colors</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-1.5" />Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {([
                    ["color_primary", "Primary"],
                    ["color_secondary", "Secondary"],
                    ["color_accent", "Accent"],
                    ["color_background", "Background"],
                    ["color_text", "Text"],
                    ["color_border", "Border"],
                  ] as const).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm">{label}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(editConfig as any)[key] || "#000000"}
                          onChange={(e) => setEditConfig({ ...editConfig, [key]: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                        />
                        <Input
                          value={(editConfig as any)[key] || ""}
                          onChange={(e) => setEditConfig({ ...editConfig, [key]: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Widget Label</Label>
                  <Input
                    value={editConfig.label || ""}
                    onChange={(e) => setEditConfig({ ...editConfig, label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={editConfig.font_family || "Inter"} onValueChange={(v) => setEditConfig({ ...editConfig, font_family: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Border Radius (px)</Label>
                  <Input
                    type="number" min={0} max={32}
                    value={editConfig.border_radius ?? 8}
                    onChange={(e) => setEditConfig({ ...editConfig, border_radius: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editConfig.enabled ?? true}
                    onCheckedChange={(v) => setEditConfig({ ...editConfig, enabled: v })}
                  />
                  <Label>Widget Enabled</Label>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <WidgetPreview config={editConfig} productName={product?.name || ""} ProductIcon={product?.icon} />
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => { setSelectedProduct(null); setEditConfig(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Embed Widget</DialogTitle>
          </DialogHeader>
          {embedProductId && (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Paste this snippet into your website's HTML to embed the {PRODUCTS.find(p => p.id === embedProductId)?.name} widget.
              </p>
              <div className="relative">
                <pre className="bg-secondary/50 border border-border rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {getEmbedCode(embedProductId)}
                </pre>
                <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={() => copyEmbed(embedProductId)}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WidgetPreview({ config, productName, ProductIcon }: { config: Partial<WidgetConfig>; productName: string; ProductIcon?: any }) {
  const radius = `${config.border_radius ?? 8}px`;
  return (
    <div className="border border-border rounded-lg p-6 bg-secondary/20">
      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Live Preview</p>
      <div
        className="mx-auto max-w-sm shadow-lg overflow-hidden"
        style={{
          backgroundColor: config.color_background,
          borderRadius: radius,
          border: `1px solid ${config.color_border}`,
          fontFamily: config.font_family,
        }}
      >
        <div style={{ background: `linear-gradient(135deg, ${config.color_primary}, ${config.color_secondary})`, padding: "20px", borderRadius: `${radius} ${radius} 0 0` }}>
          <div className="flex items-center gap-2">
            {ProductIcon && <ProductIcon className="w-5 h-5" style={{ color: "#fff" }} />}
            <span style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>{config.label || productName}</span>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ color: config.color_text, fontSize: "14px", marginBottom: "16px" }}>
            Complete your {productName} setup to get started.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                backgroundColor: config.color_primary,
                color: "#fff",
                border: "none",
                borderRadius: radius,
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: config.font_family,
              }}
            >
              Get Started
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: config.color_accent,
                border: `1px solid ${config.color_border}`,
                borderRadius: radius,
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: config.font_family,
              }}
            >
              Learn More
            </button>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${config.color_border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: config.color_text, opacity: 0.5, fontSize: "11px" }}>Powered by Paylaterr</span>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: config.color_accent }} />
        </div>
      </div>
    </div>
  );
}
