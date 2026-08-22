import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense, useState, type ComponentType } from "react";
import { HyperspaceTransitionProvider } from "@/components/ui/hyperspace-transition";
import { SiteFooter } from "@/components/ui/site-footer";
import { Navbar } from "@/components/Navbar";
import { ThreeDEffectLoader } from "@/components/ui/3d-effect-loader";
import { MobileConversionBar } from "@/components/MobileConversionBar";

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
  "/security-training",
  "/ongoing-support",
  "/security-implementation",
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
const Legal = lazy(() => import("@/pages/Legal"));
const SecurityArchitecture = lazy(() => import("@/pages/SecurityArchitecture"));
const CodeReview = lazy(() => import("@/pages/CodeReview"));
const Certifications = lazy(() => import("@/pages/Certifications"));
const SecurityTraining = lazy(() => import("@/pages/SecurityTraining"));
const OngoingSupport = lazy(() => import("@/pages/OngoingSupport"));
const SecurityImplementation = lazy(() => import("@/pages/SecurityImplementation"));
const TeamDirectors = lazy(() => import("@/pages/TeamDirectors"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

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
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/team" component={TeamDirectors} />
      <Route path="/portal" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/legal/:slug" component={Legal} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isFullscreenRoute = FULLSCREEN_ROUTES.includes(location);
  const isExperienceSubRoute = EXPERIENCE_SUB_ROUTES.includes(location);
  const showMobileConversionBar = location !== "/contact" && !isFullscreenRoute;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <>
      {!isExperienceSubRoute && (
        <a href="/" className="fixed z-[10000]" style={{ top: "calc(1rem - 1px)", left: "calc(1rem - 3px)" }} aria-label="Arica Tech Security LLP Home">
          <img
            src="/arica-logo.webp"
            alt="Arica Tech Security LLP"
            className="h-8 md:h-14 w-auto"
            width={779}
            height={288}
          />
        </a>
      )}
      {!isExperienceSubRoute && (
        <header>
          <nav aria-label="Site navigation">
            <Navbar />
          </nav>
        </header>
      )}
      <main className={showMobileConversionBar ? "mobile-conversion-main" : undefined}>
        <Router />
      </main>
      {!isFullscreenRoute && <SiteFooter />}
      <MobileConversionBar hidden={!showMobileConversionBar} />
      <DeferredCookieConsent />
    </>
  );
}

function DeferredCookieConsent() {
  const [ConsentComponent, setConsentComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void import("@/components/CookieConsent").then(({ CookieConsent }) => {
        if (active) setConsentComponent(() => CookieConsent);
      });
    }, 2000);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return ConsentComponent ? <ConsentComponent /> : null;
}

function DeferredToaster() {
  const [ToasterComponent, setToasterComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void import("@/components/ui/toaster").then(({ Toaster }) => {
        if (active) setToasterComponent(() => Toaster);
      });
    }, 2000);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return ToasterComponent ? <ToasterComponent /> : null;
}

function App() {
  return (
    <HyperspaceTransitionProvider>
      <DeferredToaster />
      <AppContent />
    </HyperspaceTransitionProvider>
  );
}

export default App;
