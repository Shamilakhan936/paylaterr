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

const endpoints = [
  { method: "POST", path: "/v1/bnpl/bills/create", name: "Create Bill Plan" },
  { method: "GET", path: "/v1/bnpl/bills/:id", name: "Get Bill Plan" },
  { method: "POST", path: "/v1/spendnest/analyze", name: "Analyze Spending" },
  { method: "POST", path: "/v1/earlypay/advance", name: "Request Advance" },
  { method: "GET", path: "/v1/earlypay/eligible/:employeeId", name: "Check Eligibility" },
  { method: "POST", path: "/v1/rewards/earn", name: "Earn Rewards" },
  { method: "GET", path: "/v1/rewards/balance/:userId", name: "Get Balance" },
  { method: "POST", path: "/v1/travel/book", name: "Book Travel" },
  { method: "GET", path: "/v1/autofloat/forecast/:userId", name: "Cash Forecast" },
];

const sampleRequests: Record<string, string> = {
  "/v1/bnpl/bills/create": `{
  "user_id": "usr_123abc",
  "bill_type": "utility",
  "bill_amount": 450.00,
  "installments": 4,
  "start_date": "2024-02-01",
  "biller_account": "ACC-789456"
}`,
  "/v1/spendnest/analyze": `{
  "user_id": "usr_123abc",
  "transactions": [
    {
      "id": "txn_001",
      "amount": 45.99,
      "merchant": "Whole Foods",
      "date": "2024-01-15"
    }
  ],
  "include_insights": true
}`,
  "/v1/earlypay/advance": `{
  "employee_id": "emp_456def",
  "amount": 250.00,
  "disbursement_method": "instant",
  "reason": "emergency_expense"
}`,
  "/v1/travel/book": `{
  "user_id": "usr_123abc",
  "booking_type": "flight",
  "total_amount": 1200.00,
  "installments": 6,
  "departure_date": "2024-06-15",
  "booking_details": {
    "airline": "United",
    "route": "SFO-JFK"
  }
}`,
};

const sampleResponses: Record<string, { status: number; body: string }> = {
  "/v1/bnpl/bills/create": {
    status: 201,
    body: `{
  "id": "bnpl_xyz789",
  "status": "active",
  "installment_amount": 112.50,
  "next_payment_date": "2024-02-01",
  "schedule": [
    { "date": "2024-02-01", "amount": 112.50 },
    { "date": "2024-03-01", "amount": 112.50 },
    { "date": "2024-04-01", "amount": 112.50 },
    { "date": "2024-05-01", "amount": 112.50 }
  ]
}`
  },
  "/v1/spendnest/analyze": {
    status: 200,
    body: `{
  "analysis_id": "anl_abc123",
  "categories": {
    "groceries": { "total": 345.67, "trend": "+5%" },
    "dining": { "total": 189.00, "trend": "-12%" }
  },
  "insights": [
    "Grocery spending up 5% from last month"
  ]
}`
  },
};

const methodColors: Record<string, string> = {
  GET: "bg-primary/20 text-primary",
  POST: "bg-accent/20 text-accent",
  PUT: "bg-yellow-500/20 text-yellow-500",
  DELETE: "bg-destructive/20 text-destructive",
};

const APIPlayground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState(sampleRequests[endpoints[0].path] || "{}");
  const [response, setResponse] = useState<{ status: number; body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [environment, setEnvironment] = useState("sandbox");

  const handleEndpointChange = (path: string) => {
    const endpoint = endpoints.find(e => e.path === path);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setRequestBody(sampleRequests[path] || "{}");
      setResponse(null);
    }
  };

  const handleExecute = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(sampleResponses[selectedEndpoint.path] || { status: 200, body: '{"message": "Success"}' });
      setIsLoading(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">API Playground</h1>
          <p className="text-muted-foreground mt-1">Test API endpoints in real-time</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">Sandbox</SelectItem>
              <SelectItem value="production" disabled>Production</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <Card className="p-4 bg-card border-border lg:col-span-1">
          <h3 className="font-semibold text-foreground mb-4">Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.path}
                onClick={() => handleEndpointChange(endpoint.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedEndpoint.path === endpoint.path 
                    ? 'bg-primary/10 border border-primary/50' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <Badge className={`${methodColors[endpoint.method]} text-xs font-mono`}>
                  {endpoint.method}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{endpoint.name}</p>
                  <p className="text-xs text-muted-foreground truncate font-mono">{endpoint.path}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        {/* Request/Response */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className={`${methodColors[selectedEndpoint.method]} font-mono`}>
                  {selectedEndpoint.method}
                </Badge>
                <code className="text-sm font-mono text-foreground">
                  https://{environment}.api.paylaterr.com{selectedEndpoint.path}
                </code>
              </div>
              <Button variant="hero" onClick={handleExecute} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Execute
              </Button>
            </div>

            {selectedEndpoint.method !== 'GET' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Request Body</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(requestBody)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="font-mono text-sm bg-secondary border-border min-h-[200px]"
                />
              </div>
            )}
          </Card>

          {/* Response */}
          {response && (
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Response</span>
                  <Badge className={response.status < 400 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}>
                    {response.status}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(response.body)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-foreground">{response.body}</code>
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIPlayground;
