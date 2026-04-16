import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const services = [
  "Cybersecurity",
  "Digital Forensics",
  "Compliance & Governance",
  "Vulnerability Assessment",
  "Incident Response",
  "Other",
];

function SuccessAnimation({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        className="inline-flex p-4 rounded-full bg-[#42BA90]/10 text-[#42BA90] mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <CheckCircle className="w-12 h-12" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-3">Message Received!</h3>
      <p className="text-muted-foreground mb-6">
        Thank you for reaching out. Our team will contact you within 24 hours.
      </p>
      <button
        onClick={onReset}
        className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      >
        Send another message
      </button>
    </motion.div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          company: "",
          service: selectedServices.join(", "),
          message: formData.message,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
    setSelectedServices([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
            {/* Left side - Form */}
            <div className="py-8 md:py-12 lg:pr-12">
              {submitted ? (
                <SuccessAnimation onReset={handleReset} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    How can we help?
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    Looking for cybersecurity support? Reach out to our team.
                  </p>

                  {/* Contact links */}
                  <div className="flex flex-col gap-3 mb-10">
                    <a
                      href="tel:+917091175596"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call us
                    </a>
                    <a
                      href="mailto:contact@aricatech.com"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Shoot us an email
                    </a>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
                        >
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* First name + Last name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                          disabled={submitting}
                          className="bg-background border-border/60 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          disabled={submitting}
                          className="bg-background border-border/60 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Work email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Work email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        disabled={submitting}
                        className="bg-background border-border/60 focus:border-primary"
                      />
                    </div>

                    {/* Phone number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone number
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 px-3 rounded-md border border-border/60 bg-background text-sm text-muted-foreground shrink-0">
                          IN
                          <span className="text-xs">&#9662;</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 00000 00000"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={submitting}
                          className="bg-background border-border/60 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Services checkboxes */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Which services are you interested in?
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {services.map((service) => (
                          <label
                            key={service}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedServices.includes(service)}
                              onCheckedChange={() => toggleService(service)}
                              disabled={submitting}
                              className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              {service}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Is there anything particular you need help with?"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        required
                        disabled={submitting}
                        rows={4}
                        className="bg-background border-border/60 focus:border-primary resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-lg py-3 px-6 font-medium text-white bg-gradient-to-r from-[#1C2C5A] to-[#010101] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {submitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send message
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Right side - Google Maps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden min-h-[400px] lg:min-h-0"
            >
              <iframe
                title="Arica Tech Security LLP Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5683192726074!2d73.821124!3d18.5032028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf27b58ff65f%3A0x5765fa0aa36e28e!2sMahati%20Residency!5e0!3m2!1sen!2sin!4v1776345725727!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 grayscale-[40%] contrast-[1.1]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Map overlay with office info */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-border/40">
                <p className="font-semibold text-sm mb-1">
                  Arica Tech Security LLP
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Office no: 1204, CTS, 682/686 Kotibhaskar and Mahati
                  Residency, Kothrud, Pune, Maharashtra 411038
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <a
                    href="tel:+917091175596"
                    className="hover:text-primary transition-colors"
                  >
                    +91 70911 75596
                  </a>
                  <a
                    href="mailto:contact@aricatech.com"
                    className="hover:text-primary transition-colors"
                  >
                    contact@aricatech.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
