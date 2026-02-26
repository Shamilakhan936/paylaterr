import { useState } from "react";
import { Link } from "react-router-dom";
import raillayerLogo from "@/assets/raillayer-logo.png";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowRight, 
  Check, 
  Building2, 
  User, 
  Code2, 
  Shield,
  Zap,
  Clock,
  Key
} from "lucide-react";

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Contact Details", icon: User },
  { id: 3, title: "Integration", icon: Code2 },
  { id: 4, title: "Review", icon: Shield },
];

const products = [
  { id: "bnpl-bills", name: "BNPL Bills" },
  { id: "spendnest", name: "SpendNest" },
  { id: "earlypay", name: "EarlyPay" },
  { id: "rewards", name: "Bill Rewards" },
  { id: "latefees", name: "LateFees Protection" },
  { id: "autofloat", name: "AutoFloat" },
  { id: "travel", name: "Rail Layer Travel" },
];

const PartnerSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    selectedProducts: [] as string[],
    useCase: '',
    expectedVolume: '',
    timeline: '',
    agreeTerms: false,
    agreePrivacy: false,
  });

  const updateFormData = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (productId: string) => {
    const newProducts = formData.selectedProducts.includes(productId)
      ? formData.selectedProducts.filter(p => p !== productId)
      : [...formData.selectedProducts, productId];
    updateFormData('selectedProducts', newProducts);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <Card className="max-w-lg w-full p-5 sm:p-8 bg-card border-border text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Application Submitted!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Thank you for your interest in becoming a Rail Layer partner. We'll review your application and get back to you within 1-2 business days.
          </p>
          
          <div className="bg-secondary p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-left">
            <h3 className="font-medium text-foreground text-sm sm:text-base mb-2 sm:mb-3">What happens next?</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pt-0.5">Our team reviews your application</p>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pt-0.5">You'll receive sandbox API keys via email</p>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pt-0.5">Start integrating with our sandbox environment</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="flex-1 text-sm sm:text-base min-h-10" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="hero" className="flex-1 text-sm sm:text-base min-h-10" asChild>
              <Link to="/developers/api-reference">View API Docs</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={raillayerLogo} alt="Rail Layer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0" />
            <span className="text-base sm:text-lg font-semibold text-foreground">Rail Layer</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">Become a Partner</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get access to our enterprise APIs and start building with Rail Layer
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">Instant sandbox access</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">1-2 day approval</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">Free API testing</span>
            </div>
          </div>
          <div className="flex items-center w-full mb-6 sm:mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0 last:flex-none">
                <div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${
                  step.id === currentStep 
                    ? 'text-primary' 
                    : step.id < currentStep 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.id === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step.id < currentStep 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium truncate">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 min-w-2 sm:min-w-4 h-0.5 mx-1 sm:mx-2 ${
                    step.id < currentStep ? 'bg-primary' : 'bg-border'
                  }`} aria-hidden />
                )}
              </div>
            ))}
          </div>
          <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border">
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-0.5 sm:mb-1">Company Information</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tell us about your organization</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="companyName" className="text-sm">Company Name *</Label>
                    <Input 
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      placeholder="Acme Inc."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="website" className="text-sm">Company Website *</Label>
                    <Input 
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Industry *</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => updateFormData('industry', value)}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Company Size *</Label>
                    <Select 
                      value={formData.companySize} 
                      onValueChange={(value) => updateFormData('companySize', value)}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-0.5 sm:mb-1">Contact Details</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Who should we contact about your integration?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="firstName" className="text-sm">First Name *</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="John"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lastName" className="text-sm">Last Name *</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm">Work Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@company.com"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="jobTitle" className="text-sm">Job Title *</Label>
                    <Input 
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => updateFormData('jobTitle', e.target.value)}
                      placeholder="CTO"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-0.5 sm:mb-1">Integration Details</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tell us about your integration plans</p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm">Which products are you interested in? *</Label>
                  <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                    {products.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={`p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-colors touch-manipulation ${
                          formData.selectedProducts.includes(product.id)
                            ? 'bg-primary/10 border-primary text-foreground'
                            : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <Checkbox 
                            checked={formData.selectedProducts.includes(product.id)}
                            className="border-border flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm font-medium">{product.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="useCase" className="text-sm">Describe your use case *</Label>
                  <Textarea 
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => updateFormData('useCase', e.target.value)}
                    placeholder="Tell us how you plan to integrate Rail Layer APIs into your product..."
                    className="bg-secondary border-border min-h-[90px] sm:min-h-[100px] text-sm sm:text-base"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Expected Monthly Volume</Label>
                    <Select 
                      value={formData.expectedVolume} 
                      onValueChange={(value) => updateFormData('expectedVolume', value)}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1k">Less than 1,000 transactions</SelectItem>
                        <SelectItem value="10k">1,000 - 10,000 transactions</SelectItem>
                        <SelectItem value="100k">10,000 - 100,000 transactions</SelectItem>
                        <SelectItem value="1m">100,000+ transactions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Integration Timeline</Label>
                    <Select 
                      value={formData.timeline} 
                      onValueChange={(value) => updateFormData('timeline', value)}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="3months">1-3 months</SelectItem>
                        <SelectItem value="6months">3-6 months</SelectItem>
                        <SelectItem value="exploring">Just exploring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-0.5 sm:mb-1">Review & Submit</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Please review your information before submitting</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">Company</p>
                      <p className="text-foreground font-medium text-sm sm:text-base break-words">{formData.companyName || '-'}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">{formData.website}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">Industry</p>
                      <p className="text-foreground text-sm sm:text-base">{formData.industry || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">Contact</p>
                      <p className="text-foreground font-medium text-sm sm:text-base">{formData.firstName} {formData.lastName}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">Products</p>
                      <p className="text-foreground text-sm sm:text-base break-words">
                        {formData.selectedProducts.length > 0 
                          ? formData.selectedProducts.map(id => 
                              products.find(p => p.id === id)?.name
                            ).join(', ')
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <Checkbox 
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateFormData('agreeTerms', checked === true)}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I agree to the <Link to="/legal/terms" className="text-primary hover:underline">Terms of Service</Link> and understand that my company's information will be used to evaluate our partnership application.
                    </Label>
                  </div>
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <Checkbox 
                      id="privacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => updateFormData('agreePrivacy', checked === true)}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <Label htmlFor="privacy" className="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I have read and agree to the <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </Label>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-sm sm:text-base min-h-10 touch-manipulation"
              >
                Back
              </Button>
              
              {currentStep < 4 ? (
                <Button variant="hero" onClick={nextStep} className="text-sm sm:text-base min-h-10 touch-manipulation">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              ) : (
                <Button 
                  variant="hero" 
                  onClick={handleSubmit}
                  disabled={!formData.agreeTerms || !formData.agreePrivacy}
                  className="text-sm sm:text-base min-h-10 touch-manipulation"
                >
                  Submit Application
                  <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              )}
            </div>
          </Card>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 px-2">
            Already a partner?{' '}
            <Link to="/dashboard" className="text-primary hover:underline">
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;
