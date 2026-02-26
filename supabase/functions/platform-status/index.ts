import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all logs from last 24h for per-product stats
    const { data: recentLogs } = await supabase
      .from("api_request_logs")
      .select("product, status_code, response_time_ms, request_timestamp")
      .gte("request_timestamp", oneDayAgo.toISOString())
      .order("request_timestamp", { ascending: false })
      .limit(1000);

    // Get 7-day logs for uptime calculation
    const { data: weekLogs } = await supabase
      .from("api_request_logs")
      .select("product, status_code, request_timestamp")
      .gte("request_timestamp", sevenDaysAgo.toISOString())
      .limit(1000);

    const products = [
      "bnpl-bills", "spendnest", "earlypay", "bill-rewards",
      "latefees", "autofloat", "travel", "decision-engine",
      "kyc", "device-intelligence", "payment-gateway", "payment-processing",
    ];

    const productNames: Record<string, string> = {
      "bnpl-bills": "BNPL Bills",
      "spendnest": "SpendNest",
      "earlypay": "EarlyPay",
      "bill-rewards": "Bill Rewards",
      "latefees": "LateFees Protection",
      "autofloat": "AutoFloat",
      "travel": "Rail Layer Travel",
      "decision-engine": "Decision Engine",
      "kyc": "KYC",
      "device-intelligence": "Device Intelligence",
      "payment-gateway": "Payment Gateway",
      "payment-processing": "Payment Processing",
    };

    const services = products.map((product) => {
      const recent = (recentLogs || []).filter((l) => l.product === product);
      const week = (weekLogs || []).filter((l) => l.product === product);

      const totalRecent = recent.length;
      const errorsRecent = recent.filter((l) => l.status_code && l.status_code >= 500).length;
      const totalWeek = week.length;
      const errorsWeek = week.filter((l) => l.status_code && l.status_code >= 500).length;

      const avgLatency = totalRecent > 0
        ? Math.round(recent.reduce((sum, l) => sum + (l.response_time_ms || 0), 0) / totalRecent)
        : 0;

      const uptime = totalWeek > 0
        ? (((totalWeek - errorsWeek) / totalWeek) * 100).toFixed(2)
        : "100.00";

      const errorRate = totalRecent > 0 ? (errorsRecent / totalRecent) : 0;

      let status: "operational" | "degraded" | "outage" = "operational";
      if (errorRate > 0.5) status = "outage";
      else if (errorRate > 0.1) status = "degraded";

      return {
        id: product,
        name: productNames[product] || product,
        status,
        uptime: `${uptime}%`,
        latency: totalRecent > 0 ? `${avgLatency}ms` : "N/A",
        requests_24h: totalRecent,
        errors_24h: errorsRecent,
      };
    });

    // Platform-level services (dashboard, webhooks are always operational since they're frontend)
    const platformServices = [
      { id: "dashboard", name: "Dashboard", status: "operational" as const, uptime: "99.99%", latency: "~120ms", requests_24h: 0, errors_24h: 0 },
      { id: "api-gateway", name: "API Gateway", ...(() => {
        const total = (recentLogs || []).length;
        const errors = (recentLogs || []).filter(l => l.status_code && l.status_code >= 500).length;
        const avgLat = total > 0 ? Math.round((recentLogs || []).reduce((s, l) => s + (l.response_time_ms || 0), 0) / total) : 0;
        const weekTotal = (weekLogs || []).length;
        const weekErrors = (weekLogs || []).filter(l => l.status_code && l.status_code >= 500).length;
        const up = weekTotal > 0 ? (((weekTotal - weekErrors) / weekTotal) * 100).toFixed(2) : "100.00";
        const errRate = total > 0 ? errors / total : 0;
        return {
          status: (errRate > 0.5 ? "outage" : errRate > 0.1 ? "degraded" : "operational") as "operational" | "degraded" | "outage",
          uptime: `${up}%`,
          latency: total > 0 ? `${avgLat}ms` : "N/A",
          requests_24h: total,
          errors_24h: errors,
        };
      })() },
    ];

    const allServices = [...platformServices, ...services];
    const overallStatus = allServices.some(s => s.status === "outage")
      ? "major_outage"
      : allServices.some(s => s.status === "degraded")
      ? "partial_outage"
      : "operational";

    return new Response(
      JSON.stringify({
        status: overallStatus,
        updated_at: now.toISOString(),
        services: allServices,
        summary: {
          total_requests_24h: (recentLogs || []).length,
          total_errors_24h: (recentLogs || []).filter(l => l.status_code && l.status_code >= 500).length,
          avg_response_time_ms: (recentLogs || []).length > 0
            ? Math.round((recentLogs || []).reduce((s, l) => s + (l.response_time_ms || 0), 0) / (recentLogs || []).length)
            : 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
