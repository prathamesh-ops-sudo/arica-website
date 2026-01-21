import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@aricatech.security",
    description: "We respond within 24 hours",
    isEmergency: false,
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri 9AM-6PM PST",
    isEmergency: false,
  },
  {
    icon: MapPin,
    title: "Location",
    value: "San Francisco, CA",
    description: "Headquarters",
    isEmergency: false,
  },
  {
    icon: Clock,
    title: "Emergency",
    value: "24/7 Hotline",
    description: "For active incidents",
    isEmergency: true,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background aurora-bg">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.12) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Contact Us
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Let's Secure Your{" "}
              <span className="text-gradient">Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to protect your business? Get in touch for a free security
              assessment.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  data-testid={`contact-info-${index}`}
                  className={`rounded-xl p-5 border flex items-start gap-4 ${
                    info.isEmergency 
                      ? 'border-bulgarian-rose/30 bg-bulgarian-rose/10' 
                      : 'border-white/10 bg-card/50'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${
                    info.isEmergency 
                      ? 'bg-bulgarian-rose/20 text-red-400' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5 text-halo-white">{info.title}</p>
                    <p className={`text-sm font-medium ${info.isEmergency ? 'text-red-400' : 'text-primary'}`}>{info.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {info.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-xl p-5 border border-white/10 bg-card/50"
              >
                <h3 className="font-display font-bold mb-4">
                  Global Offices
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="text-halo-white font-medium">
                      San Francisco
                    </span>{" "}
                    - Headquarters
                  </li>
                  <li>
                    <span className="text-halo-white font-medium">London</span>{" "}
                    - European Operations
                  </li>
                  <li>
                    <span className="text-halo-white font-medium">Singapore</span>{" "}
                    - Asia Pacific
                  </li>
                  <li>
                    <span className="text-halo-white font-medium">Dubai</span>{" "}
                    - Middle East
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
