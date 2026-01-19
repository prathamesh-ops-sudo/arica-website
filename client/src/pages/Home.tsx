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
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1280&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80"
        title="ARICA SECURITY"
        subtitle="Enterprise Cybersecurity"
        scrollToExpand="Scroll to explore"
        textBlend={true}
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
