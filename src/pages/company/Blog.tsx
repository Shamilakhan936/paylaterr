import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    title: "Introducing Risk Engine v2: ML-Powered Underwriting",
    excerpt: "Our new machine learning models reduce default rates by 40% while approving more customers.",
    category: "Product",
    date: "January 28, 2024",
    readTime: "5 min read",
  },
  {
    title: "How We Scaled to $1B in Annual Transaction Volume",
    excerpt: "The technical challenges and solutions behind processing billions in payments.",
    category: "Engineering",
    date: "January 20, 2024",
    readTime: "8 min read",
  },
  {
    title: "The Future of Buy Now, Pay Later",
    excerpt: "Our predictions for how BNPL will evolve in 2024 and beyond.",
    category: "Industry",
    date: "January 15, 2024",
    readTime: "6 min read",
  },
  {
    title: "Building a Culture of Security",
    excerpt: "How we've made security a core part of our engineering culture at Paylaterr.",
    category: "Security",
    date: "January 10, 2024",
    readTime: "4 min read",
  },
  {
    title: "Expanding to 15 New Markets",
    excerpt: "Paylaterr is now available in 40+ countries with support for 100+ currencies.",
    category: "Company",
    date: "January 5, 2024",
    readTime: "3 min read",
  },
];

const Blog = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-xl text-[#99A1AF] max-w-2xl mx-auto">
              Insights on payments, engineering, and building at scale
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Card
                  key={index}
                  className="p-6 bg-[#151A21] border border-[#1E2939] rounded-xl hover:border-primary/50 transition-colors cursor-pointer group relative"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-3 py-1 bg-[#1A2E28] text-[#2DD4BF] rounded-[4px] uppercase tracking-wide">
                        {post.category}
                      </span>
                      <span className="text-sm text-[#6A7282] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        {post.date}
                      </span>
                    </div>
                    <span className="text-sm text-[#6A7282]">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#2DD4BF] transition-colors mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center justify-between gap-4">
                  <p className="text-sm md:mt-3 text-[#99A1AF] mb-6">{post.excerpt}</p>
                    <ArrowRight className="w-5 h-5 text-[#A0AEC0] group-hover:text-[#2DD4BF] transition-colors" />
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

export default Blog;
