import { PageLayout, PageHero } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Quote,
  TrendingUp,
  Users,
  Clock,
  DollarSign
} from "lucide-react";

const caseStudies = [
  {
    id: "fintech-lender",
    company: "NeoBank Finance",
    logo: "NB",
    industry: "Digital Banking",
    product: "BNPL Bills + SpendNest",
    title: "How NeoBank Finance increased customer retention by 45%",
    summary: "By integrating Rail Layer's BNPL Bills and SpendNest APIs, NeoBank Finance transformed their mobile banking app into a comprehensive financial wellness platform.",
    challenge: "NeoBank Finance was losing customers to competitors offering more flexible payment options. Their churn rate was 8% monthly, significantly above industry average.",
    solution: "Integrated BNPL Bills to allow customers to split utility and rent payments. Combined with SpendNest for real-time spending insights and budgeting recommendations.",
    results: [
      { metric: "45%", label: "Reduction in churn" },
      { metric: "3.2x", label: "Increase in app engagement" },
      { metric: "$2.4M", label: "Additional revenue" },
      { metric: "4 weeks", label: "Time to launch" },
    ],
    quote: {
      text: "Rail Layer's APIs were incredibly easy to integrate. Within a month, we had a fully functional BNPL solution that our customers love.",
      author: "Sarah Chen",
      role: "CTO, NeoBank Finance"
    },
    color: "bg-primary"
  },
  {
    id: "property-management",
    company: "RentFlow",
    logo: "RF",
    industry: "Property Management",
    product: "BNPL Bills + LateFees Protection",
    title: "RentFlow reduced late payments by 67% with flexible rent options",
    summary: "RentFlow, a property management platform serving 50,000+ units, used Rail Layer to offer tenants flexible rent payment options while protecting landlords from late fees.",
    challenge: "25% of tenants were paying rent late each month, causing cash flow issues for property owners and straining tenant relationships.",
    solution: "Implemented BNPL Bills for rent installments and LateFees Protection to automatically remind tenants and prevent late payments.",
    results: [
      { metric: "67%", label: "Fewer late payments" },
      { metric: "92%", label: "Tenant satisfaction" },
      { metric: "$180K", label: "Late fees avoided" },
      { metric: "15K+", label: "Active payment plans" },
    ],
    quote: {
      text: "Our landlords are happier with consistent cash flow, and tenants appreciate the flexibility. It's a win-win powered by Rail Layer.",
      author: "Michael Torres",
      role: "CEO, RentFlow"
    },
    color: "bg-accent"
  },
  {
    id: "hr-platform",
    company: "WorkForce Plus",
    logo: "WF",
    industry: "HR Technology",
    product: "EarlyPay",
    title: "WorkForce Plus boosted employee retention by offering earned wage access",
    summary: "WorkForce Plus, an HR platform for mid-size companies, integrated EarlyPay to help their clients offer earned wage access as a benefit, improving employee satisfaction and retention.",
    challenge: "Client companies were struggling with high turnover rates (35% annually) and employees frequently requested payroll advances, creating administrative burden.",
    solution: "Integrated EarlyPay API to allow employees to access earned wages on-demand through the existing WorkForce Plus mobile app.",
    results: [
      { metric: "28%", label: "Lower turnover" },
      { metric: "89%", label: "Employee adoption" },
      { metric: "40hrs", label: "Admin time saved/month" },
      { metric: "$0", label: "Cost to employers" },
    ],
    quote: {
      text: "EarlyPay integration took just 2 weeks. Our clients now have a powerful benefit that costs them nothing but dramatically improves employee satisfaction.",
      author: "Jennifer Walsh",
      role: "VP Product, WorkForce Plus"
    },
    color: "bg-primary"
  },
  {
    id: "travel-platform",
    company: "TripMaster",
    logo: "TM",
    industry: "Travel",
    product: "Rail Layer Travel",
    title: "TripMaster increased bookings by 52% with flexible travel financing",
    summary: "TripMaster, an online travel agency, integrated Rail Layer Travel to offer customers the ability to book now and pay over time, dramatically increasing conversion rates.",
    challenge: "Cart abandonment was 73% at checkout, primarily due to high upfront costs for vacation packages. Average booking value was declining.",
    solution: "Added Rail Layer Travel financing option at checkout, allowing customers to split travel costs into 6-24 monthly payments with 0% APR.",
    results: [
      { metric: "52%", label: "More bookings" },
      { metric: "35%", label: "Higher avg. order" },
      { metric: "-41%", label: "Cart abandonment" },
      { metric: "$8M", label: "Financed in Year 1" },
    ],
    quote: {
      text: "Adding Rail Layer Travel was the single biggest conversion improvement we've made. Customers book bigger trips because they can spread the cost.",
      author: "David Park",
      role: "Head of Product, TripMaster"
    },
    color: "bg-accent"
  },
];

const CaseStudies = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero
          title="Case Studies"
          leading={<Badge className="mb-4">Success Stories</Badge>}
        >
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            See how companies are using Rail Layer to transform their businesses
          </p>
        </PageHero>

        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-foreground">500+</span>
                </div>
                <p className="text-muted-foreground">Enterprise Partners</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-foreground">10M+</span>
                </div>
                <p className="text-muted-foreground">End Users Served</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-foreground">$2B+</span>
                </div>
                <p className="text-muted-foreground">Transactions Processed</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-foreground">99.9%</span>
                </div>
                <p className="text-muted-foreground">API Uptime</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="space-y-12">
              {caseStudies.map((study, index) => (
                <Card 
                  key={study.id} 
                  className="bg-card border-border overflow-hidden"
                >
                  <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <div className="p-8 lg:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-lg ${study.color} flex items-center justify-center`}>
                          <span className="text-primary-foreground font-bold">{study.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{study.company}</h3>
                          <p className="text-sm text-muted-foreground">{study.industry}</p>
                        </div>
                      </div>

                      <Badge variant="secondary" className="mb-4">{study.product}</Badge>
                      
                      <h2 className="text-2xl font-bold text-foreground mb-4">{study.title}</h2>
                      <p className="text-muted-foreground mb-6">{study.summary}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {study.results.map((result, i) => (
                          <div key={i} className="text-center p-3 bg-secondary rounded-lg">
                            <p className="text-xl font-bold text-primary">{result.metric}</p>
                            <p className="text-xs text-muted-foreground">{result.label}</p>
                          </div>
                        ))}
                      </div>

                      <Button variant="hero">
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className={`${study.color}/10 p-8 lg:p-10 flex flex-col justify-center`}>
                      <Quote className={`w-10 h-10 ${study.color === 'bg-primary' ? 'text-primary' : 'text-accent'} mb-4`} />
                      <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                        "{study.quote.text}"
                      </blockquote>
                      <div>
                        <p className="font-semibold text-foreground">{study.quote.author}</p>
                        <p className="text-sm text-muted-foreground">{study.quote.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-card">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to write your success story?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join hundreds of companies using Rail Layer to transform their payment experiences
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/company/contact">Talk to Sales</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/partner-signup">
                  Get Started Free
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

export default CaseStudies;
