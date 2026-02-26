import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Play, 
  Copy, 
  Check,
  ChevronRight,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const endpoints = [
  { method: "POST", path: "/v1/bnpl/bills/create", name: "Create Bill Plan", product: "bnpl-bills" },
  { method: "POST", path: "/v1/spendnest/analyze", name: "Analyze Spending", product: "spendnest" },
  { method: "POST", path: "/v1/earlypay/advance", name: "Request Advance", product: "earlypay" },
  { method: "POST", path: "/v1/rewards/earn", name: "Earn Rewards", product: "bill-rewards" },
  { method: "POST", path: "/v1/latefees/protect", name: "Late Fee Protection", product: "latefees" },
  { method: "POST", path: "/v1/autofloat/forecast", name: "Cash Forecast", product: "autofloat" },
  { method: "POST", path: "/v1/travel/book", name: "Book Travel", product: "travel" },
  { method: "POST", path: "/v1/decisions/evaluate", name: "Evaluate Risk", product: "decision-engine" },
  { method: "POST", path: "/v1/kyc/verify", name: "Verify Identity", product: "kyc" },
  { method: "POST", path: "/v1/device/analyze", name: "Analyze Device", product: "device-intelligence" },
  { method: "POST", path: "/v1/payments/charge", name: "Process Payment", product: "payment-gateway" },
  { method: "POST", path: "/v1/processing/batch", name: "Batch Processing", product: "payment-processing" },
];

const sampleRequests: Record<string, string> = {
  "bnpl-bills": `{
  "user_id": "usr_123abc",
  "bill_type": "utility",
  "bill_amount": 450.00,
  "installments": 4,
  "biller_account": "ACC-789456"
}`,
  "spendnest": `{
  "user_id": "usr_123abc",
  "transactions": [
    { "id": "txn_001", "amount": 45.99, "merchant": "Whole Foods", "date": "2024-01-15" }
  ],
  "include_insights": true
}`,
  "earlypay": `{
  "employee_id": "emp_456def",
  "amount": 250.00,
  "disbursement_method": "instant",
  "reason": "emergency_expense"
}`,
  "bill-rewards": `{
  "user_id": "usr_123abc",
  "amount": 150.00,
  "bill_type": "electricity"
}`,
  "latefees": `{
  "user_id": "usr_123abc",
  "bill_id": "bill_789",
  "due_date": "2024-02-15"
}`,
  "autofloat": `{
  "user_id": "usr_123abc",
  "forecast_days": 30
}`,
  "travel": `{
  "user_id": "usr_123abc",
  "booking_type": "flight",
  "total_amount": 1200.00,
  "installments": 6,
  "departure_date": "2024-06-15",
  "booking_details": { "airline": "United", "route": "SFO-JFK" }
}`,
  "decision-engine": `{
  "applicant_id": "app_demo123",
  "income": 75000,
  "employment_status": "employed",
  "requested_amount": 10000
}`,
  "kyc": `{
  "applicant_id": "app_demo123",
  "document_type": "passport",
  "country": "US",
  "full_name": "John Doe",
  "date_of_birth": "1990-05-15"
}`,
  "device-intelligence": `{
  "session_id": "sess_abc123",
  "user_agent": "Mozilla/5.0",
  "ip_address": "203.0.113.42"
}`,
  "payment-gateway": `{
  "merchant_id": "mch_demo123",
  "amount": 99.99,
  "currency": "USD",
  "payment_method": "card",
  "metadata": { "order_id": "ord_456" }
}`,
  "payment-processing": `{
  "total_amount": 5000.00,
  "currency": "USD",
  "transactions": [
    { "id": "txn_001", "amount": 2500.00, "type": "debit" },
    { "id": "txn_002", "amount": 2500.00, "type": "credit" }
  ]
}`,
};

const methodColors: Record<string, string> = {
  GET: "bg-primary/20 text-primary",
  POST: "bg-accent/20 text-accent",
  PUT: "bg-yellow-500/20 text-yellow-500",
  DELETE: "bg-destructive/20 text-destructive",
};

const APIPlayground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState(sampleRequests[endpoints[0].product] || "{}");
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleEndpointChange = (product: string) => {
    const endpoint = endpoints.find(e => e.product === product);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setRequestBody(sampleRequests[product] || "{}");
      setResponse(null);
    }
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", description: "Please sign in first.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      let parsedBody: any;
      try {
        parsedBody = JSON.parse(requestBody);
      } catch {
        toast({ title: "Invalid JSON", description: "Check your request body.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-gateway`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            product: selectedEndpoint.product,
            endpoint: selectedEndpoint.path,
            ...parsedBody,
          }),
        }
      );

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      setResponse({
        status: res.status,
        body: JSON.stringify(data, null, 2),
        time: elapsed,
      });
    } catch (err: any) {
      setResponse({
        status: 500,
        body: JSON.stringify({ error: err.message }, null, 2),
        time: Date.now() - startTime,
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">API Playground</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">Test all 10 product endpoints live</p>
        </div>
        <Badge variant="secondary" className="text-xs sm:text-sm w-fit">Sandbox</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-3 sm:p-4 bg-card border-border lg:col-span-1 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Endpoints</h3>
          <div className="space-y-1.5 sm:space-y-2 max-h-[280px] sm:max-h-[400px] lg:max-h-[600px] overflow-y-auto -mr-1 pr-1">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.product}
                onClick={() => handleEndpointChange(endpoint.product)}
                className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg text-left transition-colors touch-manipulation ${
                  selectedEndpoint.product === endpoint.product
                    ? "bg-primary/10 border border-primary/50"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Badge className={`${methodColors[endpoint.method]} text-xs font-mono flex-shrink-0`}>
                  {endpoint.method}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{endpoint.name}</p>
                  <p className="text-xs text-muted-foreground truncate font-mono">{endpoint.path}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                <Badge className={`${methodColors[selectedEndpoint.method]} font-mono text-xs flex-shrink-0`}>
                  {selectedEndpoint.method}
                </Badge>
                <code className="text-xs sm:text-sm font-mono text-foreground truncate">{selectedEndpoint.path}</code>
              </div>
              <Button variant="hero" onClick={handleExecute} disabled={isLoading} className="w-full sm:w-auto text-sm min-h-10 touch-manipulation flex-shrink-0">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
                ) : (
                  <Play className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                Execute
              </Button>
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Request Body</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(requestBody)} className="h-8 w-8 p-0 touch-manipulation">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="font-mono text-xs sm:text-sm bg-secondary border-border min-h-[160px] sm:min-h-[200px] resize-y"
              />
            </div>
          </Card>

          {response && (
            <Card className="p-4 sm:p-6 bg-card border-border min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-xs sm:text-sm text-muted-foreground">Response</span>
                  <Badge className={`text-xs ${response.status < 400 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                    {response.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{response.time}ms</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(response.body)} className="h-8 w-8 p-0 touch-manipulation flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="bg-secondary p-3 sm:p-4 rounded-lg overflow-x-auto max-h-[280px] sm:max-h-[400px] text-xs sm:text-sm">
                <code className="font-mono text-foreground">{response.body}</code>
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIPlayground;
