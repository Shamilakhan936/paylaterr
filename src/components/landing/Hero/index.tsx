import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedLines } from "../AnimatedLines";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30">
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <AnimatedLines />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto py-12 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            The financial infrastructure for{" "}
            <span className="text-gradient">Buy Now, Pay Later</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Build seamless payment experiences with our API. Connect bank accounts, verify income, and enable flexible payment plans in minutes.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/partner-signup">
                Start Building
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/company/contact">
                <MessageSquare size={20} className="mr-2" />
                Talk to Sales
              </Link>
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto mt-12 sm:mt-16 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "50ms", label: "Avg Response" },
              { value: "10M+", label: "API Calls/Day" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
