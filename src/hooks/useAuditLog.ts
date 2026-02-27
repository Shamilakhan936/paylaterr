import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";

type AuditAction =
  | "api_key.created" | "api_key.revoked" | "api_key.deleted"
  | "webhook.created" | "webhook.updated" | "webhook.deleted"
  | "widget.configured" | "widget.toggled"
  | "settings.updated" | "password.changed"
  | "team.invited" | "team.role_changed"
  | "dispute.created" | "dispute.updated"
  | "login" | "logout";

export function useAuditLog() {
  const { user } = useAuth();

  const log = useCallback(
    async (action: AuditAction, resourceType: string, resourceId?: string, details?: Record<string, unknown>) => {
      if (!user) return;
      await (supabase as any).from("audit_logs").insert({
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId ?? null,
        details: details ?? {},
      });
    },
    [user]
  );

  return { log };
}
