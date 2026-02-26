import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // User client for auth
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for privileged operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { action, ...params } = await req.json();

    switch (action) {
      case "invite": {
        const { email, role } = params;
        if (!email) {
          return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check if already a member
        const { data: existingUser } = await adminClient.auth.admin.listUsers();
        const targetUser = existingUser?.users?.find((u) => u.email === email);
        
        if (targetUser) {
          const { data: existingMember } = await adminClient
            .from("team_members")
            .select("id")
            .eq("team_owner_id", user.id)
            .eq("member_user_id", targetUser.id)
            .maybeSingle();
          
          if (existingMember) {
            return new Response(JSON.stringify({ error: "User is already a team member" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        // Check existing pending invitation
        const { data: existingInvite } = await adminClient
          .from("team_invitations")
          .select("id")
          .eq("team_owner_id", user.id)
          .eq("email", email)
          .eq("status", "pending")
          .maybeSingle();

        if (existingInvite) {
          return new Response(JSON.stringify({ error: "Invitation already pending for this email" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Upsert invitation (handles unique constraint)
        const { data: invitation, error: invError } = await adminClient
          .from("team_invitations")
          .upsert({
            team_owner_id: user.id,
            email,
            role: role || "viewer",
            status: "pending",
          }, { onConflict: "team_owner_id,email" })
          .select()
          .single();

        if (invError) {
          return new Response(JSON.stringify({ error: invError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, invitation }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "accept_invite": {
        const { token } = params;
        const { data: invitation, error: findErr } = await adminClient
          .from("team_invitations")
          .select("*")
          .eq("token", token)
          .eq("status", "pending")
          .single();

        if (findErr || !invitation) {
          return new Response(JSON.stringify({ error: "Invalid or expired invitation" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Add as team member
        const { error: memberErr } = await adminClient
          .from("team_members")
          .insert({
            team_owner_id: invitation.team_owner_id,
            member_user_id: user.id,
            role: invitation.role,
          });

        if (memberErr) {
          return new Response(JSON.stringify({ error: memberErr.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Mark invitation as accepted
        await adminClient
          .from("team_invitations")
          .update({ status: "accepted" })
          .eq("id", invitation.id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_role": {
        const { member_id, role } = params;
        const { error } = await adminClient
          .from("team_members")
          .update({ role })
          .eq("id", member_id)
          .eq("team_owner_id", user.id);

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "remove_member": {
        const { member_id } = params;
        const { error } = await adminClient
          .from("team_members")
          .delete()
          .eq("id", member_id)
          .eq("team_owner_id", user.id);

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "cancel_invite": {
        const { invitation_id } = params;
        const { error } = await adminClient
          .from("team_invitations")
          .delete()
          .eq("id", invitation_id)
          .eq("team_owner_id", user.id);

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
