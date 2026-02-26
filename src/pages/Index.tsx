import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Features } from "@/components/landing/Features";
import { CodePreview } from "@/components/landing/CodePreview";
import { CTA } from "@/components/landing/CTA";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <CodePreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
