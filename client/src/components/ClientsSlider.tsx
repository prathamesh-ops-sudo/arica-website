import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { 
  Shield, 
  Building2, 
  Landmark, 
  Briefcase, 
  Factory, 
  Plane, 
  ShoppingCart, 
  GraduationCap,
  Heart,
  Banknote
} from "lucide-react";

const clients = [
  { name: "Fortune 500 Banks", icon: Banknote },
  { name: "Healthcare Systems", icon: Heart },
  { name: "Government Agencies", icon: Landmark },
  { name: "Tech Enterprises", icon: Building2 },
  { name: "Manufacturing", icon: Factory },
  { name: "Aviation & Defense", icon: Plane },
  { name: "E-Commerce Giants", icon: ShoppingCart },
  { name: "Educational Institutions", icon: GraduationCap },
  { name: "Financial Services", icon: Briefcase },
  { name: "Security Firms", icon: Shield },
];

export function ClientsSlider() {
  return (
    <section className="py-16 bg-[#121212] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a84ff]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-[#8e8e93] text-sm uppercase tracking-[0.3em] mb-2">
          Trusted By Industry Leaders
        </h3>
        <p className="text-center text-white/40 text-xs">
          Protecting enterprises across all sectors
        </p>
      </div>
      
      <InfiniteSlider gap={48} duration={30} className="py-4">
        {clients.map((client, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-[#0a84ff]/30 transition-all duration-300 group"
            data-testid={`client-badge-${index}`}
          >
            <client.icon className="w-5 h-5 text-[#8e8e93] group-hover:text-[#0a84ff] transition-colors" />
            <span className="text-white/70 text-sm font-medium whitespace-nowrap group-hover:text-white transition-colors">
              {client.name}
            </span>
          </div>
        ))}
      </InfiniteSlider>
      
      <InfiniteSlider gap={48} duration={35} reverse className="py-4 mt-4">
        {clients.slice().reverse().map((client, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-[#0a84ff]/30 transition-all duration-300 group"
            data-testid={`client-badge-reverse-${index}`}
          >
            <client.icon className="w-5 h-5 text-[#8e8e93] group-hover:text-[#0a84ff] transition-colors" />
            <span className="text-white/70 text-sm font-medium whitespace-nowrap group-hover:text-white transition-colors">
              {client.name}
            </span>
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}
