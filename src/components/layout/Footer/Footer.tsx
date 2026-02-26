import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Products: [
    { label: "Payment Plans", href: "/dashboard/payment-plans" },
    { label: "Account Linking", href: "/dashboard/account-linking" },
    { label: "Risk Engine", href: "/dashboard/risk-engine" },
    { label: "Analytics", href: "/dashboard/analytics" },
    { label: "Webhooks", href: "/dashboard/webhooks" },
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
  return (
    <footer className="py-16" style={{ borderTop: "1px solid #1E2939" }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Paylaterr</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The financial infrastructure for Buy Now, Pay Later. Build seamless payment flows in
              minutes.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid #1E2939" }}
        >
          <p className="text-sm text-muted-foreground">
            © 2024 Paylaterr, Inc. All rights reserved.
          </p>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
