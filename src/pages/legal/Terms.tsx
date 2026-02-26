import { PageLayout } from "@/components/layout/PageLayout";

const Terms = () => {
  return (
    <PageLayout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Paylaterr's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use of Services</h2>
              <p className="text-muted-foreground mb-4">
                You may use our services only in compliance with these Terms and all applicable laws. 
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use our services for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Resell our services without authorization</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. API Usage</h2>
              <p className="text-muted-foreground">
                Access to our API is subject to rate limits and usage quotas as defined in your service plan. 
                We reserve the right to throttle or suspend access for excessive usage or abuse.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground">
                Fees are charged based on your selected plan and usage. All fees are non-refundable unless 
                otherwise specified. We may change our pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms should be sent to legal@paylaterr.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
