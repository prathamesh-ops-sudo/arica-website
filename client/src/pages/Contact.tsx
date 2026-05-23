import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, AlertCircle, Send, CalendarDays, ArrowRight, SkipForward } from "lucide-react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/ui/contact-card";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type FormData = {
  name: string;
  companyName: string;
  department: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot — kept empty by real users
};

function CalendarStep({
  onSelectDate,
  onSkip,
  submitting,
}: {
  onSelectDate: (date: string) => void;
  onSkip: () => void;
  submitting: boolean;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const goPrevMonth = () => {
    const now = new Date();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    if (prevYear < now.getFullYear() || (prevYear === now.getFullYear() && prevMonth < now.getMonth())) return;
    setCurrentMonth(prevMonth);
    setCurrentYear(prevYear);
    setSelectedDay(null);
  };

  const handleConfirm = () => {
    if (selectedDay) {
      const dateStr = `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`;
      onSelectDate(dateStr);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-[#3D70B7]/10 text-[#3D70B7] mb-4">
          <CalendarDays className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Schedule a Consultation
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Pick a preferred date for a 30-minute security consultation call.
        </p>
      </div>

      <div className="rounded-2xl border border-[#3D70B7]/20 bg-card p-4 md:p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goPrevMonth}
            className="p-2 rounded-lg hover:bg-[#3D70B7]/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            &#8249;
          </button>
          <p className="text-sm md:text-base font-semibold">
            {monthNames[currentMonth]}, {currentYear}
          </p>
          <button
            type="button"
            onClick={goNextMonth}
            className="p-2 rounded-lg hover:bg-[#3D70B7]/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            &#8250;
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="flex items-center justify-center h-8 w-full">
              <span className="text-xs font-medium text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="h-10 w-full" />
            ))}
          {Array(daysInMonth)
            .fill(null)
            .map((_, i) => {
              const day = i + 1;
              const past = isPast(day);
              const todayDay = isToday(day);
              const selected = selectedDay === day;
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={past}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center justify-center h-10 w-full rounded-xl text-sm font-medium transition-all
                    ${past ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-[#3D70B7]/10 cursor-pointer"}
                    ${selected ? "bg-[#3D70B7] text-white hover:bg-[#3D70B7]/90" : ""}
                    ${todayDay && !selected ? "ring-2 ring-[#3D70B7]/40 text-[#3D70B7] font-bold" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
        </div>

        {selectedDay && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-[#3D70B7] mt-4 font-medium"
          >
            Selected: {selectedDay} {monthNames[currentMonth]} {currentYear}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={submitting}
          className="flex-1 border-[#3D70B7]/20 hover:bg-[#3D70B7]/5 rounded-xl py-3 gap-2"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedDay || submitting}
          className="flex-1 bg-[#3D70B7] hover:bg-[#3D70B7]/90 text-white rounded-xl py-3 gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              Confirm Date
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
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
  const formStartTs = useRef<number>(Date.now());

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep(2);
  };

  const submitToServer = async (preferredDate?: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const messageParts = [];
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
          preferredDate: preferredDate || undefined,
          website: formData.website,
          formStartTs: formStartTs.current,
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
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectDate = (date: string) => {
    submitToServer(date);
  };

  const handleSkip = () => {
    submitToServer();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === 1 ? "bg-[#3D70B7] text-white" : "bg-[#3D70B7]/10 text-[#3D70B7]"}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
              Contact Info
            </div>
            <div className="w-8 h-px bg-[#3D70B7]/30" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === 2 ? "bg-[#3D70B7] text-white" : "bg-[#3D70B7]/10 text-[#3D70B7]/50"}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
              Schedule
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
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

                    <Button
                      className="w-full bg-[#3D70B7] hover:bg-[#3D70B7]/90 text-white rounded-lg py-3 font-medium gap-2"
                      type="submit"
                    >
                      <Send className="w-4 h-4" />
                      Next: Schedule a Call
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </ContactCard>
              </motion.div>
            )}

            {step === 2 && (
              <CalendarStep
                key="step2"
                onSelectDate={handleSelectDate}
                onSkip={handleSkip}
                submitting={submitting}
              />
            )}
          </AnimatePresence>

          {/* Google Maps */}
          {step === 1 && (
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
          )}
        </div>
      </section>
    </div>
  );
}
