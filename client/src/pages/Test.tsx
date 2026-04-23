import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import StellarCardGallerySingle from "@/components/ui/3d-image-gallery";

export default function Test() {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setLocation('/experience')}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
        data-testid="button-back-experience"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Experience</span>
      </motion.button>

      <StellarCardGallerySingle />
    </div>
  );
}
