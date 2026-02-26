import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-16 sm:py-24 max-sm:pt-0 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto py-12 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to transform your{" "}
            <span className="text-gradient">payment experience?</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of businesses using Rail Layer to offer flexible payment solutions to their customers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/partner-signup">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/company/contact">Talk to Sales</Link>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
            No credit card required • Free sandbox environment • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}
