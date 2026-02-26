import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Search, 
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I create a Paylaterr account?",
    answer: "Visit our partner signup page and complete the registration form. You'll need to provide your company information, contact details, and describe your intended use case. Once submitted, you'll receive sandbox API keys within minutes."
  },
  {
    category: "Getting Started",
    question: "Is there a free tier or trial period?",
    answer: "Yes! Our sandbox environment is completely free with unlimited API calls for testing. You only pay when you move to production and start processing real transactions."
  },
  {
    category: "Getting Started",
    question: "How long does it take to get production access?",
    answer: "After completing your sandbox integration, you can request production access. Our team reviews applications within 1-2 business days. You'll need to demonstrate a working integration and pass our security review."
  },
  // API & Integration
  {
    category: "API & Integration",
    question: "What programming languages do you support?",
    answer: "We offer official SDKs for Node.js, Python, Ruby, Go, PHP, and Java. You can also use our REST API directly with any language that supports HTTP requests."
  },
  {
    category: "API & Integration",
    question: "What are the API rate limits?",
    answer: "Rate limits vary by endpoint and plan. Sandbox has no limits. On production, most endpoints allow 1000 requests/minute on Starter, 5000 on Growth, and unlimited on Enterprise. Check the API reference for specific endpoint limits."
  },
  {
    category: "API & Integration",
    question: "How do webhooks work?",
    answer: "When events occur (payments, failures, etc.), we send HTTP POST requests to your configured endpoint. Webhooks include a signature for verification. We retry failed deliveries up to 5 times with exponential backoff."
  },
  {
    category: "API & Integration",
    question: "Can I test webhooks in sandbox?",
    answer: "Yes! You can configure webhook endpoints in sandbox and trigger test events from the dashboard. We also provide a webhook testing tool to simulate various event types."
  },
  // Products
  {
    category: "Products",
    question: "What products are available?",
    answer: "We offer 7 products: BNPL Bills (split bills into installments), SpendNest (spending analytics), EarlyPay (earned wage access), Bill Rewards (loyalty program), LateFees Protection, AutoFloat (cash flow management), and Paylaterr Travel."
  },
  {
    category: "Products",
    question: "Can I use multiple products together?",
    answer: "Absolutely! Our products are designed to work together. For example, you can combine SpendNest insights with BNPL Bills to offer personalized payment plans, or use Rewards alongside any payment product."
  },
  {
    category: "Products",
    question: "Do I need to integrate all products at once?",
    answer: "No, you can start with one product and add more as needed. Each product has its own set of endpoints and can be integrated independently."
  },
  // Billing & Pricing
  {
    category: "Billing & Pricing",
    question: "How does pricing work?",
    answer: "We offer usage-based pricing with monthly subscription tiers. Each product has its own pricing model - some charge per transaction, others per API call. Volume discounts are available for high-volume partners."
  },
  {
    category: "Billing & Pricing",
    question: "When am I billed?",
    answer: "We invoice monthly on the 1st of each month for the previous month's usage. Payment is due within 30 days. Enterprise customers can negotiate custom billing terms."
  },
  {
    category: "Billing & Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), ACH bank transfers, and wire transfers for Enterprise customers."
  },
  // Security
  {
    category: "Security & Compliance",
    question: "Is Paylaterr PCI compliant?",
    answer: "Yes, Paylaterr is PCI DSS Level 1 certified. We handle all sensitive payment data, so your integration doesn't need to worry about PCI compliance for data that flows through our API."
  },
  {
    category: "Security & Compliance",
    question: "How do you protect API keys?",
    answer: "API keys are encrypted at rest and in transit. We recommend using environment variables, never committing keys to version control, and rotating keys regularly. You can revoke and regenerate keys instantly from the dashboard."
  },
  {
    category: "Security & Compliance",
    question: "What certifications do you have?",
    answer: "We maintain SOC 2 Type II, PCI DSS Level 1, and ISO 27001 certifications. We also comply with GDPR, CCPA, and other regional data protection regulations."
  },
];

const categories = [...new Set(faqData.map(item => item.category))];

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenItems(newOpen);
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = search === "" || 
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions about the Paylaterr platform
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search questions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <Card className="p-4 bg-card border-border sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !activeCategory ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      All Questions
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          activeCategory === category ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>

              {/* FAQ List */}
              <div className="flex-1">
                <div className="space-y-4">
                  {filteredFAQ.map((item, index) => (
                    <Card 
                      key={index} 
                      className="bg-card border-border overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full p-5 flex items-start justify-between text-left"
                      >
                        <div className="flex-1 pr-4">
                          <span className="text-xs text-primary font-medium mb-1 block">{item.category}</span>
                          <h3 className="font-semibold text-foreground">{item.question}</h3>
                        </div>
                        {openItems.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {openItems.has(index) && (
                        <div className="px-5 pb-5">
                          <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </Card>
                  ))}

                  {filteredFAQ.length === 0 && (
                    <Card className="p-8 bg-card border-border text-center">
                      <p className="text-muted-foreground mb-4">No questions found matching your search.</p>
                      <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory(null); }}>
                        Clear Filters
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-card">
          <div className="container mx-auto px-6 text-center">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/company/contact">Contact Us</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/dashboard/help">
                  Visit Help Center
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQ;
