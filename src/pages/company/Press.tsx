import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Calendar } from "lucide-react";

const releases = [
  {
    title: "Paylaterr Raises $150M Series C",
    date: "January 15, 2024",
    excerpt: "Funding round led by Andreessen Horowitz to accelerate global expansion.",
  },
  {
    title: "Paylaterr Expands to 15 New Markets",
    date: "December 10, 2023",
    excerpt: "Now available in 40+ countries with support for 100+ currencies.",
  },
  {
    title: "Partnership with Major E-commerce Platform",
    date: "November 5, 2023",
    excerpt: "Strategic partnership to bring BNPL to millions of merchants.",
  },
  {
    title: "Paylaterr Named to Forbes Fintech 50",
    date: "October 20, 2023",
    excerpt: "Recognized as one of the most innovative fintech companies of 2023.",
  },
];

const Press = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-mesh">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Latest news and announcements from Paylaterr
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Press Kit
            </Button>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">Press Releases</h2>
            <div className="space-y-4">
              {releases.map((release, index) => (
                <Card 
                  key={index} 
                  className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{release.title}</h3>
                  <p className="text-muted-foreground">{release.excerpt}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Media Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              For press inquiries, please contact our media relations team.
            </p>
            <a href="mailto:press@paylaterr.com" className="text-primary hover:underline">
              press@paylaterr.com
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Press;
