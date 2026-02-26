import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        { label: "Paylaterr Travel", href: "/dashboard/products#travel" },
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-[#0B0E11]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Paylaterr</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button className="flex items-center gap-1 text-sm text-[#D1D5DC] hover:text-foreground transition-colors py-2">
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm text-[#D1D5DC] hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="default" size="sm">
              Get API Keys
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="space-y-2">
                    <span className="text-foreground font-medium">{link.label}</span>
                    <div className="pl-4 space-y-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Button variant="default" className="w-full">
                Get API Keys
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
