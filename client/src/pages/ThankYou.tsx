import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background">

      <section className="pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16"
          >
            <motion.div
              className="inline-flex p-5 rounded-full bg-[#42BA90]/10 text-[#42BA90] mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16" />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Thank You!
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Your message has been received successfully.
            </motion.p>

            <motion.p
              className="text-sm md:text-base text-muted-foreground mb-10 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Our team will review your inquiry and get back to you within 24 hours. We look forward to helping secure your business.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-[#3D70B7] hover:bg-[#3D70B7]/90 text-white rounded-xl px-8 py-6 text-base font-semibold gap-2"
                >
                  Back to Home
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
