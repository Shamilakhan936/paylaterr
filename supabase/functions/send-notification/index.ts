import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

type EmailType =
  | "welcome"
  | "api_key_created"
  | "api_key_revoked"
  | "usage_warning"
  | "usage_limit_reached"
  | "payment_reminder"
  | "payment_overdue"
  | "dispute_opened"
  | "dispute_resolved";

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
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Go to Dashboard</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "api_key_created":
      return {
        subject: "New API Key Created — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #6366f1;">New API Key Created 🔑</h1>
          <p>A new API key <strong>${data.key_name || ""}</strong> (${data.key_prefix || "pk_..."}) was created on ${new Date().toUTCString()}.</p>
          <p style="background: #fef3c7; padding: 12px; border-radius: 8px; color: #92400e;">⚠️ If you did not create this key, revoke it immediately.</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Manage API Keys</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "api_key_revoked":
      return {
        subject: "API Key Revoked — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #ef4444;">API Key Revoked 🚫</h1>
          <p>Key <strong>${data.key_name || "Unknown"}</strong> was revoked on ${new Date().toUTCString()}. Requests using this key will be rejected.</p>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "usage_warning":
      return {
        subject: `Usage Alert: ${data.percent || 80}% of Monthly Limit — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #f59e0b;">Usage Warning ⚠️</h1>
          <p>You've used <strong>${data.percent || 80}%</strong> of your monthly limit (${(data.current || 0).toLocaleString()} / ${(data.limit || 10000).toLocaleString()}).</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">View Usage</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "usage_limit_reached":
      return {
        subject: "Usage Limit Reached — Rail Layer",
        html: `<div style="${baseStyle}">
          <h1 style="color: #ef4444;">Monthly Limit Reached 🛑</h1>
          <p>You've hit your limit of <strong>${(data.limit || 10000).toLocaleString()} requests</strong>. API calls will return 429 until the cycle resets.</p>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Upgrade Plan</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "payment_reminder":
      return {
        subject: `Payment Reminder: ${data.plan_name || "Installment"} Due ${data.due_date || "Soon"} — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #6366f1;">Payment Reminder 🔔</h1>
          <p>An installment for <strong>${data.plan_name || "your plan"}</strong> is due on <strong>${data.due_date || "soon"}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#64748b;">Customer</td><td style="padding:8px 0;font-weight:600;">${data.customer_name || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Amount</td><td style="padding:8px 0;font-weight:600;">${data.amount || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Installment #</td><td style="padding:8px 0;font-weight:600;">${data.installment_number || "—"}</td></tr>
          </table>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">View Schedule</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "payment_overdue":
      return {
        subject: `⚠️ Overdue Payment: ${data.plan_name || "Installment"} — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #ef4444;">Payment Overdue ⚠️</h1>
          <p>An installment for <strong>${data.plan_name || "your plan"}</strong> was due on <strong>${data.due_date || "a past date"}</strong> and remains unpaid.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#64748b;">Customer</td><td style="padding:8px 0;font-weight:600;">${data.customer_name || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Amount</td><td style="padding:8px 0;font-weight:600;">${data.amount || "—"}</td></tr>
          </table>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">Take Action</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "dispute_opened":
      return {
        subject: `New Dispute Filed — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #f59e0b;">Dispute Filed 📋</h1>
          <p>A new dispute has been filed on your account.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#64748b;">Reason</td><td style="padding:8px 0;font-weight:600;">${data.reason || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Amount</td><td style="padding:8px 0;font-weight:600;">$${data.amount || "0"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Priority</td><td style="padding:8px 0;font-weight:600;">${data.priority || "medium"}</td></tr>
          </table>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">View Dispute</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
        </div>`,
      };

    case "dispute_resolved":
      return {
        subject: `Dispute Resolved — Rail Layer`,
        html: `<div style="${baseStyle}">
          <h1 style="color: #22c55e;">Dispute Resolved ✅</h1>
          <p>A dispute on your account has been resolved.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#64748b;">Reason</td><td style="padding:8px 0;font-weight:600;">${data.reason || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Resolution</td><td style="padding:8px 0;font-weight:600;">${data.resolution_note || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Status</td><td style="padding:8px 0;font-weight:600;">${data.status || "resolved"}</td></tr>
          </table>
          <a href="${data.dashboard_url || '#'}" style="${buttonStyle}">View Details</a>
          <div style="${footerStyle}"><p>Rail Layer — Enterprise Payment Infrastructure</p></div>
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
