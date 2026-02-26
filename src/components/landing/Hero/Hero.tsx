import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient background: teal 10% left-center, purple 20% right-center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, #2DD4BF1A 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 70% 50%, #59168B33 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl leading-[79px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            The financial infrastructure for{" "}
            <span className="text-[#2DD4BF]">Bill Now,</span>{" "}
            <span className="text-[#C27AFF]">Pay Later</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Build seamless payment experiences with our API. Connect bank accounts, verify income, and
            enable flexible payment plans in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/partner-signup">
                Start Building
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/developers/quickstart">
                <Play size={20} className="mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>

          <div
            className="grid grid-cols-3 border-t border-white/10 pt-8 gap-8 max-w-xl mx-auto mt-16 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "50ms", label: "Avg Response" },
              { value: "10M+", label: "API Calls/Day" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-[#6A7282] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
