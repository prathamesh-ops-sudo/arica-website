import { Navbar } from "@/components/Navbar";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { ClientsSlider } from "@/components/ClientsSlider";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { ThreatVortex } from "@/components/ThreatVortex";

function SubtleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-30" style={{
        background: `radial-gradient(ellipse at 30% 20%, rgba(0,180,216,0.15) 0%, transparent 50%),
                     radial-gradient(ellipse at 70% 80%, rgba(0,212,255,0.1) 0%, transparent 50%)`
      }} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] relative">
      <SubtleBackground />
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
