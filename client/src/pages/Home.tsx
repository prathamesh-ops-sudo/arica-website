import { Navbar } from "@/components/Navbar";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { ClientsSlider } from "@/components/ClientsSlider";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { ThreatVortex } from "@/components/ThreatVortex";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
import { lazy, Suspense } from "react";

const WebGLShader = lazy(() => import("@/components/ui/web-gl-shader").then(m => ({ default: m.WebGLShader })));
const R3FCyberHero = lazy(() => import("@/components/ui/r3f-cyber-hero").then(m => ({ default: m.R3FCyberHero })));

function MobileBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-30" style={{
        background: `radial-gradient(ellipse at 30% 20%, rgba(123,47,224,0.15) 0%, transparent 50%),
                     radial-gradient(ellipse at 70% 80%, rgba(157,78,221,0.1) 0%, transparent 50%)`
      }} />
    </div>
  );
}

export default function Home() {
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {isMobileOrTablet ? (
        <MobileBackground />
      ) : (
        <Suspense fallback={null}>
          <WebGLShader colorScheme="neutral" intensity={0.6} />
          <R3FCyberHero />
        </Suspense>
      )}
      <div className="relative z-10">
        <Navbar />
        <HorizonHeroSection />
        <ClientsSlider />
        <ForensicsSection />
        <ThreatVortex />
        <AsciiHeroSection />
        <ComplianceSection />
        <CTA />
      </div>
    </div>
  );
}
