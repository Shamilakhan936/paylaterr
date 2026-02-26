import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[foreground] mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-[#99A1AF] max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-10">
            <div className="grid lg:grid-cols-2 gap-24  mx-auto">
              {/* Contact Form */}
              <Card className="p-8 bg-[#151A21] border-[#1E2939]">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#99A1AF] mb-2 block">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm text-[#99A1AF] mb-2 block">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#99A1AF] mb-2 block">Email</label>
                    <Input type="email" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="text-sm text-[#99A1AF] mb-2 block">Company</label>
                    <Input placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="text-sm text-[#99A1AF] mb-2 block">Message</label>
                    <Textarea placeholder="How can we help?" rows={4} />
                  </div>
                  <Button variant="" className="w-full bg-[#2DD4BF] hover:bg-black hover:text-white" size="lg">
                    Send Message
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Get in touch</h2>
                  <p className="text-[#99A1AF] mb-8">
                    Our team is here to help. Reach out and we'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#151A21] border-[#1E2939] border flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-[#99A1AF] text-sm">hello@paylaterr.com</p>
                      <p className="text-[#99A1AF] text-sm">support@paylaterr.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#151A21] border-[#1E2939] border flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-[#99A1AF] text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#151A21] border-[#1E2939] border flex flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Office</h3>
                      <p className="text-[#99A1AF] text-sm">
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
};

export default Contact;
