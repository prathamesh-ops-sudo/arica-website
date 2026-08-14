import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { 
  Shield, 
  Building2, 
  Banknote,
  Landmark, 
  Briefcase, 
  Factory, 
  Plane, 
  ShoppingCart, 
  GraduationCap,
  Heart,
} from "lucide-react";

const industries = [
  { name: "Banking & Finance", icon: Banknote },
  { name: "Healthcare", icon: Heart },
  { name: "Public Sector", icon: Landmark },
  { name: "Technology", icon: Building2 },
  { name: "Manufacturing", icon: Factory },
  { name: "Aviation & Transport", icon: Plane },
  { name: "E-Commerce", icon: ShoppingCart },
  { name: "Education", icon: GraduationCap },
  { name: "Professional Services", icon: Briefcase },
  { name: "Security & Technology", icon: Shield },
];


export function ClientsSlider() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C2C5A]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-center text-white text-2xl md:text-3xl font-bold tracking-wide mb-3">
          Sectors We Serve
        </h2>
        <p className="text-center text-white/50 text-sm md:text-base">
          Cybersecurity support across a range of industries
        </p>
      </div>
      
      <InfiniteSlider gap={48} duration={30} className="py-4">
        {industries.map((industry, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-[#42BA90]/30 transition-all duration-300 group"
            data-testid={`industry-badge-${index}`}
          >
            <industry.icon className="w-5 h-5 text-[#ACACAC] group-hover:text-[#42BA90] transition-colors" />
            <span className="text-white/70 text-sm font-medium whitespace-nowrap group-hover:text-white transition-colors">
              {industry.name}
            </span>
          </div>
        ))}
      </InfiniteSlider>
      

    </section>
  );
}
