import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const scheduleId = url.searchParams.get("schedule_id");
    const type = url.searchParams.get("type") || "statement"; // "statement" or "invoice"

    if (!scheduleId) {
      return new Response(JSON.stringify({ error: "schedule_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch schedule
    const { data: schedule, error: schedErr } = await supabase
      .from("installment_schedules")
      .select("*")
      .eq("id", scheduleId)
      .single();

    if (schedErr || !schedule) {
      return new Response(JSON.stringify({ error: "Schedule not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch installment items
    const { data: items } = await supabase
      .from("installment_items")
      .select("*")
      .eq("schedule_id", scheduleId)
      .order("installment_number", { ascending: true });

    // Fetch ledger entries
    const { data: ledger } = await supabase
      .from("ledger_entries")
      .select("*")
      .eq("schedule_id", scheduleId)
      .order("created_at", { ascending: true });

    const currencySymbol = schedule.currency === "USD" ? "$" : schedule.currency;
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Generate HTML document
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${type === "invoice" ? "Invoice" : "Account Statement"} — ${schedule.plan_name}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 40px; font-size: 14px; line-height: 1.6; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
  .logo { font-size: 28px; font-weight: 800; color: #6366f1; letter-spacing: -0.5px; }
  .logo span { color: #8b5cf6; }
  .meta { text-align: right; font-size: 12px; color: #64748b; }
  .meta strong { color: #1a1a2e; display: block; font-size: 16px; }
  .section { margin-bottom: 30px; }
  .section-title { font-size: 16px; font-weight: 700; color: #6366f1; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 13px; }
  .info-grid .label { color: #64748b; }
  .info-grid .value { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  tr:nth-child(even) { background: #fafafa; }
  .status-paid { color: #10b981; font-weight: 600; }
  .status-pending { color: #f59e0b; font-weight: 600; }
  .status-overdue { color: #ef4444; font-weight: 600; }
  .totals { text-align: right; margin-top: 16px; font-size: 14px; }
  .totals .total-line { display: flex; justify-content: flex-end; gap: 40px; padding: 4px 0; }
  .totals .grand-total { font-size: 18px; font-weight: 800; color: #6366f1; border-top: 2px solid #6366f1; padding-top: 8px; margin-top: 8px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Rail<span>Layer</span></div>
    <div class="meta">
      <strong>${type === "invoice" ? "INVOICE" : "STATEMENT"}</strong>
      Date: ${now}<br>
      Ref: ${scheduleId.slice(0, 8).toUpperCase()}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Schedule Details</div>
    <div class="info-grid">
      <span class="label">Plan Name</span><span class="value">${schedule.plan_name}</span>
      <span class="label">Customer</span><span class="value">${schedule.customer_name}</span>
      <span class="label">Product</span><span class="value">${schedule.product.replace(/_/g, " ")}</span>
      <span class="label">Status</span><span class="value" style="text-transform:capitalize">${schedule.status}</span>
      <span class="label">Total Amount</span><span class="value">${currencySymbol}${Number(schedule.total_amount).toLocaleString()}</span>
      <span class="label">Installments</span><span class="value">${schedule.installment_count}</span>
      <span class="label">Frequency</span><span class="value" style="text-transform:capitalize">${schedule.frequency}</span>
      <span class="label">Start Date</span><span class="value">${schedule.start_date}</span>
    </div>
  </div>

  ${items && items.length > 0 ? `
  <div class="section">
    <div class="section-title">Installment Breakdown</div>
    <table>
      <thead><tr><th>#</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Paid At</th></tr></thead>
      <tbody>
        ${items.map((item: any) => `
          <tr>
            <td>${item.installment_number}</td>
            <td>${item.due_date}</td>
            <td>${currencySymbol}${Number(item.amount).toLocaleString()}</td>
            <td class="status-${item.status === "paid" ? "paid" : item.status === "overdue" ? "overdue" : "pending"}">${item.status}</td>
            <td>${item.paid_at ? new Date(item.paid_at).toLocaleDateString() : "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="totals">
      <div class="total-line"><span>Paid:</span><strong>${currencySymbol}${items.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount), 0).toLocaleString()}</strong></div>
      <div class="total-line"><span>Remaining:</span><strong>${currencySymbol}${items.filter((i: any) => i.status !== "paid").reduce((s: number, i: any) => s + Number(i.amount), 0).toLocaleString()}</strong></div>
      <div class="total-line grand-total"><span>Total:</span><strong>${currencySymbol}${Number(schedule.total_amount).toLocaleString()}</strong></div>
    </div>
  </div>
  ` : ""}

  ${ledger && ledger.length > 0 ? `
  <div class="section">
    <div class="section-title">Ledger Entries</div>
    <table>
      <thead><tr><th>Date</th><th>Type</th><th>Debit</th><th>Credit</th><th>Balance</th><th>Description</th></tr></thead>
      <tbody>
        ${ledger.map((e: any) => `
          <tr>
            <td>${new Date(e.created_at).toLocaleDateString()}</td>
            <td>${e.entry_type.replace(/_/g, " ")}</td>
            <td>${Number(e.debit) > 0 ? currencySymbol + Number(e.debit).toLocaleString() : "—"}</td>
            <td>${Number(e.credit) > 0 ? currencySymbol + Number(e.credit).toLocaleString() : "—"}</td>
            <td>${currencySymbol}${Number(e.balance_after).toLocaleString()}</td>
            <td>${e.description || "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ` : ""}

  <div class="footer">
    Generated by RailLayer &bull; ${now} &bull; This is a system-generated document
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${type}-${scheduleId.slice(0, 8)}.html"`,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
