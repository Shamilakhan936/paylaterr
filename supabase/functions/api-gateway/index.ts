import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Product handlers - each returns a realistic mock response
const productHandlers: Record<string, (body: any) => { status: number; data: any }> = {
  "bnpl-bills": (body) => ({
    status: 201,
    data: {
      id: `bnpl_${crypto.randomUUID().slice(0, 8)}`,
      status: "active",
      user_id: body.user_id || "usr_demo",
      bill_type: body.bill_type || "utility",
      bill_amount: body.bill_amount || 450.0,
      installments: body.installments || 4,
      installment_amount: ((body.bill_amount || 450) / (body.installments || 4)).toFixed(2),
      next_payment_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      schedule: Array.from({ length: body.installments || 4 }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 30 * 86400000).toISOString().split("T")[0],
        amount: ((body.bill_amount || 450) / (body.installments || 4)).toFixed(2),
        status: "pending",
      })),
      created_at: new Date().toISOString(),
    },
  }),

  spendnest: (body) => ({
    status: 200,
    data: {
      analysis_id: `anl_${crypto.randomUUID().slice(0, 8)}`,
      user_id: body.user_id || "usr_demo",
      period: "2024-01",
      categories: {
        groceries: { total: 345.67, trend: "+5%", count: 12 },
        dining: { total: 189.0, trend: "-12%", count: 8 },
        transport: { total: 95.5, trend: "+2%", count: 15 },
        entertainment: { total: 67.0, trend: "-8%", count: 4 },
      },
      insights: [
        "Grocery spending up 5% from last month",
        "Dining expenses decreased by 12%",
        "Consider setting a transport budget of $100/month",
      ],
      total_spend: 697.17,
      savings_potential: 85.0,
    },
  }),

  earlypay: (body) => ({
    status: 201,
    data: {
      advance_id: `adv_${crypto.randomUUID().slice(0, 8)}`,
      employee_id: body.employee_id || "emp_demo",
      amount: body.amount || 250.0,
      fee: ((body.amount || 250) * 0.02).toFixed(2),
      net_amount: ((body.amount || 250) * 0.98).toFixed(2),
      disbursement_method: body.disbursement_method || "instant",
      status: "approved",
      estimated_arrival: body.disbursement_method === "instant" ? "within_minutes" : "1-2_business_days",
      repayment_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    },
  }),

  "bill-rewards": (body) => ({
    status: 200,
    data: {
      reward_id: `rwd_${crypto.randomUUID().slice(0, 8)}`,
      user_id: body.user_id || "usr_demo",
      points_earned: Math.floor((body.amount || 100) * 2),
      total_balance: 4520 + Math.floor((body.amount || 100) * 2),
      tier: "gold",
      multiplier: 2.0,
      next_tier_points: 10000,
      redeemable_value: `$${((4520 + Math.floor((body.amount || 100) * 2)) * 0.01).toFixed(2)}`,
    },
  }),

  latefees: (body) => ({
    status: 200,
    data: {
      protection_id: `lfp_${crypto.randomUUID().slice(0, 8)}`,
      user_id: body.user_id || "usr_demo",
      bill_id: body.bill_id || "bill_demo",
      original_due_date: body.due_date || new Date().toISOString().split("T")[0],
      extended_due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      grace_period_days: 7,
      fee_waived: true,
      protection_cost: 0,
      status: "active",
    },
  }),

  autofloat: (body) => ({
    status: 200,
    data: {
      forecast_id: `frc_${crypto.randomUUID().slice(0, 8)}`,
      user_id: body.user_id || "usr_demo",
      current_balance: 3245.67,
      forecast_period: "30_days",
      projected_inflows: 5200.0,
      projected_outflows: 4180.0,
      projected_balance: 4265.67,
      auto_transfer_enabled: true,
      next_auto_transfer: {
        date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        amount: 500.0,
        from: "savings",
        to: "checking",
      },
      risk_score: 0.15,
      recommendation: "Cash flow is healthy. Consider moving $800 to savings.",
    },
  }),

  travel: (body) => ({
    status: 201,
    data: {
      booking_id: `trv_${crypto.randomUUID().slice(0, 8)}`,
      user_id: body.user_id || "usr_demo",
      booking_type: body.booking_type || "flight",
      total_amount: body.total_amount || 1200.0,
      installments: body.installments || 6,
      monthly_payment: ((body.total_amount || 1200) / (body.installments || 6)).toFixed(2),
      status: "confirmed",
      booking_details: body.booking_details || { airline: "United", route: "SFO-JFK" },
      departure_date: body.departure_date || "2024-06-15",
      first_payment_date: new Date().toISOString().split("T")[0],
      apr: "0%",
      created_at: new Date().toISOString(),
    },
  }),

  "decision-engine": (body) => ({
    status: 200,
    data: {
      decision_id: `dec_${crypto.randomUUID().slice(0, 8)}`,
      applicant_id: body.applicant_id || "app_demo",
      decision: body.score_override ? "manual_review" : "approved",
      risk_score: 0.23,
      credit_score: 742,
      factors: [
        { name: "payment_history", score: 0.92, weight: 0.35 },
        { name: "credit_utilization", score: 0.78, weight: 0.25 },
        { name: "account_age", score: 0.85, weight: 0.20 },
        { name: "income_stability", score: 0.90, weight: 0.20 },
      ],
      recommended_limit: 15000,
      interest_rate: "12.5%",
      rules_triggered: ["rule_min_income", "rule_credit_score"],
      model_version: "v2.4.1",
      latency_ms: 45,
      evaluated_at: new Date().toISOString(),
    },
  }),

  kyc: (body) => ({
    status: 200,
    data: {
      verification_id: `kyc_${crypto.randomUUID().slice(0, 8)}`,
      applicant_id: body.applicant_id || "app_demo",
      status: "verified",
      checks: {
        identity: { status: "passed", confidence: 0.98, method: "document" },
        liveness: { status: "passed", confidence: 0.95, method: "selfie_match" },
        aml_screening: { status: "clear", matches: 0, databases_checked: 12 },
        pep_screening: { status: "clear", matches: 0 },
        address: { status: "verified", method: "utility_bill" },
      },
      risk_level: "low",
      document_type: body.document_type || "passport",
      country: body.country || "US",
      expiry_date: "2029-08-15",
      processing_time_ms: 2340,
      verified_at: new Date().toISOString(),
    },
  }),

  "device-intelligence": (body) => ({
    status: 200,
    data: {
      analysis_id: `dev_${crypto.randomUUID().slice(0, 8)}`,
      device_fingerprint: `fp_${crypto.randomUUID().slice(0, 12)}`,
      risk_score: 0.12,
      risk_level: "low",
      device_info: {
        type: "mobile",
        os: "iOS 17.2",
        browser: "Safari 17",
        screen_resolution: "1170x2532",
        timezone: "America/New_York",
        language: "en-US",
      },
      signals: {
        vpn_detected: false,
        proxy_detected: false,
        emulator_detected: false,
        rooted_device: false,
        bot_detected: false,
        incognito_mode: false,
      },
      behavioral: {
        typing_pattern: "human",
        mouse_movement: "natural",
        session_velocity: "normal",
      },
      ip_info: {
        country: "US",
        region: "California",
        isp: "Comcast",
        is_datacenter: false,
      },
      confidence: 0.97,
      analyzed_at: new Date().toISOString(),
    },
  }),

  "payment-gateway": (body) => ({
    status: 201,
    data: {
      payment_id: `pay_${crypto.randomUUID().slice(0, 8)}`,
      merchant_id: body.merchant_id || "mch_demo",
      amount: body.amount || 99.99,
      currency: body.currency || "USD",
      payment_method: body.payment_method || "card",
      status: "captured",
      card: {
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2028,
      },
      fees: {
        processing: ((body.amount || 99.99) * 0.029 + 0.30).toFixed(2),
        platform: ((body.amount || 99.99) * 0.005).toFixed(2),
        total: ((body.amount || 99.99) * 0.034 + 0.30).toFixed(2),
      },
      metadata: body.metadata || {},
      created_at: new Date().toISOString(),
    },
  }),

  "payment-processing": (body) => ({
    status: 200,
    data: {
      batch_id: `bat_${crypto.randomUUID().slice(0, 8)}`,
      transactions_count: body.transactions?.length || 1,
      total_amount: body.total_amount || 5000.00,
      currency: body.currency || "USD",
      status: "completed",
      settlement: {
        expected_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        net_amount: ((body.total_amount || 5000) * 0.97).toFixed(2),
        fees_deducted: ((body.total_amount || 5000) * 0.03).toFixed(2),
      },
      reconciliation: {
        matched: body.transactions?.length || 1,
        unmatched: 0,
        flagged: 0,
      },
      processing_time_ms: 120,
      processed_at: new Date().toISOString(),
    },
  }),
};

