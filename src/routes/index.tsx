import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const PartnerSignup = lazy(() => import("@/pages/PartnerSignup"));

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

// Dashboard (uncomment to enable)
// const DashboardLayout = lazy(() => import("@/components/dashboard/DashboardLayout").then((m) => ({ default: m.DashboardLayout })));
// const Dashboard = lazy(() => import("@/pages/Dashboard"));
// const DashboardProducts = lazy(() => import("@/pages/dashboard/Products"));
// const ProductDocumentation = lazy(() => import("@/pages/dashboard/ProductDocumentation"));
// const DashboardAPIKeys = lazy(() => import("@/pages/dashboard/APIKeys"));
// const DashboardPaymentPlans = lazy(() => import("@/pages/dashboard/PaymentPlans"));
// const DashboardAccountLinking = lazy(() => import("@/pages/dashboard/AccountLinking"));
// const DashboardRiskEngine = lazy(() => import("@/pages/dashboard/RiskEngine"));
// const DashboardAnalytics = lazy(() => import("@/pages/dashboard/Analytics"));
// const DashboardWebhooks = lazy(() => import("@/pages/dashboard/Webhooks"));
// const DashboardSettings = lazy(() => import("@/pages/dashboard/Settings"));
// const DashboardTeam = lazy(() => import("@/pages/dashboard/TeamManagement"));
// const DashboardLogs = lazy(() => import("@/pages/dashboard/ActivityLogs"));
// const DashboardPlayground = lazy(() => import("@/pages/dashboard/APIPlayground"));
// const DashboardHelp = lazy(() => import("@/pages/dashboard/Help"));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading…</div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/partner-signup" element={<PartnerSignup />} />

        {/* <Route path="/developers/api-reference" element={<APIReference />} />
        <Route path="/developers/sdks" element={<SDKs />} />
        <Route path="/developers/changelog" element={<Changelog />} />
        <Route path="/developers/status" element={<Status />} />
        <Route path="/developers/quickstart" element={<Quickstart />} /> */}

        <Route path="/company/about" element={<About />} />
        <Route path="/company/blog" element={<Blog />} />
        <Route path="/company/careers" element={<Careers />} />
        <Route path="/company/press" element={<Press />} />
        <Route path="/company/contact" element={<Contact />} />
        <Route path="/company/faq" element={<FAQ />} />
        <Route path="/company/case-studies" element={<CaseStudies />} />

        <Route path="/legal/privacy" element={<Privacy />} />
        {/* <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/security" element={<Security />} />
        <Route path="/legal/compliance" element={<Compliance />} /> */}

        {/* Dashboard routes (uncomment lazy imports above and this block to enable) */}
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
