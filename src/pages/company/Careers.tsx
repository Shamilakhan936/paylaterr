import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const openings = [
  { title: "Senior Backend Engineer", team: "Engineering", location: "San Francisco / Remote", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "New York / Remote", type: "Full-time" },
  { title: "DevOps Engineer", team: "Infrastructure", location: "Remote", type: "Full-time" },
  { title: "Account Executive", team: "Sales", location: "London", type: "Full-time" },
  { title: "Machine Learning Engineer", team: "Risk", location: "San Francisco", type: "Full-time" },
  { title: "Technical Writer", team: "Developer Experience", location: "Remote", type: "Full-time" },
];

const benefits = [
  "Competitive salary & equity",
  "Unlimited PTO",
  "Health, dental & vision",
  "401(k) matching",
  "Remote-first culture",
  "Learning & development budget",
  "Home office stipend",
  "Annual team retreats",
];

const Careers = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-24 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Help us build the future of flexible payments. We're hiring across 
              engineering, design, sales, and more.
            </p>
            <Button variant="hero" size="lg">View Open Roles</Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Paylaterr?</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <Card 
                  key={index} 
                  className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.team}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-3 py-1 bg-secondary rounded text-muted-foreground">
                        {job.type}
                      </span>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Careers;
