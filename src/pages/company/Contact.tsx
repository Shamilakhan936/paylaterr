import { PageLayout, PageHero } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <PageLayout>
      <div className="min-h-screen">
        <PageHero title="Contact Us">
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </PageHero>

        <section className="py-12 sm:py-16 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
              <Card className="p-5 sm:p-6 lg:p-8 bg-card border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Send us a message</h2>
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 sm:mb-2 block">First Name</label>
                      <Input placeholder="John" className="h-10 sm:h-10" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 sm:mb-2 block">Last Name</label>
                      <Input placeholder="Doe" className="h-10 sm:h-10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 sm:mb-2 block">Email</label>
                    <Input type="email" placeholder="john@company.com" className="h-10 sm:h-10" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 sm:mb-2 block">Company</label>
                    <Input placeholder="Your company name" className="h-10 sm:h-10" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 sm:mb-2 block">Message</label>
                    <Textarea placeholder="How can we help?" rows={4} className="min-h-[100px] sm:min-h-[120px]" />
                  </div>
                  <Button variant="hero" className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </Card>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Get in touch</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                    Our team is here to help. Reach out and we'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">Email</h3>
                      <p className="text-sm text-muted-foreground">hello@raillayer.com</p>
                      <p className="text-sm text-muted-foreground">support@raillayer.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">Phone</h3>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">Office</h3>
                      <p className="text-sm text-muted-foreground">
                        548 Market Street, Suite 12345<br />
                        San Francisco, CA 94104
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
