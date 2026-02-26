import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" aria-hidden />
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="relative z-10 px-4 py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="text-4xl font-black tabular-nums tracking-tighter">404</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm text-muted-foreground sm:text-base">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="hero" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto" type="button" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
