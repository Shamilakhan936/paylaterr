import { useState } from "react";
import { Link } from "react-router-dom";
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
  { id: "travel", name: "Paylaterr Travel" },
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full p-8 bg-card border-border text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest in becoming a Paylaterr partner. We'll review your application and get back to you within 1-2 business days.
          </p>
          
          <div className="bg-secondary p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-foreground mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">Our team reviews your application</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">You'll receive sandbox API keys via email</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">Start integrating with our sandbox environment</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="hero" className="flex-1" asChild>
              <Link to="/developers/api-reference">View API Docs</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Paylaterr</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Become a Partner</h1>
            <p className="text-muted-foreground">
              Get access to our enterprise APIs and start building with Paylaterr
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <Zap className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">Instant sandbox access</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <Clock className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm text-foreground">1-2 day approval</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <Key className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">Free API testing</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step.id === currentStep 
                    ? 'text-primary' 
                    : step.id < currentStep 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step.id < currentStep 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <Card className="p-6 lg:p-8 bg-card border-border">
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Company Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your organization</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input 
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      placeholder="Acme Inc."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website *</Label>
                    <Input 
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry *</Label>
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
                  <div className="space-y-2">
                    <Label>Company Size *</Label>
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

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Contact Details</h2>
                  <p className="text-sm text-muted-foreground">Who should we contact about your integration?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="John"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@company.com"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
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

            {/* Step 3: Integration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Integration Details</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your integration plans</p>
                </div>

                <div className="space-y-3">
                  <Label>Which products are you interested in? *</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {products.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.selectedProducts.includes(product.id)
                            ? 'bg-primary/10 border-primary text-foreground'
                            : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={formData.selectedProducts.includes(product.id)}
                            className="border-border"
                          />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Describe your use case *</Label>
                  <Textarea 
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => updateFormData('useCase', e.target.value)}
                    placeholder="Tell us how you plan to integrate Paylaterr APIs into your product..."
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expected Monthly Volume</Label>
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
                  <div className="space-y-2">
                    <Label>Integration Timeline</Label>
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

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground">Please review your information before submitting</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Company</p>
                      <p className="text-foreground font-medium">{formData.companyName || '-'}</p>
                      <p className="text-sm text-muted-foreground">{formData.website}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
                      <p className="text-foreground">{formData.industry || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-foreground font-medium">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Products</p>
                      <p className="text-foreground">
                        {formData.selectedProducts.length > 0 
                          ? formData.selectedProducts.map(id => 
                              products.find(p => p.id === id)?.name
                            ).join(', ')
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateFormData('agreeTerms', checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the <Link to="/legal/terms" className="text-primary hover:underline">Terms of Service</Link> and understand that my company's information will be used to evaluate our partnership application.
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="privacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => updateFormData('agreePrivacy', checked === true)}
                    />
                    <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                      I have read and agree to the <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < 4 ? (
                <Button variant="hero" onClick={nextStep}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  variant="hero" 
                  onClick={handleSubmit}
                  disabled={!formData.agreeTerms || !formData.agreePrivacy}
                >
                  Submit Application
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>

          {/* Already a partner? */}
          <p className="text-center text-sm text-muted-foreground mt-6">
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
