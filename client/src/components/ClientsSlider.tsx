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

const industries = [
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

const clientLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/1200px-Oracle_logo.svg.png" },
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png" },
  { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1200px-Intel_logo_%282006-2020%29.svg.png" },
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1200px-Dell_Logo.svg.png" },
  { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/1200px-SAP_2011_logo.svg.png" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png" },
];

export function ClientsSlider() {
  return (
    <section className="py-16 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C2C5A]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-[#8e8e93] text-sm uppercase tracking-[0.3em] mb-2">
          Trusted By Industry Leaders
        </h3>
        <p className="text-center text-white/40 text-xs">
          Protecting enterprises across all sectors
        </p>
      </div>
      
      <InfiniteSlider gap={48} duration={30} className="py-4">
        {industries.map((industry, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-[#42BA90]/30 transition-all duration-300 group"
            data-testid={`industry-badge-${index}`}
          >
            <industry.icon className="w-5 h-5 text-[#8e8e93] group-hover:text-[#42BA90] transition-colors" />
            <span className="text-white/70 text-sm font-medium whitespace-nowrap group-hover:text-white transition-colors">
              {industry.name}
            </span>
          </div>
        ))}
      </InfiniteSlider>
      
      <InfiniteSlider gap={48} duration={35} reverse className="py-4 mt-4">
        {clientLogos.map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-[#42BA90]/30 transition-all duration-300 group"
            data-testid={`client-logo-${index}`}
          >
            <img 
              src={client.logo} 
              alt={`${client.name} logo`}
              className="h-6 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity brightness-0 invert"
            />
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}
