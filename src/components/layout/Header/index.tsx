import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import raillayerLogo from "@/assets/raillayer-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  {
    label: "Products",
    href: "#",
    children: [
      { label: "BNPL for Bills", href: "/dashboard/products#bnpl-bills" },
      { label: "Spendnest", href: "/dashboard/products#spendnest" },
      { label: "EarlyPay", href: "/dashboard/products#earlypay" },
      { label: "Bill Rewards", href: "/dashboard/products#bill-rewards" },
      { label: "LateFees", href: "/dashboard/products#latefees" },
      { label: "AutoFloat", href: "/dashboard/products#autofloat" },
      { label: "Rail Layer Travel", href: "/dashboard/products#travel" },
      { label: "Decision Engine", href: "/dashboard/products#decision-engine" },
      { label: "KYC", href: "/dashboard/products#kyc" },
      { label: "Device Intelligence", href: "/dashboard/products#device-intelligence" },
      { label: "Payment Gateway", href: "/dashboard/products#payment-gateway" },
      { label: "Payment Processing", href: "/dashboard/products#payment-processing" },
    ],
  },
  {
    label: "Developers",
    href: "#",
    children: [
      { label: "API Reference", href: "/developers/api-reference" },
      { label: "SDKs", href: "/developers/sdks" },
      { label: "Changelog", href: "/developers/changelog" },
      { label: "Status", href: "/developers/status" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Company",
    href: "#",
    children: [
      { label: "About", href: "/company/about" },
      { label: "Blog", href: "/company/blog" },
      { label: "Careers", href: "/company/careers" },
      { label: "Press", href: "/company/press" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 min-h-0">
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-shrink">
            <img src={raillayerLogo} alt="Rail Layer" className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg flex-shrink-0" />
            <span className="text-base sm:text-xl font-semibold text-gradient truncate hidden sm:inline">Rail Layer</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                        {link.children.map((child) => {
                          const target =
                            child.href.startsWith("/dashboard") && !isAuthenticated
                              ? "/partner-signup"
                              : child.href;
                          return (
                            <Link
                              key={child.label}
                              to={target}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link to="/partner-signup">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Button variant="default" size="sm" asChild>
              <Link to={isAuthenticated ? "/dashboard/api-keys" : "/partner-signup"}>Get API Keys</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/partner-signup">Get Started</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="lg:hidden p-2.5 -mr-2 text-foreground touch-manipulation flex-shrink-0 rounded-lg hover:bg-secondary/50"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setOpenDropdown(null);
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="container mx-auto px-4 sm:px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3 text-left text-foreground font-medium hover:text-primary transition-colors touch-manipulation"
                      onClick={() => toggleDropdown(link.label)}
                      aria-expanded={openDropdown === link.label}
                    >
                      {link.label}
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${openDropdown === link.label ? "rotate-90" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        openDropdown === link.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pl-3 pb-2 space-y-1 border-l border-border ml-1.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block py-2 pl-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className="block py-3 text-foreground font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 mt-2 border-t border-border space-y-2">
              <Link to="/partner-signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-center sm:justify-start" size="sm">
                  Sign In
                </Button>
              </Link>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link
                  to={isAuthenticated ? "/dashboard/api-keys" : "/partner-signup"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get API Keys
                </Link>
              </Button>
              <Button variant="default" className="w-full" size="sm" asChild>
                <Link to="/partner-signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
