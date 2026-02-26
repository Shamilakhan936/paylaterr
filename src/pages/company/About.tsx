import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Globe, Zap, Heart } from "lucide-react";

const stats = [
  { value: "2019", label: "Founded" },
  { value: "250+", label: "Employees" },
  { value: "$1B+", label: "Processed" },
  { value: "40+", label: "Countries" },
];

const values = [
  { icon: Users, title: "Customer First", description: "We obsess over our customers' success and build for their needs." },
  { icon: Globe, title: "Think Global", description: "We build products that work seamlessly across borders and currencies." },
  { icon: Zap, title: "Move Fast", description: "We ship quickly, iterate constantly, and learn from everything." },
  { icon: Heart, title: "Stay Human", description: "We care deeply about our team, customers, and community." },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-founder", bio: "Former VP at Stripe" },
  { name: "Marcus Johnson", role: "CTO & Co-founder", bio: "Ex-Google, Stanford CS" },
  { name: "Emily Rodriguez", role: "VP Engineering", bio: "Previously at Plaid" },
  { name: "David Kim", role: "VP Product", bio: "Former PM at Square" },
];

const About = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div
            className=""
          />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Making flexible payments{" "}
                <br className="hidden sm:block" />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #2DD4BF 0%, #C27AFF 100%)",
                  }}
                >
                  accessible to everyone
                </span>
              </h1>
              <p className="text-xl text-[#99A1AF] mb-8">
                We're building the financial infrastructure that powers the next
                generation of Buy Now, Pay Later experiences.
              </p>
              <Button
                size="lg"
                className="bg-[#2DD4BF] text-black font-bold hover:bg-[#2DD4BF]/90 "
              >
                Join Our Team
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          className="py-16"
          style={{ borderTop: "1px solid #1E2939", borderBottom: "1px solid #1E2939" }}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8  mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="md:text-5xl text-4xl font-bold text-[#2DD4BF]">
                    {stat.value}
                  </p>
                  <p className="text-[#99A1AF] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-[#99A1AF] mb-6">
                Paylaterr was founded in 2019 with a simple mission: make it easy for businesses 
                to offer flexible payment options to their customers. We saw how fragmented and 
                complex the BNPL space had become, and we knew there had to be a better way.
              </p>
              <p className="text-lg text-[#99A1AF]">
                Today, we power payment plans for thousands of businesses worldwide, processing 
                over $1 billion in transactions annually. Our API-first approach means developers 
                can integrate in hours, not weeks.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="p-8 bg-[#151A21] border-[#1E2939]">
                  <div className="w-12 h-12 rounded-lg bg-[#1A2E28] flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="md:text-xl text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-[#99A1AF] text-sm">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20">
          <div className="container mx-auto md:px-10 px-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Leadership</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8  mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="p-6 md:p-8 bg-[#151A21] border-[#1E2939] text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4" />
                  <p className="font-bold text-lg text-white">{member.name}</p>
                  <p className="text-sm text-[#2DD4BF] font-bold">{member.role}</p>
                  <p className="text-sm text-[#99A1AF] mt-3">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default About;
