import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background aurora-bg">
      <Navbar />
      <HorizonHeroSection />
      <ForensicsSection />
      <AsciiHeroSection />
      <ComplianceSection />
      <CTA />
      <Footer />
    </div>
  );
}
