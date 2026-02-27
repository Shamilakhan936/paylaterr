export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          hashed_secret: string
          id: string
          key_name: string
          key_prefix: string
          last_used_at: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          hashed_secret: string
          id?: string
          key_name: string
          key_prefix: string
          last_used_at?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          hashed_secret?: string
          id?: string
          key_name?: string
          key_prefix?: string
          last_used_at?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_request_logs: {
        Row: {
          api_key_id: string | null
          endpoint: string
          id: string
          method: string
          product: string
          request_timestamp: string
          response_time_ms: number | null
          status_code: number | null
          user_id: string
        }
        Insert: {
          api_key_id?: string | null
          endpoint: string
          id?: string
          method?: string
          product: string
          request_timestamp?: string
          response_time_ms?: number | null
          status_code?: number | null
          user_id: string
        }
        Update: {
          api_key_id?: string | null
          endpoint?: string
          id?: string
          method?: string
          product?: string
          request_timestamp?: string
          response_time_ms?: number | null
          status_code?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_request_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      autopay_configs: {
        Row: {
          account_last4: string | null
          created_at: string
          enabled: boolean
          id: string
          max_retries: number
          payment_method: string
          retry_on_failure: boolean
          schedule_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_last4?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          max_retries?: number
          payment_method?: string
          retry_on_failure?: boolean
          schedule_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_last4?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          max_retries?: number
          payment_method?: string
          retry_on_failure?: boolean
          schedule_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autopay_configs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      biller_disbursements: {
        Row: {
          amount: number
          biller_account: string | null
          biller_name: string
          created_at: string
          disbursed_at: string | null
          id: string
          reference_number: string | null
          schedule_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          biller_account?: string | null
          biller_name: string
          created_at?: string
          disbursed_at?: string | null
          id?: string
          reference_number?: string | null
          schedule_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          biller_account?: string | null
          biller_name?: string
          created_at?: string
          disbursed_at?: string | null
          id?: string
          reference_number?: string | null
          schedule_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "biller_disbursements_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          installment_item_id: string | null
          priority: string
          reason: string
          resolution_note: string | null
          resolved_at: string | null
          schedule_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          installment_item_id?: string | null
          priority?: string
          reason: string
          resolution_note?: string | null
          resolved_at?: string | null
          schedule_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          installment_item_id?: string | null
          priority?: string
          reason?: string
          resolution_note?: string | null
          resolved_at?: string | null
          schedule_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_installment_item_id_fkey"
            columns: ["installment_item_id"]
            isOneToOne: false
            referencedRelation: "installment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_items: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          installment_number: number
          paid_at: string | null
          schedule_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          installment_number: number
          paid_at?: string | null
          schedule_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          installment_number?: number
          paid_at?: string | null
          schedule_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_items_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_schedules: {
        Row: {
          created_at: string
          currency: string
          customer_name: string
          frequency: string
          id: string
          installment_count: number
          plan_name: string
          product: string
          start_date: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_name: string
          frequency?: string
          id?: string
          installment_count?: number
          plan_name: string
          product?: string
          start_date?: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_name?: string
          frequency?: string
          id?: string
          installment_count?: number
          plan_name?: string
          product?: string
          start_date?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      late_fee_rules: {
        Row: {
          compound: boolean
          created_at: string
          enabled: boolean
          fee_amount: number
          fee_percentage: number
          fee_type: string
          grace_period_days: number
          id: string
          max_fee: number | null
          product: string
          updated_at: string
          user_id: string
        }
        Insert: {
          compound?: boolean
          created_at?: string
          enabled?: boolean
          fee_amount?: number
          fee_percentage?: number
          fee_type?: string
          grace_period_days?: number
          id?: string
          max_fee?: number | null
          product?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          compound?: boolean
          created_at?: string
          enabled?: boolean
          fee_amount?: number
          fee_percentage?: number
          fee_type?: string
          grace_period_days?: number
          id?: string
          max_fee?: number | null
          product?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          balance_after: number
          created_at: string
          credit: number
          debit: number
          description: string | null
          entry_type: string
          id: string
          reference_id: string | null
          schedule_id: string | null
          user_id: string
        }
        Insert: {
          balance_after?: number
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_type: string
          id?: string
          reference_id?: string | null
          schedule_id?: string | null
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_type?: string
          id?: string
          reference_id?: string | null
          schedule_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      linked_accounts: {
        Row: {
          account_label: string | null
          account_mask: string | null
          account_type: string
          created_at: string
          id: string
          institution_name: string
          last_synced_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_label?: string | null
          account_mask?: string | null
          account_type?: string
          created_at?: string
          id?: string
          institution_name: string
          last_synced_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_label?: string | null
          account_mask?: string | null
          account_type?: string
          created_at?: string
          id?: string
          institution_name?: string
          last_synced_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          dispute_updates: boolean
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          overdue_alerts: boolean
          payment_reminders: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean
          system_announcements: boolean
          updated_at: string
          user_id: string
          weekly_digest: boolean
        }
        Insert: {
          created_at?: string
          dispute_updates?: boolean
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          overdue_alerts?: boolean
          payment_reminders?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          system_announcements?: boolean
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
        }
        Update: {
          created_at?: string
          dispute_updates?: boolean
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          overdue_alerts?: boolean
          payment_reminders?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          system_announcements?: boolean
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
        }
        Relationships: []
      }
      orchestration_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          message: string
          read: boolean
          schedule_id: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          message: string
          read?: boolean
          schedule_id?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          schedule_id?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orchestration_alerts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          installments: number
          installments_paid: number
          next_payment_date: string | null
          plan_name: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          installments?: number
          installments_paid?: number
          next_payment_date?: string | null
          plan_name: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          installments?: number
          installments_paid?: number
          next_payment_date?: string | null
          plan_name?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          created_at: string
          days_before: number
          enabled: boolean
          id: string
          reminder_type: string
          schedule_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_before?: number
          enabled?: boolean
          id?: string
          reminder_type?: string
          schedule_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_before?: number
          enabled?: boolean
          id?: string
          reminder_type?: string
          schedule_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "installment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_address: string | null
          company_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_rules: {
        Row: {
          created_at: string
          enabled: boolean
          field: string
          id: string
          operator: string
          risk_action: string
          rule_name: string
          severity: string
          threshold: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          field: string
          id?: string
          operator?: string
          risk_action?: string
          rule_name: string
          severity?: string
          threshold?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          field?: string
          id?: string
          operator?: string
          risk_action?: string
          rule_name?: string
          severity?: string
          threshold?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          team_owner_id: string
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          team_owner_id: string
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          team_owner_id?: string
          token?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          member_user_id: string
          role: Database["public"]["Enums"]["app_role"]
          team_owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_user_id: string
          role?: Database["public"]["Enums"]["app_role"]
          team_owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_user_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_limits: {
        Row: {
          billing_cycle_start: string
          created_at: string
          current_month_usage: number
          id: string
          monthly_limit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle_start?: string
          created_at?: string
          current_month_usage?: number
          id?: string
          monthly_limit?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle_start?: string
          created_at?: string
          current_month_usage?: number
          id?: string
          monthly_limit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          id: string
          secret: string
          status: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          secret?: string
          status?: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          secret?: string
          status?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      widget_configs: {
        Row: {
          border_radius: number
          color_accent: string
          color_background: string
          color_border: string
          color_primary: string
          color_secondary: string
          color_text: string
          created_at: string
          enabled: boolean
          font_family: string
          id: string
          label: string
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          border_radius?: number
          color_accent?: string
          color_background?: string
          color_border?: string
          color_primary?: string
          color_secondary?: string
          color_text?: string
          created_at?: string
          enabled?: boolean
          font_family?: string
          id?: string
          label?: string
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          border_radius?: number
          color_accent?: string
          color_background?: string
          color_border?: string
          color_primary?: string
          color_secondary?: string
          color_text?: string
          created_at?: string
          enabled?: boolean
          font_family?: string
          id?: string
          label?: string
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "developer" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "developer", "viewer"],
    },
  },
} as const
