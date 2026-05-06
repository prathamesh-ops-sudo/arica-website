import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HyperspaceTransitionProvider } from "@/components/ui/hyperspace-transition";
import { SiteFooter } from "@/components/ui/site-footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ThreeDEffectLoader } from "@/components/ui/3d-effect-loader";

const FULLSCREEN_ROUTES = ["/experience"];

const EXPERIENCE_SUB_ROUTES = [
  "/experience",
  "/attack-globe",
  "/vulnerability-scanner",
  "/compliance-dashboard",
  "/devsecops-pipeline",
  "/devsecops",
  "/api-security-lab",
  "/cloud-security-center",
  "/mobile-security",
  "/risk-assessment",
  "/security-policies",
  "/security-architecture",
  "/code-review",
  "/certifications",
  "/security-training",
  "/ongoing-support",
  "/security-implementation",
  "/test",
];

// Eager-load home page for fast initial render
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Lazy-load secondary pages for faster initial bundle
const About = lazy(() => import("@/pages/About"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const CaseStudies = lazy(() => import("@/pages/CaseStudies"));
const Experience = lazy(() => import("@/pages/Experience"));
const AttackGlobe = lazy(() => import("@/pages/AttackGlobe"));
const VulnerabilityScanner = lazy(() => import("@/pages/VulnerabilityScanner"));
const ComplianceDashboard = lazy(() => import("@/pages/ComplianceDashboard"));
const DevSecOpsPipeline = lazy(() => import("@/pages/DevSecOpsPipeline"));
const DevSecOps = lazy(() => import("@/pages/DevSecOps"));
const ApiSecurityLab = lazy(() => import("@/pages/ApiSecurityLab"));
const CloudSecurityCenter = lazy(() => import("@/pages/CloudSecurityCenter"));
const MobileSecurity = lazy(() => import("@/pages/MobileSecurity"));
const RiskAssessment = lazy(() => import("@/pages/RiskAssessment"));
const SecurityPolicies = lazy(() => import("@/pages/SecurityPolicies"));
const SecurityArchitecture = lazy(() => import("@/pages/SecurityArchitecture"));
const CodeReview = lazy(() => import("@/pages/CodeReview"));
const Certifications = lazy(() => import("@/pages/Certifications"));
const SecurityTraining = lazy(() => import("@/pages/SecurityTraining"));
const OngoingSupport = lazy(() => import("@/pages/OngoingSupport"));
const SecurityImplementation = lazy(() => import("@/pages/SecurityImplementation"));
const TeamDirectors = lazy(() => import("@/pages/TeamDirectors"));
const Test = lazy(() => import("@/pages/Test"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ThreeDEffectLoader />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/forensics" component={ServicesPage} />
      <Route path="/compliance" component={ServicesPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/experience" component={Experience} />
      <Route path="/attack-globe" component={AttackGlobe} />
      <Route path="/vulnerability-scanner" component={VulnerabilityScanner} />
      <Route path="/compliance-dashboard" component={ComplianceDashboard} />
      <Route path="/devsecops-pipeline" component={DevSecOpsPipeline} />
      <Route path="/devsecops" component={DevSecOps} />
      <Route path="/api-security-lab" component={ApiSecurityLab} />
      <Route path="/cloud-security-center" component={CloudSecurityCenter} />
      <Route path="/mobile-security" component={MobileSecurity} />
      <Route path="/risk-assessment" component={RiskAssessment} />
      <Route path="/security-policies" component={SecurityPolicies} />
      <Route path="/security-architecture" component={SecurityArchitecture} />
      <Route path="/code-review" component={CodeReview} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/security-training" component={SecurityTraining} />
      <Route path="/ongoing-support" component={OngoingSupport} />
      <Route path="/security-implementation" component={SecurityImplementation} />
      <Route path="/test" component={Test} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/team" component={TeamDirectors} />
      <Route path="/portal" component={Contact} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isFullscreenRoute = FULLSCREEN_ROUTES.includes(location);
  const isExperienceSubRoute = EXPERIENCE_SUB_ROUTES.includes(location);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <>
      {!isExperienceSubRoute && (
        <a href="/" className="fixed z-[10000]" style={{ top: "calc(1rem - 1px)", left: "calc(1rem - 3px)" }} aria-label="Arica Tech Security LLP Home">
          <img
            src="/arica-logo.png"
            alt="Arica Tech Security LLP"
            className="h-8 md:h-14 w-auto"
          />
        </a>
      )}
      <Router />
      {!isFullscreenRoute && <SiteFooter />}
      <CookieConsent />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HyperspaceTransitionProvider>
          <Toaster />
          <AppContent />
        </HyperspaceTransitionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
