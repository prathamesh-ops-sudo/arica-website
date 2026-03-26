import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HyperspaceTransitionProvider } from "@/components/ui/hyperspace-transition";
import { SiteFooter } from "@/components/ui/site-footer";

const FULLSCREEN_ROUTES = ["/experience", "/attack-globe"];
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import ServicesPage from "@/pages/ServicesPage";
import Contact from "@/pages/Contact";
import CaseStudies from "@/pages/CaseStudies";
import Experience from "@/pages/Experience";
import AttackGlobe from "@/pages/AttackGlobe";
import VulnerabilityScanner from "@/pages/VulnerabilityScanner";
import ComplianceDashboard from "@/pages/ComplianceDashboard";
import DevSecOpsPipeline from "@/pages/DevSecOpsPipeline";
import DevSecOps from "@/pages/DevSecOps";
import ApiSecurityLab from "@/pages/ApiSecurityLab";
import CloudSecurityCenter from "@/pages/CloudSecurityCenter";
import MobileSecurity from "@/pages/MobileSecurity";
import RiskAssessment from "@/pages/RiskAssessment";
import SecurityPolicies from "@/pages/SecurityPolicies";
import SecurityArchitecture from "@/pages/SecurityArchitecture";
import CodeReview from "@/pages/CodeReview";
import Certifications from "@/pages/Certifications";
import SecurityTraining from "@/pages/SecurityTraining";
import OngoingSupport from "@/pages/OngoingSupport";
import SecurityImplementation from "@/pages/SecurityImplementation";
import TeamDirectors from "@/pages/TeamDirectors";

function Router() {
  return (
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
      <Route path="/team" component={TeamDirectors} />
      <Route path="/portal" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isFullscreenRoute = FULLSCREEN_ROUTES.includes(location);
  const isExperiencePage = location === "/experience";
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <>
      {!isExperiencePage && (
        <a href="/" className="fixed top-4 left-4 md:top-6 md:left-6 z-[9999]" aria-label="Arica Tech Security LLP Home">
          <img
            src="/arica-logo.png"
            alt="Arica Tech Security LLP"
            className="h-8 md:h-10 w-auto"
          />
        </a>
      )}
      <Router />
      {!isFullscreenRoute && <SiteFooter />}
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
