import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const configId = url.searchParams.get("configId");

    if (!configId) {
      return new Response("Missing configId parameter", { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: config, error } = await supabase
      .from("widget_configs")
      .select("*")
      .eq("id", configId)
      .eq("enabled", true)
      .single();

    if (error || !config) {
      return new Response("Widget not found or disabled", { status: 404, headers: corsHeaders });
    }

    const js = `
(function() {
  var cfg = ${JSON.stringify({
    productId: config.product_id,
    label: config.label,
    primary: config.color_primary,
    secondary: config.color_secondary,
    accent: config.color_accent,
    bg: config.color_background,
    text: config.color_text,
    border: config.color_border,
    radius: config.border_radius + "px",
    font: config.font_family,
  })};

  var container = document.getElementById("raillayer-widget-" + cfg.productId);
  if (!container) return;

  var link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(cfg.font) + ":wght@400;500;600&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  container.innerHTML = '<div style="font-family:\\'' + cfg.font + "\\',sans-serif;max-width:400px;border:1px solid " + cfg.border + ";border-radius:" + cfg.radius + ";overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);\\">"
    + '<div style="background:linear-gradient(135deg,' + cfg.primary + "," + cfg.secondary + ");padding:20px;\\">"
    + '<span style="color:#fff;font-weight:600;font-size:16px;\\">' + cfg.label + "</span></div>"
    + '<div style="padding:20px;background:' + cfg.bg + ';\\">'
    + '<p style="color:' + cfg.text + ";font-size:14px;margin:0 0 16px;\\">" + "Get started with " + cfg.label + ".</p>"
    + '<button style="background:' + cfg.primary + ";color:#fff;border:none;border-radius:" + cfg.radius + ";padding:8px 16px;font-size:13px;cursor:pointer;font-family:\\'" + cfg.font + "\\',sans-serif;\\">" + "Launch</button>"
    + "</div>"
    + '<div style="border-top:1px solid ' + cfg.border + ";padding:10px 20px;background:" + cfg.bg + ';\\">'
    + '<span style="color:' + cfg.text + ";opacity:0.4;font-size:11px;\\">" + "Powered by Rail Layer</span></div></div>";
})();`;

    return new Response(js, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