// Map product IDs to webhook event names
const productEventMap: Record<string, string> = {
  "bnpl-bills": "bnpl.plan.created",
  "spendnest": "spendnest.analysis.completed",
  "earlypay": "earlypay.advance.approved",
  "bill-rewards": "rewards.points.earned",
  "latefees": "latefees.protection.activated",
  "autofloat": "autofloat.forecast.generated",
  "travel": "travel.booking.confirmed",
  "decision-engine": "decision.evaluation.completed",
  "kyc": "kyc.verification.completed",
  "device-intelligence": "device.analysis.completed",
  "payment-gateway": "payment.charge.captured",
  "payment-processing": "processing.batch.completed",
};

async function validateApiKey(
  apiKey: string,
  supabaseAdmin: any
): Promise<{ valid: boolean; userId?: string; keyId?: string }> {
  const prefix = apiKey.substring(0, 11);
  const secret = apiKey.substring(3);

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const hashedSecret = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_prefix", prefix)
    .eq("hashed_secret", hashedSecret)
    .single();

  if (error || !data || data.revoked_at) {
    return { valid: false };
  }

  await supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return { valid: true, userId: data.user_id, keyId: data.id };
}

async function sendUsageEmail(
  userId: string,
  type: "usage_warning" | "usage_limit_reached",
  current: number,
  limit: number,
  supabaseAdmin: any
) {
  try {
    // Get user email
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!user?.email) return;

    const percent = Math.round((current / limit) * 100);
    await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          type,
          to: user.email,
          data: { current, limit, percent },
        }),
      }
    );
  } catch (e) {
    console.error("Failed to send usage email:", e);
  }
}

