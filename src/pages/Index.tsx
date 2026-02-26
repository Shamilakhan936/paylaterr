import { Header, Footer } from "@/components/layout";
import { Hero, TrustedBy, Features, CodePreview, CTA } from "@/components/landing";

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
