import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import { ComponentType, useEffect, useRef, useState } from "react";
import { isPrerendering } from "@/lib/webgl-utils";

type HomeSectionLoader = () => Promise<{ default: ComponentType }>;

const loadClientsSlider: HomeSectionLoader = () =>
  import("@/components/ClientsSlider").then(({ ClientsSlider: Component }) => ({
    default: Component,
  }));
const loadForensicsSection: HomeSectionLoader = () =>
  import("@/components/ForensicsSection").then(({ ForensicsSection: Component }) => ({
    default: Component,
  }));
const loadThreatVortex: HomeSectionLoader = () =>
  import("@/components/ThreatVortex").then(({ ThreatVortex: Component }) => ({
    default: Component,
  }));
const loadAsciiHeroSection: HomeSectionLoader = () =>
  import("@/components/AsciiHeroSection").then(({ AsciiHeroSection: Component }) => ({
    default: Component,
  }));
const loadComplianceSection: HomeSectionLoader = () =>
  import("@/components/ComplianceSection").then(({ ComplianceSection: Component }) => ({
    default: Component,
  }));

function DeferredHomeSection({
  load,
  minHeight,
}: {
  load: HomeSectionLoader;
  minHeight: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Section, setSection] = useState<ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    let loading = false;
    const loadSection = () => {
      if (loading) return;
      loading = true;
      load().then(({ default: LoadedSection }) => {
        if (mounted) setSection(() => LoadedSection);
      });
    };

    if (isPrerendering()) {
      loadSection();
      return () => {
        mounted = false;
      };
    }

    const loadWhenNearViewport = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? Infinity;
      if (top < window.innerHeight + 100) {
        loadSection();
        window.removeEventListener("scroll", loadWhenNearViewport);
        window.removeEventListener("resize", loadWhenNearViewport);
      }
    };

    loadWhenNearViewport();
    window.addEventListener("scroll", loadWhenNearViewport, { passive: true });
    window.addEventListener("resize", loadWhenNearViewport);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", loadWhenNearViewport);
      window.removeEventListener("resize", loadWhenNearViewport);
    };
  }, [load]);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {Section ? <Section /> : null}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="relative h-px w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3D70B7]/20 to-transparent" />
    </div>
  );
}

function SubtleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-30" style={{
        background: `radial-gradient(ellipse at 30% 20%, rgba(61,112,183,0.15) 0%, transparent 50%),
                     radial-gradient(ellipse at 70% 80%, rgba(61,112,183,0.1) 0%, transparent 50%)`
      }} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <SubtleBackground />
      <div className="relative z-10">
        <HorizonHeroSection />
        <DeferredHomeSection load={loadClientsSlider} minHeight="15rem" />
        <SectionDivider />
        <DeferredHomeSection load={loadForensicsSection} minHeight="38rem" />
        <SectionDivider />
        <DeferredHomeSection load={loadThreatVortex} minHeight="56rem" />
        <SectionDivider />
        <DeferredHomeSection load={loadAsciiHeroSection} minHeight="52rem" />
        <SectionDivider />
        <DeferredHomeSection load={loadComplianceSection} minHeight="52rem" />
      </div>
    </div>
  );
}
