import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Receipt, 
  PiggyBank, 
  Wallet, 
  Gift, 
  AlertCircle, 
  RefreshCw, 
  Plane,
  Play,
  Book,
  Code2,
  Zap
} from "lucide-react";
import { useState } from "react";

const productData: Record<string, {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  status: string;
  overview: string;
  useCases: string[];
  endpoints: Array<{ method: string; path: string; description: string }>;
  requestExample: string;
  responseExample: string;
  webhookEvents: string[];
  rateLimit: string;
  pricing: string;
}> = {
  "bnpl-bills": {
    id: "bnpl-bills",
    name: "Buy Now Pay Later for Bills",
    description: "Enable customers to split their utility, rent, and recurring bills into flexible installments.",
    icon: Receipt,
    color: "bg-primary/10 text-primary",
    status: "live",
    overview: "The BNPL Bills API allows you to offer flexible payment plans for utility bills, rent, insurance premiums, and other recurring expenses. Customers can split any bill into 4-12 installments with automatic payment scheduling.",
    useCases: [
      "Split utility bills into monthly payments",
      "Offer rent installment plans for property managers",
      "Enable insurance premium financing",
      "Provide flexible payment options for subscription services"
    ],
    endpoints: [
      { method: "POST", path: "/v1/bnpl/bills/create", description: "Create a new bill payment plan" },
      { method: "GET", path: "/v1/bnpl/bills/:id", description: "Retrieve payment plan details" },
      { method: "POST", path: "/v1/bnpl/bills/:id/pay", description: "Process an installment payment" },
      { method: "GET", path: "/v1/bnpl/bills/user/:userId", description: "List all plans for a user" },
      { method: "DELETE", path: "/v1/bnpl/bills/:id", description: "Cancel a payment plan" }
    ],
    requestExample: `{
  "user_id": "usr_123abc",
  "bill_type": "utility",
  "bill_amount": 450.00,
  "installments": 4,
  "start_date": "2024-02-01",
  "biller_account": "ACC-789456"
}`,
    responseExample: `{
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
}`,
    webhookEvents: ["bnpl.plan.created", "bnpl.payment.success", "bnpl.payment.failed", "bnpl.plan.completed"],
    rateLimit: "1000 requests/minute",
    pricing: "$0.25 per successful plan creation"
  },
  "spendnest": {
    id: "spendnest",
    name: "SpendNest",
    description: "Comprehensive spending tracker that categorizes transactions and provides real-time insights.",
    icon: PiggyBank,
    color: "bg-accent/10 text-accent",
    status: "live",
    overview: "SpendNest provides AI-powered transaction categorization and spending insights. Integrate to give your users a complete picture of their finances with automatic categorization, trend analysis, and budget recommendations.",
    useCases: [
      "Categorize transactions automatically",
      "Generate spending reports and insights",
      "Provide budget recommendations",
      "Detect unusual spending patterns"
    ],
    endpoints: [
      { method: "POST", path: "/v1/spendnest/analyze", description: "Analyze transactions and get insights" },
      { method: "GET", path: "/v1/spendnest/categories", description: "Get spending by category" },
      { method: "GET", path: "/v1/spendnest/trends/:userId", description: "Get spending trends over time" },
      { method: "POST", path: "/v1/spendnest/budget", description: "Create or update budget goals" },
      { method: "GET", path: "/v1/spendnest/alerts/:userId", description: "Get spending alerts" }
    ],
    requestExample: `{
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
    responseExample: `{
  "analysis_id": "anl_abc123",
  "categories": {
    "groceries": { "total": 345.67, "trend": "+5%" },
    "dining": { "total": 189.00, "trend": "-12%" },
    "utilities": { "total": 234.50, "trend": "0%" }
  },
  "insights": [
    "Grocery spending up 5% from last month",
    "You saved $27 on dining compared to your average"
  ],
  "budget_status": "on_track"
}`,
    webhookEvents: ["spendnest.analysis.complete", "spendnest.budget.exceeded", "spendnest.anomaly.detected"],
    rateLimit: "500 requests/minute",
    pricing: "$0.01 per transaction analyzed"
  },
  "earlypay": {
    id: "earlypay",
    name: "EarlyPay",
    description: "Earned Wage Access solution allowing employees to access their wages before payday.",
    icon: Wallet,
    color: "bg-primary/10 text-primary",
    status: "live",
    overview: "EarlyPay enables employers to offer earned wage access to their workforce. Employees can access up to 50% of their earned wages before payday, reducing financial stress and improving retention.",
    useCases: [
      "Provide earned wage access to employees",
      "Reduce payroll advance requests",
      "Improve employee financial wellness",
      "Integrate with existing payroll systems"
    ],
    endpoints: [
      { method: "POST", path: "/v1/earlypay/advance", description: "Request an early wage advance" },
      { method: "GET", path: "/v1/earlypay/eligible/:employeeId", description: "Check eligibility and available amount" },
      { method: "GET", path: "/v1/earlypay/history/:employeeId", description: "Get advance history" },
      { method: "POST", path: "/v1/earlypay/employer/sync", description: "Sync employee work hours" },
      { method: "GET", path: "/v1/earlypay/employer/dashboard", description: "Employer analytics dashboard" }
    ],
    requestExample: `{
  "employee_id": "emp_456def",
  "amount": 250.00,
  "disbursement_method": "instant",
  "reason": "emergency_expense"
}`,
    responseExample: `{
  "advance_id": "adv_789xyz",
  "status": "approved",
  "amount": 250.00,
  "fee": 2.99,
  "disbursement_eta": "instant",
  "repayment_date": "2024-02-15",
  "remaining_eligible": 350.00
}`,
    webhookEvents: ["earlypay.advance.requested", "earlypay.advance.approved", "earlypay.advance.disbursed", "earlypay.repayment.complete"],
    rateLimit: "200 requests/minute",
    pricing: "$2.99 flat fee per advance or revenue share model"
  },
  "rewards": {
    id: "rewards",
    name: "Bill Rewards",
    description: "Loyalty and cashback rewards program for bill payments and financial activities.",
    icon: Gift,
    color: "bg-accent/10 text-accent",
    status: "live",
    overview: "Bill Rewards API lets you build loyalty programs around bill payments. Users earn points or cashback on every bill payment, which can be redeemed at partner merchants or converted to statement credits.",
    useCases: [
      "Award points for on-time bill payments",
      "Partner with merchants for redemption",
      "Offer cashback on specific bill categories",
      "Create tiered loyalty programs"
    ],
    endpoints: [
      { method: "POST", path: "/v1/rewards/earn", description: "Award points for an activity" },
      { method: "GET", path: "/v1/rewards/balance/:userId", description: "Get rewards balance" },
      { method: "POST", path: "/v1/rewards/redeem", description: "Redeem points for rewards" },
      { method: "GET", path: "/v1/rewards/catalog", description: "Get available redemption options" },
      { method: "GET", path: "/v1/rewards/history/:userId", description: "Get earning/redemption history" }
    ],
    requestExample: `{
  "user_id": "usr_123abc",
  "activity_type": "bill_payment",
  "amount": 150.00,
  "bill_category": "utility",
  "on_time": true
}`,
    responseExample: `{
  "transaction_id": "rwd_abc123",
  "points_earned": 150,
  "bonus_points": 50,
  "total_balance": 2450,
  "tier": "gold",
  "next_tier_points": 550
}`,
    webhookEvents: ["rewards.earned", "rewards.redeemed", "rewards.tier.upgraded", "rewards.points.expiring"],
    rateLimit: "1000 requests/minute",
    pricing: "$0.001 per point issued"
  },
  "latefees": {
    id: "latefees",
    name: "LateFees Protection",
    description: "Intelligent late fee prevention and management system with automatic payment scheduling.",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
    status: "beta",
    overview: "LateFees Protection helps users avoid costly late fees through intelligent reminders, auto-pay enrollment, and even fee negotiation with billers. Reduce customer churn by helping them manage their bills proactively.",
    useCases: [
      "Send smart payment reminders",
      "Auto-enroll users in autopay",
      "Negotiate late fees on behalf of users",
      "Predict bills at risk of late payment"
    ],
    endpoints: [
      { method: "POST", path: "/v1/latefees/protect", description: "Enable protection for a bill" },
      { method: "GET", path: "/v1/latefees/risk/:userId", description: "Get bills at risk of late payment" },
      { method: "POST", path: "/v1/latefees/negotiate", description: "Request late fee negotiation" },
      { method: "GET", path: "/v1/latefees/savings/:userId", description: "Get total fees saved" },
      { method: "POST", path: "/v1/latefees/autopay", description: "Set up automatic payments" }
    ],
    requestExample: `{
  "user_id": "usr_123abc",
  "bill_id": "bill_456",
  "due_date": "2024-02-15",
  "amount": 89.99,
  "enable_autopay": true,
  "reminder_days": [7, 3, 1]
}`,
    responseExample: `{
  "protection_id": "prot_xyz789",
  "status": "active",
  "autopay_enabled": true,
  "next_reminder": "2024-02-08",
  "risk_score": "low",
  "estimated_savings": 25.00
}`,
    webhookEvents: ["latefees.reminder.sent", "latefees.payment.auto", "latefees.negotiation.success", "latefees.risk.high"],
    rateLimit: "500 requests/minute",
    pricing: "20% of fees saved (success-based)"
  },
  "autofloat": {
    id: "autofloat",
    name: "AutoFloat",
    description: "Automated cash flow management with intelligent overdraft protection and micro-advances.",
    icon: RefreshCw,
    color: "bg-primary/10 text-primary",
    status: "live",
    overview: "AutoFloat provides intelligent cash flow management by predicting shortfalls and automatically providing micro-advances to cover them. Prevent overdrafts and NSF fees with proactive balance management.",
    useCases: [
      "Predict cash flow shortfalls",
      "Provide automatic micro-advances",
      "Prevent overdraft and NSF fees",
      "Optimize account balances across accounts"
    ],
    endpoints: [
      { method: "POST", path: "/v1/autofloat/manage", description: "Enable AutoFloat for an account" },
      { method: "GET", path: "/v1/autofloat/forecast/:userId", description: "Get 30-day cash flow forecast" },
      { method: "POST", path: "/v1/autofloat/advance", description: "Request a micro-advance" },
      { method: "GET", path: "/v1/autofloat/status/:userId", description: "Get current float status" },
      { method: "POST", path: "/v1/autofloat/repay", description: "Repay outstanding advances" }
    ],
    requestExample: `{
  "user_id": "usr_123abc",
  "account_id": "acc_789",
  "min_balance": 50.00,
  "max_float": 200.00,
  "auto_repay": true
}`,
    responseExample: `{
  "float_id": "flt_abc123",
  "status": "active",
  "current_float": 0.00,
  "available_float": 200.00,
  "predicted_shortfall": 75.00,
  "shortfall_date": "2024-02-10",
  "recommendation": "auto_advance"
}`,
    webhookEvents: ["autofloat.shortfall.predicted", "autofloat.advance.issued", "autofloat.repayment.complete", "autofloat.balance.low"],
    rateLimit: "300 requests/minute",
    pricing: "$1.00 per advance or 0.5% of advance amount"
  },
  "travel": {
    id: "travel",
    name: "Paylaterr Travel",
    description: "Travel financing solution for flights, hotels, and vacation packages with flexible payment terms.",
    icon: Plane,
    color: "bg-accent/10 text-accent",
    status: "live",
    overview: "Paylaterr Travel enables customers to book flights, hotels, and vacation packages with flexible payment plans up to 24 months. Integrate with your travel platform to increase booking conversions and average order value.",
    useCases: [
      "Finance flight bookings",
      "Offer hotel payment plans",
      "Enable vacation package financing",
      "Increase booking conversion rates"
    ],
    endpoints: [
      { method: "POST", path: "/v1/travel/book", description: "Create a travel financing plan" },
      { method: "GET", path: "/v1/travel/quote", description: "Get financing options for a booking" },
      { method: "GET", path: "/v1/travel/bookings/:userId", description: "List user's travel bookings" },
      { method: "POST", path: "/v1/travel/cancel/:bookingId", description: "Cancel a booking" },
      { method: "GET", path: "/v1/travel/partners", description: "List partner airlines/hotels" }
    ],
    requestExample: `{
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
    responseExample: `{
  "booking_id": "trv_xyz789",
  "status": "confirmed",
  "monthly_payment": 200.00,
  "apr": "0%",
  "first_payment_date": "2024-02-01",
  "travel_protection": true,
  "cancellation_policy": "flexible"
}`,
    webhookEvents: ["travel.booking.created", "travel.payment.processed", "travel.booking.cancelled", "travel.trip.completed"],
    rateLimit: "200 requests/minute",
    pricing: "2.5% of booking value"
  }
};

const ProductDocumentation = () => {
  const { productId } = useParams<{ productId: string }>();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const product = productId ? productData[productId] : null;
  
  if (!product) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">The requested product documentation could not be found.</p>
          <Button asChild>
            <Link to="/dashboard/products">Back to Products</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const IconComponent = product.icon;

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <Link 
        to="/dashboard/products" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl ${product.color} flex items-center justify-center`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{product.name}</h1>
              <Badge variant={product.status === 'live' ? 'default' : 'secondary'}>{product.status}</Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/api-keys">
              <Play className="w-4 h-4 mr-2" />
              Try in Sandbox
            </Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/dashboard/api-keys">
              <Code2 className="w-4 h-4 mr-2" />
              Get API Keys
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Rate Limit</p>
          <p className="font-semibold text-foreground">{product.rateLimit}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Pricing</p>
          <p className="font-semibold text-foreground">{product.pricing}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Endpoints</p>
          <p className="font-semibold text-foreground">{product.endpoints.length} available</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Overview</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.overview}</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Use Cases</h3>
            </div>
            <ul className="space-y-3">
              {product.useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {useCase}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          {product.endpoints.map((endpoint, index) => (
            <Card key={index} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                  endpoint.method === 'GET' ? 'bg-primary/20 text-primary' :
                  endpoint.method === 'POST' ? 'bg-accent/20 text-accent' :
                  endpoint.method === 'DELETE' ? 'bg-destructive/20 text-destructive' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {endpoint.method}
                </span>
                <code className="font-mono text-foreground flex-1">{endpoint.path}</code>
                <span className="text-muted-foreground text-sm hidden sm:block">{endpoint.description}</span>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Request Example</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(product.requestExample, 'request')}
              >
                {copiedCode === 'request' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{product.requestExample}</code>
            </pre>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Response Example</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(product.responseExample, 'response')}
              >
                {copiedCode === 'response' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{product.responseExample}</code>
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Available Webhook Events</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.webhookEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <code className="text-sm font-mono text-foreground">{event}</code>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDocumentation;
