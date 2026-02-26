import { CreditCard, Shield, Zap, BarChart3, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Instant Account Linking",
    description: "Connect bank accounts in seconds with our secure tokenized flow. Support for 12,000+ financial institutions.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Real-time income verification and credit scoring. Reduce default rates with intelligent underwriting.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-50ms API response times. Process millions of transactions without breaking a sweat.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Deep insights into payment patterns, customer behavior, and revenue metrics in real-time.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "SOC 2 Type II certified. End-to-end encryption with hardware security modules.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Support for 40+ countries and 100+ currencies. Expand internationally with a single integration.",
  },
];

export function Features() {
  return (
    <section id="products" className="py-16 sm:py-24 max-sm:pb-0 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Everything you need to power{" "}
            <span className="text-gradient">flexible payments</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            A complete suite of APIs designed for modern BNPL experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-4 sm:p-6 rounded-2xl glass-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
