import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ForensicsSection } from "@/components/ForensicsSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ForensicsSection />
      <ComplianceSection />
      <CTA />
      <Footer />
    </div>
  );
}
