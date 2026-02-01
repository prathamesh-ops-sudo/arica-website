import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { R3FCyberHero } from "@/components/ui/r3f-cyber-hero";
import { ClientsSlider } from "@/components/ClientsSlider";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] relative">
      <WebGLShader colorScheme="neutral" intensity={0.6} />
      <R3FCyberHero />
      <div className="relative z-10">
        <Navbar />
        <HorizonHeroSection />
        <ClientsSlider />
        <ForensicsSection />
        <AsciiHeroSection />
        <ComplianceSection />
        <CTA />
      </div>
    </div>
  );
}
