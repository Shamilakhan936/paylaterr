import { PageLayout } from "@/components/layout";

const Privacy = () => {
  return (
    <PageLayout>
      <div className="min-h-screen py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">1. Information We Collect</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
                <li>Account information (name, email, company)</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Transaction data related to your use of our API</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">2. How We Use Your Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
                <li>Process transactions and send related information</li>
                <li>Provide customer support</li>
                <li>Send technical notices and security alerts</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">3. Data Security</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                We implement industry-standard security measures to protect your data. All data is encrypted 
                in transit and at rest. We are SOC 2 Type II certified and undergo regular security audits.
              </p>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">4. Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at privacy@raillayer.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
