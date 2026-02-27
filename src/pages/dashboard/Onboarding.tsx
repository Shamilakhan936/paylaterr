import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Key, Webhook, Layers, ArrowRight, Rocket, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  {
    id: "api-key",
    title: "Create Your First API Key",
    description: "Generate a sandbox API key to authenticate your requests. This key is required to call any Rail Layer endpoint.",
    icon: Key,
    route: "/dashboard/api-keys",
    cta: "Create API Key",
    table: "api_keys" as const,
  },
  {
    id: "webhook",
    title: "Set Up a Webhook",
    description: "Register a webhook URL so Rail Layer can push real-time events (payments, disputes, status changes) to your server.",
    icon: Webhook,
    route: "/dashboard/webhooks",
    cta: "Add Webhook",
    table: "webhooks" as const,
  },
  {
    id: "schedule",
    title: "Create an Installment Schedule",
    description: "Set up your first installment plan to test the BNPL or bill-pay flow end-to-end in the sandbox.",
    icon: Layers,
    route: "/dashboard/orchestration",
    cta: "Create Schedule",
    table: "installment_schedules" as const,
  },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: completionMap = {} } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const [keys, hooks, schedules] = await Promise.all([
        supabase.from("api_keys").select("id").limit(1),
        supabase.from("webhooks").select("id").limit(1),
        supabase.from("installment_schedules").select("id").limit(1),
      ]);
      return {
        "api-key": (keys.data?.length ?? 0) > 0,
        webhook: (hooks.data?.length ?? 0) > 0,
        schedule: (schedules.data?.length ?? 0) > 0,
      } as Record<string, boolean>;
    },
    enabled: !!user,
  });

  const completedCount = Object.values(completionMap).filter(Boolean).length;
  const allDone = completedCount === steps.length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Getting Started</h1>
        <p className="text-muted-foreground mt-2">Complete these steps to start processing payments with Rail Layer.</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-2 flex-1 max-w-[200px] bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{completedCount}/{steps.length}</span>
        </div>
      </div>

      {allDone && (
        <Card className="p-6 mb-8 border-primary/30 bg-primary/5 text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
          <h2 className="text-lg font-semibold text-foreground">You're all set!</h2>
          <p className="text-muted-foreground text-sm mt-1">Your sandbox environment is fully configured. Start building!</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard/playground")}>
            Open API Playground
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {steps.map((step, i) => {
          const done = completionMap[step.id];
          return (
            <Card key={step.id} className={`p-5 border-border ${done ? "opacity-70" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-primary/10" : "bg-secondary"}`}>
                  {done ? <CheckCircle className="w-5 h-5 text-primary" /> : <step.icon className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">STEP {i + 1}</span>
                    {done && <Badge variant="secondary" className="text-xs">Completed</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                <Button
                  variant={done ? "outline" : "default"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => navigate(step.route)}
                >
                  {done ? "View" : step.cta}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Onboarding;
