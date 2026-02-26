import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div
          className="max-w-5xl mx-auto rounded-2xl p-12 md:p-16 text-center"
          style={{
            backgroundColor: "#151A21",
            border: "1px solid #1E2939",
          }}
        >
          <h2 className="text-4xl md:text-5xl max-w-2xl mx-auto font-bold mb-6 text-white">
            Ready to transform your{" "}
            <span className="text-[#2DD4BF]">payment experience?</span>
          </h2>
          <p className="text-[#99A1AF] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of businesses using Paylaterr to offer flexible payment solutions to
            their customers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="xl"
              asChild
              className="bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 border-0"
            >
              <Link to="/partner-signup">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="bg-transparent border border-[#364153] text-white hover:bg-white/10"
              style={{ borderColor: "#1E2939" }}
            >
              <Link to="/company/contact">Talk to Sales</Link>
            </Button>
          </div>

          <p className="text-sm text-[#6A7282] mt-8">
            No credit card required • Free sandbox environment • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}
