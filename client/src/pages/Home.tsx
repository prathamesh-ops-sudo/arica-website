import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { FluidSimulation } from "@/components/ui/fluid-simulation";
import { R3FCyberHero } from "@/components/ui/r3f-cyber-hero";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background aurora-bg relative">
      <R3FCyberHero />
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <FluidSimulation colorScheme="cyan" intensity={0.1} />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HorizonHeroSection />
        <ForensicsSection />
        <AsciiHeroSection />
        <ComplianceSection />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