async function checkUsageLimit(
  userId: string,
  supabaseAdmin: any
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const { data } = await supabaseAdmin
    .from("usage_limits")
    .select("id, current_month_usage, monthly_limit, billing_cycle_start")
    .eq("user_id", userId)
    .single();

  if (!data) {
    // No usage limit set — create default and allow
    await supabaseAdmin.from("usage_limits").insert({
      user_id: userId,
      monthly_limit: 10000,
      current_month_usage: 1,
    });
    return { allowed: true, current: 1, limit: 10000 };
  }

  // Check if billing cycle needs reset (new month)
  const cycleStart = new Date(data.billing_cycle_start);
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  if (cycleStart < currentMonthStart) {
    // Reset cycle
    await supabaseAdmin
      .from("usage_limits")
      .update({
        current_month_usage: 1,
        billing_cycle_start: currentMonthStart.toISOString(),
      })
      .eq("id", data.id);
    return { allowed: true, current: 1, limit: data.monthly_limit };
  }

  if (data.current_month_usage >= data.monthly_limit) {
    // Send limit reached email (fire-and-forget)
    sendUsageEmail(userId, "usage_limit_reached", data.current_month_usage, data.monthly_limit, supabaseAdmin);
    return { allowed: false, current: data.current_month_usage, limit: data.monthly_limit };
  }

  // Increment usage
  const newUsage = data.current_month_usage + 1;
  await supabaseAdmin
    .from("usage_limits")
    .update({ current_month_usage: newUsage })
    .eq("id", data.id);

  // Send warning at 80% threshold
  const percent = Math.round((newUsage / data.monthly_limit) * 100);
  if (percent === 80) {
    sendUsageEmail(userId, "usage_warning", newUsage, data.monthly_limit, supabaseAdmin);
  }

  return { allowed: true, current: newUsage, limit: data.monthly_limit };
}

