import type { ReactNode } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function PageLayout({ children, showFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
