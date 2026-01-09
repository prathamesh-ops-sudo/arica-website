import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@aricatech.security",
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri 9AM-6PM PST",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "San Francisco, CA",
    description: "Headquarters",
  },
  {
    icon: Clock,
    title: "Emergency",
    value: "24/7 Hotline",
    description: "For active incidents",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Contact Us
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

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  data-testid={`contact-info-${index}`}
                  className="glass rounded-xl p-6 flex items-start gap-4"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{info.title}</p>
                    <p className="text-primary font-medium">{info.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="font-display text-lg font-bold mb-4">
                  Global Offices
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <span className="text-foreground font-medium">
                      San Francisco
                    </span>{" "}
                    - Headquarters
                  </li>
                  <li>
                    <span className="text-foreground font-medium">London</span>{" "}
                    - European Operations
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Singapore</span>{" "}
                    - Asia Pacific
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Dubai</span>{" "}
                    - Middle East
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="aspect-[21/9] bg-secondary flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map would be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  123 Security Boulevard, San Francisco, CA 94102
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
