import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import PartnerSignup from "./pages/PartnerSignup";

// Dashboard
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import DashboardProducts from "./pages/dashboard/Products";
import ProductDocumentation from "./pages/dashboard/ProductDocumentation";
import DashboardAPIKeys from "./pages/dashboard/APIKeys";
import DashboardPaymentPlans from "./pages/dashboard/PaymentPlans";
import DashboardAccountLinking from "./pages/dashboard/AccountLinking";
import DashboardRiskEngine from "./pages/dashboard/RiskEngine";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import DashboardWebhooks from "./pages/dashboard/Webhooks";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardTeam from "./pages/dashboard/TeamManagement";
import DashboardLogs from "./pages/dashboard/ActivityLogs";
import DashboardPlayground from "./pages/dashboard/APIPlayground";
import DashboardHelp from "./pages/dashboard/Help";

// Developer Pages
import APIReference from "./pages/developers/APIReference";
import SDKs from "./pages/developers/SDKs";
import Changelog from "./pages/developers/Changelog";
import Status from "./pages/developers/Status";
import Quickstart from "./pages/developers/Quickstart";

// Company Pages
import About from "./pages/company/About";
import Blog from "./pages/company/Blog";
import Careers from "./pages/company/Careers";
import Press from "./pages/company/Press";
import Contact from "./pages/company/Contact";
import FAQ from "./pages/company/FAQ";
import CaseStudies from "./pages/company/CaseStudies";

// Legal Pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Security from "./pages/legal/Security";
import Compliance from "./pages/legal/Compliance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partner-signup" element={<PartnerSignup />} />
          
          {/* Developer Pages */}
          <Route path="/developers/api-reference" element={<APIReference />} />
          <Route path="/developers/sdks" element={<SDKs />} />
          <Route path="/developers/changelog" element={<Changelog />} />
          <Route path="/developers/status" element={<Status />} />
          <Route path="/developers/quickstart" element={<Quickstart />} />
          
          {/* Company Pages */}
          <Route path="/company/about" element={<About />} />
          <Route path="/company/blog" element={<Blog />} />
          <Route path="/company/careers" element={<Careers />} />
          <Route path="/company/press" element={<Press />} />
          <Route path="/company/contact" element={<Contact />} />
          <Route path="/company/faq" element={<FAQ />} />
          <Route path="/company/case-studies" element={<CaseStudies />} />
          
          {/* Legal Pages */}
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/security" element={<Security />} />
          <Route path="/legal/compliance" element={<Compliance />} />
          
          {/* Dashboard Routes */}
          {/* <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route path="products/:productId" element={<ProductDocumentation />} />
            <Route path="api-keys" element={<DashboardAPIKeys />} />
            <Route path="payment-plans" element={<DashboardPaymentPlans />} />
            <Route path="account-linking" element={<DashboardAccountLinking />} />
            <Route path="risk-engine" element={<DashboardRiskEngine />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="webhooks" element={<DashboardWebhooks />} />
            <Route path="settings" element={<DashboardSettings />} />
            <Route path="team" element={<DashboardTeam />} />
            <Route path="logs" element={<DashboardLogs />} />
            <Route path="playground" element={<DashboardPlayground />} />
            <Route path="help" element={<DashboardHelp />} />
          </Route> */}
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
