import { PageLayout, PageHero } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Calendar } from "lucide-react";

const releases = [
  // {
  //   title: "Rail Layer Raises $150M Series C",
  //   date: "January 15, 2024",
  //   excerpt: "Funding round led by Andreessen Horowitz to accelerate global expansion.",
  // },
  {
    title: "Rail Layer Expands to 15 New Markets",
    date: "December 10, 2023",
    excerpt: "Now available in 40+ countries with support for 100+ currencies.",
  },
  {
    title: "Partnership with Major E-commerce Platform",
    date: "November 5, 2023",
    excerpt: "Strategic partnership to bring BNPL to millions of merchants.",
  },
  // {
  //   title: "Rail Layer Named to Forbes Fintech 50",
  //   date: "October 20, 2023",
  //   excerpt: "Recognized as one of the most innovative fintech companies of 2023.",
  // },
];

export default function Press() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="Press & Media">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            Latest news and announcements from Rail Layer
          </p>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download Press Kit
          </Button>
        </PageHero>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">Press Releases</h2>
            <div className="space-y-3 sm:space-y-4">
              {releases.map((release, index) => (
                <Card
                  key={index}
                  className="p-4 sm:p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    {release.date}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">{release.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{release.excerpt}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Media Inquiries</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              For press inquiries, please contact our media relations team.
            </p>
            <a href="mailto:press@paylaterr.com" className="text-primary hover:underline text-sm sm:text-base">
              press@raillayer.com
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
