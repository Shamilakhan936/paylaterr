import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/dashboard";
import { DashboardLayout } from "@/components/dashboard";
import { Loader2 } from "lucide-react";

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const PartnerSignup = lazy(() => import("@/pages/PartnerSignup"));
const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DashboardProducts = lazy(() => import("@/pages/dashboard/Products"));
const ProductDocumentation = lazy(() => import("@/pages/dashboard/ProductDocumentation"));
const DashboardAPIKeys = lazy(() => import("@/pages/dashboard/APIKeys"));
const DashboardPaymentPlans = lazy(() => import("@/pages/dashboard/PaymentPlans"));
const DashboardAccountLinking = lazy(() => import("@/pages/dashboard/AccountLinking"));
const DashboardRiskEngine = lazy(() => import("@/pages/dashboard/RiskEngine"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardWebhooks = lazy(() => import("@/pages/dashboard/Webhooks"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/Settings"));
const DashboardTeam = lazy(() => import("@/pages/dashboard/TeamManagement"));
const DashboardLogs = lazy(() => import("@/pages/dashboard/ActivityLogs"));
const DashboardPlayground = lazy(() => import("@/pages/dashboard/APIPlayground"));
const DashboardHelp = lazy(() => import("@/pages/dashboard/Help"));
const DashboardWidgets = lazy(() => import("@/pages/dashboard/Widgets"));
const DashboardAuditTrail = lazy(() => import("@/pages/dashboard/AuditTrail"));
const DashboardUsage = lazy(() => import("@/pages/dashboard/UsageMetering"));

const APIReference = lazy(() => import("@/pages/developers/APIReference"));
const SDKs = lazy(() => import("@/pages/developers/SDKs"));
const Changelog = lazy(() => import("@/pages/developers/Changelog"));
const Status = lazy(() => import("@/pages/developers/Status"));
const Quickstart = lazy(() => import("@/pages/developers/Quickstart"));

const About = lazy(() => import("@/pages/company/About"));
const Blog = lazy(() => import("@/pages/company/Blog"));
const Careers = lazy(() => import("@/pages/company/Careers"));
const Press = lazy(() => import("@/pages/company/Press"));
const Contact = lazy(() => import("@/pages/company/Contact"));
const FAQ = lazy(() => import("@/pages/company/FAQ"));
const CaseStudies = lazy(() => import("@/pages/company/CaseStudies"));

const Privacy = lazy(() => import("@/pages/legal/Privacy"));
const Terms = lazy(() => import("@/pages/legal/Terms"));
const Security = lazy(() => import("@/pages/legal/Security"));
const Compliance = lazy(() => import("@/pages/legal/Compliance"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/partner-signup" element={<PartnerSignup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/developers/api-reference" element={<APIReference />} />
        <Route path="/developers/sdks" element={<SDKs />} />
        <Route path="/developers/changelog" element={<Changelog />} />
        <Route path="/developers/status" element={<Status />} />
        <Route path="/developers/quickstart" element={<Quickstart />} />

        <Route path="/company/about" element={<About />} />
        <Route path="/company/blog" element={<Blog />} />
        <Route path="/company/careers" element={<Careers />} />
        <Route path="/company/press" element={<Press />} />
        <Route path="/company/contact" element={<Contact />} />
        <Route path="/company/faq" element={<FAQ />} />
        <Route path="/company/case-studies" element={<CaseStudies />} />

        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/security" element={<Security />} />
        <Route path="/legal/compliance" element={<Compliance />} />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
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
          <Route path="widgets" element={<DashboardWidgets />} />
          <Route path="audit" element={<DashboardAuditTrail />} />
          <Route path="usage" element={<DashboardUsage />} />
        </Route> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
