import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

type EmailType = "welcome" | "api_key_created" | "api_key_revoked" | "usage_warning" | "usage_limit_reached";

interface EmailRequest {
  type: EmailType;
  to: string;
  data?: Record<string, any>;
}

function getEmailContent(type: EmailType, data: Record<string, any> = {}) {
  const baseStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #ffffff;
    color: #1e293b;
  `;
  const buttonStyle = `
    display: inline-block;
    padding: 12px 24px;
    background-color: #6366f1;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 16px;
  `;
  const footerStyle = `
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    font-size: 12px;
    color: #94a3b8;
  `;

  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Rail Layer — Your API Platform is Ready",
        html: `<div style="${baseStyle}">
          <h1 style="color: #6366f1; margin-bottom: 8px;">Welcome to Rail Layer 🚀</h1>
          <p>Your account has been created and you're ready to start integrating our enterprise payment APIs.</p>
          <h3>Next Steps:</h3>
          <ol>
            <li><strong>Generate API Keys</strong> — Head to the dashboard to create your sandbox keys</li>
            <li><strong>Explore the Playground</strong> — Test all 12 product APIs interactively</li>
            <li><strong>Read the Docs</strong> — Each product has comprehensive endpoint documentation</li>
          </ol>
          <p>Your sandbox environment includes 10,000 free API calls per month.</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Go to Dashboard</a>
          <div style="${footerStyle}">
            <p>Rail Layer — Enterprise Payment Infrastructure</p>
          </div>
        </div>`,
      };

    case "api_key_created":
      return {
        subject: "New API Key Created — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #6366f1;">New API Key Created 🔑</h1>
          <p>A new API key has been created on your account.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Key Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.key_name || "Unnamed"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Key Prefix</td>
              <td style="padding: 8px 0; font-family: monospace;">${data.key_prefix || "pk_..."}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Created At</td>
              <td style="padding: 8px 0;">${new Date().toUTCString()}</td>
            </tr>
          </table>
          <p style="background: #fef3c7; padding: 12px; border-radius: 8px; color: #92400e;">
            ⚠️ If you did not create this key, please revoke it immediately from your dashboard.
          </p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Manage API Keys</a>
          <div style="${footerStyle}">
            <p>Rail Layer — Enterprise Payment Infrastructure</p>
          </div>
        </div>`,
      };

    case "api_key_revoked":
      return {
        subject: "API Key Revoked — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #ef4444;">API Key Revoked 🚫</h1>
          <p>An API key has been revoked on your account.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Key Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.key_name || "Unknown"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Revoked At</td>
              <td style="padding: 8px 0;">${new Date().toUTCString()}</td>
            </tr>
          </table>
          <p>Any requests using this key will now be rejected.</p>
          <div style="${footerStyle}">
            <p>Rail Layer — Enterprise Payment Infrastructure</p>
          </div>
        </div>`,
      };

    case "usage_warning":
      return {
        subject: `Usage Alert: ${data.percent || 80}% of Monthly Limit — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #f59e0b;">Usage Warning ⚠️</h1>
          <p>You've used <strong>${data.percent || 80}%</strong> of your monthly API limit.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Current Usage</td>
              <td style="padding: 8px 0; font-weight: 600;">${(data.current || 0).toLocaleString()} requests</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Monthly Limit</td>
              <td style="padding: 8px 0; font-weight: 600;">${(data.limit || 10000).toLocaleString()} requests</td>
            </tr>
          </table>
          <p>Once you reach your limit, API requests will return <code>429 Too Many Requests</code>.</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">View Usage Dashboard</a>
          <div style="${footerStyle}">
            <p>Rail Layer — Enterprise Payment Infrastructure</p>
          </div>
        </div>`,
      };

    case "usage_limit_reached":
      return {
        subject: "Usage Limit Reached — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #ef4444;">Monthly Limit Reached 🛑</h1>
          <p>You've reached your monthly API usage limit of <strong>${(data.limit || 10000).toLocaleString()} requests</strong>.</p>
          <p>All API requests will now return <code>429 Too Many Requests</code> until your billing cycle resets.</p>
          <p>To continue using the API without interruption, please upgrade your plan or contact sales.</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Upgrade Plan</a>
          <div style="${footerStyle}">
            <p>Rail Layer — Enterprise Payment Infrastructure</p>
          </div>
        </div>`,
      };

    default:
      return { subject: "Rail Layer Notification", html: "<p>You have a new notification.</p>" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, html } = getEmailContent(type, data || {});

    const emailResponse = await resend.emails.send({
      from: "Rail Layer <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log(`Email sent: type=${type}, to=${to}`, emailResponse);

    return new Response(
      JSON.stringify({ success: true, id: emailResponse?.data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});