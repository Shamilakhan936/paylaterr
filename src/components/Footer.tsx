import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Products: [
    { label: "BNPL for Bills", href: "/dashboard/products#bnpl-bills" },
    { label: "Spendnest", href: "/dashboard/products#spendnest" },
    { label: "EarlyPay", href: "/dashboard/products#earlypay" },
    { label: "Bill Rewards", href: "/dashboard/products#bill-rewards" },
    { label: "LateFees", href: "/dashboard/products#latefees" },
    { label: "AutoFloat", href: "/dashboard/products#autofloat" },
    { label: "Paylaterr Travel", href: "/dashboard/products#travel" },
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

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Paylaterr</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The financial infrastructure for Buy Now, Pay Later.
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

          {/* Links */}
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

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Paylaterr, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
