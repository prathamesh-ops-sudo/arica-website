import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/TurnstileWidget";

const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

function AnimatedInput({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  isTyping = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  isTyping?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="space-y-2 relative">
      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Label 
          htmlFor={id}
          className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
            isFocused || hasValue 
              ? '-top-2.5 text-xs bg-background px-1 text-primary' 
              : 'top-3 text-sm text-muted-foreground'
          }`}
        >
          {label}
        </Label>
        <Input
          id={id}
          data-testid={`input-${id}`}
          type={type}
          placeholder={isFocused ? placeholder : ""}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          className={`bg-background/50 border-border pt-4 transition-all duration-300 ${
            isFocused 
              ? 'border-[#42BA90] shadow-[0_0_15px_rgba(61,112,183,0.3)] ring-1 ring-[#42BA90]/30' 
              : 'hover:border-primary/50'
          }`}
        />
        <AnimatePresence>
          {isTyping && isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function AnimatedTextarea({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  rows = 5,
  isTyping = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  isTyping?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="space-y-2 relative">
      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Label 
          htmlFor={id}
          className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
            isFocused || hasValue 
              ? '-top-2.5 text-xs bg-background px-1 text-primary' 
              : 'top-3 text-sm text-muted-foreground'
          }`}
        >
          {label}
        </Label>
        <Textarea
          id={id}
          data-testid={`textarea-${id}`}
          placeholder={isFocused ? placeholder : ""}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`bg-background/50 border-border pt-5 resize-none transition-all duration-300 ${
            isFocused 
              ? 'border-[#42BA90] shadow-[0_0_15px_rgba(61,112,183,0.3)] ring-1 ring-[#42BA90]/30' 
              : 'hover:border-primary/50'
          }`}
        />
        <AnimatePresence>
          {isTyping && isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-5"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-12 text-center relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle at center, rgba(66, 186, 144, 0.2) 0%, transparent 70%)'
        }}
      />
      
      <motion.div 
        className="inline-flex p-4 rounded-full bg-[#42BA90]/10 text-[#42BA90] mb-6 relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(66, 186, 144, 0.4)',
              '0 0 0 20px rgba(66, 186, 144, 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <CheckCircle className="w-12 h-12" />
      </motion.div>
      
      <motion.h3 
        className="font-display text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Message Received!
      </motion.h3>
      
      <motion.p 
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Thank you for reaching out. Our team will contact you within 24 hours.
      </motion.p>
      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#42BA90]/50 rounded-full"
          initial={{ 
            x: "50%", 
            y: "50%",
            scale: 0,
          }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ 
            duration: 1.5,
            delay: 0.3 + i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingFields, setTypingFields] = useState<Record<string, boolean>>({});
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
    website: "", // honeypot — kept empty by real users
  });
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const captchaRef = useRef<TurnstileWidgetHandle>(null);
  const formStartTs = useRef<number>(Date.now());
  const captchaRequired = TURNSTILE_SITE_KEY.length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    setTypingFields(prev => ({ ...prev, [field]: true }));
    
    if (typingTimeouts.current[field]) {
      clearTimeout(typingTimeouts.current[field]);
    }
    
    typingTimeouts.current[field] = setTimeout(() => {
      setTypingFields(prev => ({ ...prev, [field]: false }));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      Object.values(typingTimeouts.current).forEach(clearTimeout);
    };
  }, []);

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
        body: JSON.stringify({
          ...formData,
          formStartTs: formStartTs.current,
          captchaToken: captchaToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      // Turnstile tokens are single-use: reset so a retry gets a fresh token.
      captchaRef.current?.reset();
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <SuccessAnimation />
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", company: "", service: "", message: "", website: "" });
                formStartTs.current = Date.now();
              }}
            variant="outline"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-8 space-y-6 relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(61, 112, 183, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(61, 112, 183, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(61, 112, 183, 0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

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
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

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

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatedInput
          id="name"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          disabled={submitting}
          isTyping={typingFields.name}
        />
        <AnimatedInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          disabled={submitting}
          isTyping={typingFields.email}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatedInput
          id="company"
          label="Company Name"
          placeholder="Your Company"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          disabled={submitting}
          isTyping={typingFields.company}
        />
        <div className="space-y-2">
          <Label htmlFor="service">Service Interested In</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value })}
            disabled={submitting}
          >
            <SelectTrigger
              data-testid="select-service"
              className="bg-background/50 border-border transition-all duration-300 hover:border-primary/50 focus:border-primary focus:shadow-[0_0_15px_rgba(61,112,183,0.3)] focus:ring-1 focus:ring-[#42BA90]/30"
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

      <AnimatedTextarea
        id="message"
        label="Message"
        placeholder="Tell us about your security needs..."
        value={formData.message}
        onChange={(e) => handleInputChange('message', e.target.value)}
        required
        disabled={submitting}
        rows={5}
        isTyping={typingFields.message}
      />

      {captchaRequired && (
        <div className="flex justify-center">
          <TurnstileWidget
            ref={captchaRef}
            siteKey={TURNSTILE_SITE_KEY}
            onToken={setCaptchaToken}
          />
        </div>
      )}

      <motion.button
        type="submit"
        data-testid="button-submit-contact"
        disabled={submitting || (captchaRequired && !captchaToken)}
        className="w-full relative overflow-hidden rounded-lg py-3 px-6 font-semibold text-white bg-gradient-to-r from-[#1C2C5A] to-[#010101] transition-all duration-300 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={submitting ? {
            background: [
              'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
            ],
            x: ['-100%', '100%'],
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            {submitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Sending...</span>
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
        
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(61, 112, 183, 0.3)',
              '0 0 40px rgba(61, 112, 183, 0.5)',
              '0 0 20px rgba(61, 112, 183, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </motion.form>
  );
}
