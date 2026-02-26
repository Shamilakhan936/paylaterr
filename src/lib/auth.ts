import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type { User, Session };

export const auth = {
  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: (event: string, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(callback),

  signUp: (email: string, password: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    }),

  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  resetPasswordForEmail: (email: string, options?: { redirectTo?: string }) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: options?.redirectTo ?? window.location.origin + "/reset-password",
    }),

  updateUser: (updates: { password?: string }) => supabase.auth.updateUser(updates),
};
