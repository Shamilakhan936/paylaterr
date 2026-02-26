import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Receipt, 
  PiggyBank, 
  Wallet, 
  Gift, 
  AlertCircle, 
  RefreshCw, 
  Plane,
  ArrowRight,
  Code,
  Zap,
  Brain,
  UserCheck,
  Smartphone,
  CreditCard,
  ArrowLeftRight
} from "lucide-react";

const products = [
  {
    id: "bnpl-bills",
    name: "Buy Now Pay Later for Bills",
    shortName: "BNPL Bills",
    description: "Enable customers to split their utility, rent, and recurring bills into flexible installments.",
    icon: Receipt,
    color: "bg-primary/10 text-primary",
    features: ["Split bills into 4-12 installments", "Auto-payment scheduling", "Bill provider integrations"],
    endpoint: "/v1/bnpl/bills",
    status: "live",
  },
  {
    id: "spendnest",
    name: "SpendNest",
    shortName: "SpendNest",
    description: "Comprehensive spending tracker that categorizes transactions and provides real-time insights.",
    icon: PiggyBank,
    color: "bg-accent/10 text-accent",
    features: ["Transaction categorization", "Spending insights API", "Budget recommendations"],
    endpoint: "/v1/spendnest/analyze",
    status: "live",
  },
  {
    id: "earlypay",
    name: "EarlyPay",
    shortName: "EarlyPay",
    description: "Earned Wage Access solution allowing employees to access their wages before payday.",
    icon: Wallet,
    color: "bg-primary/10 text-primary",
    features: ["Real-time wage calculation", "Employer integrations", "Instant disbursement"],
    endpoint: "/v1/earlypay/advance",
    status: "live",
  },
  {
    id: "rewards",
    name: "Bill Rewards",
    shortName: "Rewards",
    description: "Loyalty and cashback rewards program for bill payments and financial activities.",
    icon: Gift,
    color: "bg-accent/10 text-accent",
    features: ["Points accumulation", "Partner merchant network", "Instant redemption"],
    endpoint: "/v1/rewards/earn",
    status: "live",
  },
  {
    id: "latefees",
    name: "LateFees Protection",
    shortName: "LateFees",
    description: "Intelligent late fee prevention and management system with automatic payment scheduling.",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
    features: ["Payment reminders", "Auto-pay enrollment", "Fee negotiation API"],
    endpoint: "/v1/latefees/protect",
    status: "beta",
  },
  {
    id: "autofloat",
    name: "AutoFloat",
    shortName: "AutoFloat",
    description: "Automated cash flow management with intelligent overdraft protection and micro-advances.",
    icon: RefreshCw,
    color: "bg-primary/10 text-primary",
    features: ["Predictive cash flow", "Smart overdraft coverage", "Auto-repayment"],
    endpoint: "/v1/autofloat/manage",
    status: "live",
  },
  {
    id: "travel",
    name: "Rail Layer Travel",
    shortName: "Travel",
    description: "Travel financing solution for flights, hotels, and vacation packages with flexible payment terms.",
    icon: Plane,
    color: "bg-accent/10 text-accent",
    features: ["Travel booking API", "Installment plans up to 24 months", "Partner airline/hotel network"],
    endpoint: "/v1/travel/book",
    status: "live",
  },
  {
    id: "decision-engine",
    name: "Decision Engine",
    shortName: "Decision Engine",
    description: "Real-time credit and risk decisioning engine powered by configurable rules and machine learning models.",
    icon: Brain,
    color: "bg-primary/10 text-primary",
    features: ["Configurable rule sets", "ML-powered scoring", "Real-time decisioning API"],
    endpoint: "/v1/decisions/evaluate",
    status: "live",
  },
  {
    id: "kyc",
    name: "KYC",
    shortName: "KYC",
    description: "Know Your Customer identity verification with document checks, liveness detection, and AML screening.",
    icon: UserCheck,
    color: "bg-accent/10 text-accent",
    features: ["Document verification", "Liveness detection", "AML/PEP screening"],
    endpoint: "/v1/kyc/verify",
    status: "live",
  },
  {
    id: "device-intelligence",
    name: "Device Intelligence",
    shortName: "Device Intel",
    description: "Advanced device fingerprinting and behavioral analytics for fraud prevention and risk assessment.",
    icon: Smartphone,
    color: "bg-destructive/10 text-destructive",
    features: ["Device fingerprinting", "Behavioral biometrics", "Fraud signal detection"],
    endpoint: "/v1/device/analyze",
    status: "live",
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    shortName: "Pay Gateway",
    description: "Full-stack payment acceptance with support for cards, ACH, wallets, and alternative payment methods.",
    icon: CreditCard,
    color: "bg-primary/10 text-primary",
    features: ["Multi-method acceptance", "Real-time fraud checks", "PCI DSS Level 1"],
    endpoint: "/v1/payments/charge",
    status: "live",
  },
  {
    id: "payment-processing",
    name: "Payment Processing",
    shortName: "Processing",
    description: "High-volume batch settlement, reconciliation, and disbursement engine for enterprise payment flows.",
    icon: ArrowLeftRight,
    color: "bg-accent/10 text-accent",
    features: ["Batch settlement", "Auto-reconciliation", "Multi-currency disbursement"],
    endpoint: "/v1/processing/batch",
    status: "live",
  },
];

const DashboardProducts = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Enterprise APIs for flexible payment solutions</p>
        </div>
        <div className="flex max-sm:flex-col items-center gap-3 mt-4 lg:mt-0">
          <Button variant="outline" asChild>
            <Link to="/developers/api-reference">
              <Code className="w-4 h-4 mr-2" />
              View API Docs
            </Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/dashboard/api-keys">
              Manage API Keys
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Products</p>
            <p className="text-xl font-bold text-foreground">12</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">API Endpoints</p>
            <p className="text-xl font-bold text-foreground">42</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Response</p>
            <p className="text-xl font-bold text-foreground">45ms</p>
          </div>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/dashboard/products/${product.id}`}>
            <Card 
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${product.color} flex items-center justify-center`}>
                <product.icon className="w-6 h-6" />
              </div>
              <Badge variant={product.status === 'live' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-2 mb-4">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                {product.endpoint}
              </code>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-primary flex items-center group-hover:underline">
                View Documentation
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Card>
        </Link>
        ))}
      </div>
      <Card className="mt-8 p-6 bg-gradient-card border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Ready to integrate?</h3>
            <p className="text-muted-foreground">Get started with our SDKs and comprehensive documentation.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/developers/sdks">View SDKs</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/dashboard/api-keys">Get API Keys</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardProducts;
