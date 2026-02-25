const companies = [
  { name: "Shopify", width: "120px" },
  { name: "Stripe", width: "90px" },
  { name: "Square", width: "100px" },
  { name: "Affirm", width: "90px" },
  { name: "Klarna", width: "100px" },
  { name: "Afterpay", width: "110px" },
];

const TrustedBy = () => {
  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-wider">
          Trusted by leading companies worldwide
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {companies.map((company) => (
            <div
              key={company.name}
              className="opacity-40 hover:opacity-70 transition-opacity duration-300"
              style={{ width: company.width }}
            >
              <div className="h-8 flex items-center justify-center">
                <span className="text-xl font-semibold text-foreground tracking-tight">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
