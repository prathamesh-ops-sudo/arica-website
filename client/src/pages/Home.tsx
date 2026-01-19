import { Navbar } from "@/components/Navbar";
import { ScrollExpansionHero } from "@/components/ui/scroll-expansion-hero";
import { ForensicsSection } from "@/components/ForensicsSection";
import { AsciiHeroSection } from "@/components/AsciiHeroSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollExpansionHero
        title="ARICA SECURITY"
        subtitle="Enterprise Cybersecurity Solutions"
        scrollToExpand="Scroll to explore"
      >
        <div className="aurora-bg">
          <ForensicsSection />
          <AsciiHeroSection />
          <ComplianceSection />
          <CTA />
          <Footer />
        </div>
      </ScrollExpansionHero>
    </div>
  );
}
