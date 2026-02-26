import { Link } from "react-router-dom";
import {
  Receipt,
  PiggyBank,
  Wallet,
  Gift,
  ShieldAlert,
  RefreshCw,
  Plane,
  Brain,
  UserCheck,
  Smartphone,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";

const products = [
  { name: "BNPL for Bills", icon: Receipt, href: "/dashboard/products#bnpl-bills", description: "Split bills into installments" },
  { name: "Spendnest", icon: PiggyBank, href: "/dashboard/products#spendnest", description: "Smart spending insights" },
  { name: "EarlyPay", icon: Wallet, href: "/dashboard/products#earlypay", description: "Earned wage access" },
  { name: "Bill Rewards", icon: Gift, href: "/dashboard/products#bill-rewards", description: "Earn on every payment" },
  { name: "LateFees", icon: ShieldAlert, href: "/dashboard/products#latefees", description: "Late fee protection" },
  { name: "AutoFloat", icon: RefreshCw, href: "/dashboard/products#autofloat", description: "Automated cash flow" },
  { name: "Rail Layer Travel", icon: Plane, href: "/dashboard/products#travel", description: "Finance travel plans" },
  { name: "Decision Engine", icon: Brain, href: "/dashboard/products#decision-engine", description: "Real-time risk decisioning" },
  { name: "KYC", icon: UserCheck, href: "/dashboard/products#kyc", description: "Identity verification" },
  { name: "Device Intelligence", icon: Smartphone, href: "/dashboard/products#device-intelligence", description: "Fraud prevention analytics" },
  { name: "Payment Gateway", icon: CreditCard, href: "/dashboard/products#payment-gateway", description: "Accept & process payments" },
  { name: "Payment Processing", icon: ArrowLeftRight, href: "/dashboard/products#payment-processing", description: "Batch settlement & reconciliation" },
];

export function TrustedBy() {
  return (
    <section className="py-12 sm:py-20 border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground mb-6 sm:mb-10 uppercase tracking-wider">
          Our Product Suite
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <Link
              key={product.name}
              to={product.href}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border border-transparent hover:border-border hover:bg-secondary/50 transition-all duration-300"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <product.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1 line-clamp-2">{product.name}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight line-clamp-2">{product.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
