import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, AlertCircle, Send, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ui/contact-card";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/TurnstileWidget";

// Build-time public site key. When unset the captcha layer stays dormant
// (the server treats requests without a token as OK if no secret is set).
const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

type FormData = {
  name: string;
  companyName: string;
  department: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot — kept empty by real users
};

export default function Contact() {
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    department: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const captchaRef = useRef<TurnstileWidgetHandle>(null);
  const formStartTs = useRef<number>(Date.now());
  const captchaRequired = TURNSTILE_SITE_KEY.length > 0;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const messageParts: string[] = [];
      if (formData.phone) messageParts.push(`Phone: ${formData.phone}`);
      if (formData.message) messageParts.push(formData.message);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.companyName.trim(),
          department: formData.department.trim(),
          service: "",
          message: messageParts.join("\n\n") || "Contact form submission",
          phone: formData.phone.trim() || undefined,
          website: formData.website,
          formStartTs: formStartTs.current,
          captchaToken: captchaToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      navigate("/thank-you");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      // Turnstile tokens are single-use: reset so a retry gets a fresh token.
      captchaRef.current?.reset();
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <section className="pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
                <ContactCard
                  title="Get in Touch"
                  description="Have questions about our cybersecurity services? Fill out the form and our team will respond within 1 business day."
                  contactInfo={[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "contact@aricatech.com",
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: "+91 70911 75596",
                    },
                    {
                      icon: MapPin,
                      label: "Address",
                      value: "Office 1204, Kotibhaskar & Mahati Residency, Kothrud, Pune 411038",
                      className: "md:col-span-2 lg:col-span-1",
                    },
                  ]}
                >
                  <form onSubmit={handleFormSubmit} className="w-full space-y-4">
                    {/*
                     * Honeypot: hidden from humans (off-screen, no focus, no a11y),
                     * but bots that walk the DOM and fill every input will set it.
                     * The server rejects any submission where `website` is non-empty.
                     */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-10000px",
                        top: "auto",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                      }}
                    >
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        data-1p-ignore
                        data-lpignore="true"
                        data-form-type="other"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
                        >
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="companyName" className="text-sm font-medium">
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your company name"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="department" className="text-sm font-medium">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="e.g. IT, Security, Management"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone <span className="text-muted-foreground text-xs">(optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-muted-foreground text-xs">(optional)</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your security needs..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={3}
                        className="bg-background border-[#3D70B7]/20 focus:border-[#3D70B7] resize-none"
                      />
                    </div>

                    {captchaRequired && (
                      <div className="flex justify-center">
                        <TurnstileWidget
                          ref={captchaRef}
                          siteKey={TURNSTILE_SITE_KEY}
                          onToken={setCaptchaToken}
                        />
                      </div>
                    )}

                    <Button
                      className="w-full bg-[#3D70B7] hover:bg-[#3D70B7]/90 text-white rounded-lg py-3 font-medium gap-2"
                      type="submit"
                      disabled={submitting || (captchaRequired && !captchaToken)}
                    >
                      {submitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Schedule a Call
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </ContactCard>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden mt-12 h-[350px] border border-[#3D70B7]/20"
          >
              <iframe
                title="Arica Tech Security LLP Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5683192726074!2d73.821124!3d18.5032028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf27b58ff65f%3A0x5765fa0aa36e28e!2sMahati%20Residency!5e0!3m2!1sen!2sin!4v1776345725727!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 grayscale-[40%] contrast-[1.1]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-[#3D70B7]/20">
                <p className="font-semibold text-sm mb-1">Arica Tech Security LLP</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Office no: 1204, CTS, 682/686 Kotibhaskar and Mahati Residency, Kothrud, Pune, Maharashtra 411038
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <a href="tel:+917091175596" className="hover:text-[#3D70B7] transition-colors">+91 70911 75596</a>
                  <a href="mailto:contact@aricatech.com" className="hover:text-[#3D70B7] transition-colors">contact@aricatech.com</a>
                </div>
              </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
