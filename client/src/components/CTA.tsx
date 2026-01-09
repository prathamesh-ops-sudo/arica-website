import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex p-4 rounded-2xl bg-primary/10 mb-8"
          >
            <Shield className="w-12 h-12 text-primary" />
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Secure Your{" "}
            <span className="text-gradient">Digital Future?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Don't wait for a breach. Contact us today for a free security
            assessment and discover how we can protect your business.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                data-testid="button-cta-contact"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold text-base px-8 py-6 group"
              >
                Get Free Assessment
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                data-testid="button-cta-services"
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary font-semibold text-base px-8 py-6"
              >
                View Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
