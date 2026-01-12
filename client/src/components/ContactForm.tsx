import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MorphButton } from "@/components/ui/morph-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-12 text-center"
      >
        <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-4">
          Message Received!
        </h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. Our team will contact you within 24 hours.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", company: "", service: "", message: "" });
          }}
          variant="outline"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-8 space-y-6"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            data-testid="input-name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={submitting}
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            data-testid="input-email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={submitting}
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            data-testid="input-company"
            placeholder="Your Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={submitting}
            className="bg-background/50 border-border focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service Interested In</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value })}
            disabled={submitting}
          >
            <SelectTrigger
              data-testid="select-service"
              className="bg-background/50 border-border"
            >
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prevention">Prevention</SelectItem>
              <SelectItem value="forensics">Forensics</SelectItem>
              <SelectItem value="legal">Legal Support</SelectItem>
              <SelectItem value="recovery">Post-Attack Recovery</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Package</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          data-testid="textarea-message"
          placeholder="Tell us about your security needs..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={submitting}
          rows={5}
          className="bg-background/50 border-border focus:border-primary resize-none"
        />
      </div>

      <MorphButton
        type="submit"
        data-testid="button-submit-contact"
        text="Send Message"
        icon={<Send className="w-5 h-5" />}
        isLoading={submitting}
        className="w-full glow-cyan font-semibold"
      />
    </motion.form>
  );
}
