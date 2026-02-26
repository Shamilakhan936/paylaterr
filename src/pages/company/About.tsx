import { PageLayout, PageHero } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Globe, Zap, Heart } from "lucide-react";

const stats = [
  { value: "2023", label: "Founded" },
  { value: "250+", label: "Employees" },
  { value: "40+", label: "Countries" },
];

const values = [
  { icon: Users, title: "Customer First", description: "We obsess over our customers' success and build for their needs." },
  { icon: Globe, title: "Think Global", description: "We build products that work seamlessly across borders and currencies." },
  { icon: Zap, title: "Move Fast", description: "We ship quickly, iterate constantly, and learn from everything." },
  { icon: Heart, title: "Stay Human", description: "We care deeply about our team, customers, and community." },
];

const team = [
  { name: "Akeem Egbeyemi", role: "CEO & Co-founder", bio: "Ex-Amazon", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akeem" },
  { name: "Rose Russell", role: "CTO & Co-founder", bio: "Ex-Sketcher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rose" },
  { name: "Muhammed Sheik", role: "VP Engineering", bio: "Ex-Microsoft", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Muhammed" },
  { name: "David Kim", role: "VP Product", bio: "Former PM at Square", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
];

export default function About() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero
          title="Making flexible payments accessible to everyone"
          variant="left"
          sectionClassName="py-16 sm:py-24 bg-gradient-mesh"
          contentClassName="max-w-3xl"
        >
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
            We're building the financial infrastructure that powers the next generation
            of Buy Now, Pay Later experiences.
          </p>
          <Button variant="hero" size="lg">Join Our Team</Button>
        </PageHero>

        <section className="py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Our Story</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                Rail Layer was founded in 2023 with a simple mission: make it easy for businesses
                to offer flexible payment options to their customers. We saw how fragmented and
                complex the BNPL space had become, and we knew there had to be a better way.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                Today, we power payment plans for thousands of businesses worldwide, processing
                over $1 billion in transactions annually. Our API-first approach means developers
                can integrate in hours, not weeks.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value) => (
                <Card key={value.title} className="p-4 sm:p-6 bg-card border-border">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">Leadership</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="p-4 sm:p-6 bg-card border-border text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 sm:mb-4 border-2 border-border"
                  />
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{member.name}</h3>
                  <p className="text-xs sm:text-sm text-primary">{member.role}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
