import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for testing and small projects",
    features: [
      "1,000 API calls/month",
      "2 team members",
      "Basic analytics",
      "Email support",
      "Sandbox environment",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$299",
    period: "/month",
    description: "For growing businesses with more volume",
    features: [
      "100,000 API calls/month",
      "10 team members",
      "Advanced analytics",
      "Priority support",
      "Custom webhooks",
      "Risk engine access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited API calls",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "On-premise option",
      "Custom ML models",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <section className="relative py-20 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, #59168B33 0%, transparent 70%)",
            }}
          />
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-[#99A1AF] max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>  
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 pt-0">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8  mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`p-8 bg-card border-border relative ${
                    plan.popular ? 'border-primary shadow-glow' : ''
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-[#99A1AF]">{plan.period}</span>
                    </div>
                    <p className="text-sm text-[#99A1AF] mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 p-1 text-primary bg-[#2DD4BF1A]   rounded-full" />
                        <span className="text-[#D1D5DC]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="md:py-32 py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                { q: "What counts as an API call?", a: "Any request to our API endpoints counts as one call. Webhooks and sandbox requests are free." },
                { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan at any time. Changes take effect immediately." },
                { q: "Do you offer annual billing?", a: "Yes, annual billing gives you 2 months free. Contact sales for details." },
                { q: "Is there a free trial?", a: "All paid plans include a 14-day free trial with full access to features." },
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-[#99A1AF] text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pricing;
