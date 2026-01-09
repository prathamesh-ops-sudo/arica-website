import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Secure Your Future?
          </h2>

          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Speak with our principal analysts today to discuss your organization's specific
            security requirements and risk profile.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                data-testid="button-cta-consultation"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Book Consultation
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button
                data-testid="button-cta-case-studies"
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/5 font-semibold"
              >
                View Case Studies
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
