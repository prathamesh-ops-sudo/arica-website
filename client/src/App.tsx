import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
      <Route path="/portal" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