async function dispatchWebhooks(
  userId: string,
  product: string,
  eventData: any,
  supabaseAdmin: any
) {
  const eventName = productEventMap[product];
  if (!eventName) return;

  const { data: webhooks } = await supabaseAdmin
    .from("webhooks")
    .select("id, url, secret, events, status")
    .eq("user_id", userId)
    .eq("status", "active");

  if (!webhooks || webhooks.length === 0) return;

  const payload = {
    id: `evt_${crypto.randomUUID().slice(0, 12)}`,
    type: eventName,
    created_at: new Date().toISOString(),
    data: eventData,
  };

  for (const webhook of webhooks) {
    // Check if this webhook is subscribed to this event
    if (webhook.events.length > 0 && !webhook.events.includes(eventName)) continue;

    // Sign the payload with the webhook secret
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhook.secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(JSON.stringify(payload))
    );
    const signatureHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Fire and forget — don't block the response
    fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RailLayer-Signature": signatureHex,
        "X-RailLayer-Event": eventName,
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Webhook delivery failure — silently log
      console.error(`Webhook delivery failed for ${webhook.id} to ${webhook.url}`);
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const url = new URL(req.url);
    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const product = body.product || url.searchParams.get("product");
    const endpoint = body.endpoint || url.searchParams.get("endpoint") || `/${product}`;

    if (!product || !productHandlers[product]) {
      return new Response(
        JSON.stringify({
          error: "Invalid product",
          available_products: Object.keys(productHandlers),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for API key or auth token
    const apiKey = req.headers.get("x-api-key");
    const authHeader = req.headers.get("Authorization");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let userId: string | null = null;
    let keyId: string | null = null;

    if (apiKey) {
      const validation = await validateApiKey(apiKey, supabaseAdmin);
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: "Invalid API key" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = validation.userId!;
      keyId = validation.keyId!;
    } else if (authHeader?.startsWith("Bearer ")) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(
        authHeader.replace("Bearer ", "")
      );
      if (claimsError || !claimsData?.claims) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = claimsData.claims.sub;
    } else {
      return new Response(
        JSON.stringify({ error: "Missing authentication. Provide x-api-key header or Bearer token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Rate limiting: check usage ──
    const usage = await checkUsageLimit(userId!, supabaseAdmin);
    if (!usage.allowed) {
      const responseTime = Date.now() - startTime;
      await supabaseAdmin.from("api_request_logs").insert({
        user_id: userId,
        api_key_id: keyId,
        product,
        endpoint,
        method: req.method,
        status_code: 429,
        response_time_ms: responseTime,
      });
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          current_usage: usage.current,
          monthly_limit: usage.limit,
          message: "Upgrade your plan or contact sales for higher limits.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Execute product handler
    const result = productHandlers[product](body);
    const responseTime = Date.now() - startTime;

    // Log the request
    await supabaseAdmin.from("api_request_logs").insert({
      user_id: userId,
      api_key_id: keyId,
      product,
      endpoint,
      method: req.method,
      status_code: result.status,
      response_time_ms: responseTime,
    });

    // ── Dispatch webhooks (fire-and-forget) ──
    dispatchWebhooks(userId!, product, result.data, supabaseAdmin);

    return new Response(JSON.stringify(result.data), {
      status: result.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(usage.limit),
        "X-RateLimit-Remaining": String(usage.limit - usage.current),
        "X-Request-Id": crypto.randomUUID(),
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
