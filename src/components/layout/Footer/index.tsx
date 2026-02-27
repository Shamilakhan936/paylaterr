import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import raillayerLogo from "@/assets/raillayer-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const footerLinks = {
  Products: [
    { label: "BNPL for Bills", href: "/dashboard/products#bnpl-bills" },
    { label: "Spendnest", href: "/dashboard/products#spendnest" },
    { label: "EarlyPay", href: "/dashboard/products#earlypay" },
    { label: "Bill Rewards", href: "/dashboard/products#bill-rewards" },
    { label: "LateFees", href: "/dashboard/products#latefees" },
    { label: "AutoFloat", href: "/dashboard/products#autofloat" },
  ],
  "More Products": [
    { label: "Rail Layer Travel", href: "/dashboard/products#travel" },
    { label: "Decision Engine", href: "/dashboard/products#decision-engine" },
    { label: "KYC", href: "/dashboard/products#kyc" },
    { label: "Device Intelligence", href: "/dashboard/products#device-intelligence" },
    { label: "Payment Gateway", href: "/dashboard/products#payment-gateway" },
    { label: "Payment Processing", href: "/dashboard/products#payment-processing" },
  ],
  Developers: [
    { label: "Documentation", href: "/developers/api-reference" },
    { label: "API Reference", href: "/developers/api-reference" },
    { label: "SDKs", href: "/developers/sdks" },
    { label: "Changelog", href: "/developers/changelog" },
    { label: "Status", href: "/developers/status" },
  ],
  Company: [
    { label: "About", href: "/company/about" },
    { label: "Blog", href: "/company/blog" },
    { label: "Careers", href: "/company/careers" },
    { label: "Press", href: "/company/press" },
    { label: "Contact", href: "/company/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Security", href: "/legal/security" },
    { label: "Compliance", href: "/legal/compliance" },
  ],
};

export function Footer() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <footer className="border-t border-border py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-2 sm:col-span-3 md:col-span-1 order-first">
            <Link to="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <img src={raillayerLogo} alt="Rail Layer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shrink-0" />
              <span className="text-lg sm:text-xl font-semibold text-gradient">Rail Layer</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 max-w-xs">
              The financial infrastructure for Buy Now, Pay Later.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 touch-manipulation" aria-label="Twitter">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 touch-manipulation" aria-label="GitHub">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 touch-manipulation" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-4">{category}</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {links.map((link) => {
                  const target =
                    !isAuthenticated && link.href.startsWith("/dashboard")
                      ? "/partner-signup"
                      : link.href;

                  return (
                    <li key={link.label}>
                      <Link
                        to={target}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 block touch-manipulation"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground order-last sm:order-first">
            © 2024 Rail Layer, Inc. All rights reserved.
          </p>
       
        </div>
      </div>
    </footer>
  );
}
